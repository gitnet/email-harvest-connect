import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Mail, Download, Send, Key, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailScraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [getResponseApiKey, setGetResponseApiKey] = useState('');
  const [getResponseLists, setGetResponseLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Load saved data from localStorage
  useEffect(() => {
    const savedEmails = localStorage.getItem('scrapedEmails');
    const savedApiKey = localStorage.getItem('getResponseApiKey');
    
    if (savedEmails) {
      setEmails(JSON.parse(savedEmails));
    }
    if (savedApiKey) {
      setGetResponseApiKey(savedApiKey);
    }
  }, []);

  // Save emails to localStorage
  const saveEmails = (emailData) => {
    localStorage.setItem('scrapedEmails', JSON.stringify(emailData));
  };

  // Extract emails from text using regex
  const extractEmails = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailRegex) || [];
  };

  // Get domain from URL
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  };

  // Scrape website for emails
  const scrapeWebsite = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Note: Due to CORS limitations, we're using a proxy service
      // In a real-world scenario, you'd need a backend service
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        const foundEmails = extractEmails(data.contents);
        const uniqueEmails = [...new Set(foundEmails)];
        const domain = getDomain(url);
        
        if (uniqueEmails.length > 0) {
          const newEmailEntry = {
            domain,
            url,
            emails: uniqueEmails,
            scrapedAt: new Date().toISOString(),
            id: Date.now()
          };
          
          const updatedEmails = [newEmailEntry, ...emails];
          setEmails(updatedEmails);
          saveEmails(updatedEmails);
          
          toast({
            title: "Success!",
            description: `Found ${uniqueEmails.length} emails from ${domain}`,
          });
        } else {
          toast({
            title: "No emails found",
            description: "No email addresses were found on this website",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: "Failed to scrape the website. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUrl('');
    }
  };

  // Connect to GetResponse API
  const connectGetResponse = async () => {
    if (!getResponseApiKey) {
      toast({
        title: "Error",
        description: "Please enter your GetResponse API key",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // GetResponse API call to get campaigns (lists)
      const response = await fetch('https://api.getresponse.com/v3/campaigns', {
        headers: {
          'X-Auth-Token': `api-key ${getResponseApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const lists = await response.json();
        setGetResponseLists(lists);
        localStorage.setItem('getResponseApiKey', getResponseApiKey);
        
        toast({
          title: "Connected!",
          description: `Successfully connected to GetResponse. Found ${lists.length} lists.`,
        });
      } else {
        throw new Error('Invalid API key or connection failed');
      }
    } catch (error) {
      console.error('GetResponse connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to GetResponse. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Send emails to GetResponse list
  const sendToGetResponse = async () => {
    if (!selectedList) {
      toast({
        title: "Error",
        description: "Please select a list to send emails to",
        variant: "destructive",
      });
      return;
    }

    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "No emails to send. Please scrape some websites first.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const allEmails = emails.flatMap(entry => entry.emails);
      const uniqueEmails = [...new Set(allEmails)];
      
      // Add contacts to GetResponse list
      const contactPromises = uniqueEmails.map(email => 
        fetch('https://api.getresponse.com/v3/contacts', {
          method: 'POST',
          headers: {
            'X-Auth-Token': `api-key ${getResponseApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            campaign: {
              campaignId: selectedList
            }
          })
        })
      );

      const results = await Promise.allSettled(contactPromises);
      const successful = results.filter(result => result.status === 'fulfilled' && result.value.ok).length;
      
      toast({
        title: "Success!",
        description: `Successfully added ${successful} out of ${uniqueEmails.length} emails to your GetResponse list.`,
      });
    } catch (error) {
      console.error('Send to GetResponse error:', error);
      toast({
        title: "Error",
        description: "Failed to send emails to GetResponse. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Clear all scraped data
  const clearData = () => {
    setEmails([]);
    localStorage.removeItem('scrapedEmails');
    toast({
      title: "Cleared",
      description: "All scraped email data has been cleared.",
    });
  };

  const totalEmails = emails.reduce((sum, entry) => sum + entry.emails.length, 0);

  return (
    <div className="space-y-8">
      {/* URL Input Section */}
      <Card className="shadow-card border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Website URL Scraper
          </CardTitle>
          <CardDescription>
            Enter any website URL to extract email addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && scrapeWebsite()}
            />
            <Button 
              onClick={scrapeWebsite} 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Scrape
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GetResponse Integration */}
      <Card className="shadow-card border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            GetResponse Integration
          </CardTitle>
          <CardDescription>
            Connect your GetResponse account to send scraped emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your GetResponse API key"
                value={getResponseApiKey}
                onChange={(e) => setGetResponseApiKey(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              onClick={connectGetResponse} 
              disabled={isConnecting}
              variant="outline"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>

          {getResponseLists.length > 0 && (
            <div className="flex gap-4">
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a list to send emails to" />
                </SelectTrigger>
                <SelectContent>
                  {getResponseLists.map((list) => (
                    <SelectItem key={list.campaignId} value={list.campaignId}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={sendToGetResponse} 
                disabled={isSending || emails.length === 0}
                variant="gradient"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send to List
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {emails.length > 0 && (
        <Card className="shadow-card border-0 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Scraped Emails ({totalEmails} total)
                </CardTitle>
                <CardDescription>
                  Emails grouped by source domain
                </CardDescription>
              </div>
              <Button variant="outline" onClick={clearData} size="sm">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {emails.map((entry) => (
              <Card key={entry.id} className="border border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{entry.domain}</CardTitle>
                    <Badge variant="secondary">
                      {entry.emails.length} emails
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Scraped from: {entry.url}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {entry.emails.map((email, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {email}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailScraper;