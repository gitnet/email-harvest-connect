import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Mail, Download, Send, Key, Eye, EyeOff, BadgeMinus ,X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx"; // ⬅️ Add this to your imports
import loadGif from '../../public/images/loadgif.gif'; // Import the loading GIF

import  exportEmailsToExcel  from './ExportToExcel'; // Import the export function
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
 

const EmailScraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [scrapeMode, setScrapeMode] = useState('url'); // 'url' or 'google'

  const [selectedId, setSelectedId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const [getResponseApiKey, setGetResponseApiKey] = useState('');
  const [getResponseLists, setGetResponseLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [EmailTypeValue, setEmailTypeValue] = useState('@gmail.com');
  const [keyworkdvalue, setkeyworkdvalue] = useState('intitle:');
  const { toast } = useToast();
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5055';
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
  // const extractEmails = (text) => {
  //   const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  //   return text.match(emailRegex) || [];
  // };
const extractEmails = (text) => {
  if (typeof text !== 'string') return [];

  // Match standard email addresses
  const plainEmailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

  // Match mailto links (href="mailto:email@example.com")
  const mailtoRegex = /mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi;

  const plainEmails = text.match(plainEmailRegex) || [];

  const mailtoMatches = [...text.matchAll(mailtoRegex)];
  const mailtoEmails = mailtoMatches.map(match => match[1]);

  // Combine and deduplicate emails
  const allEmails = [...new Set([...plainEmails, ...mailtoEmails])];

  return allEmails;
};

  // Get domain from URL
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Custom query';
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
  let scrapedContent = '';

  if (scrapeMode === 'url') {
        // Scrape emails from the provided URL
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        scrapedContent = data.contents;

  } else if (scrapeMode === 'google') {
    let fullQuery = keyworkdvalue + ' ' + url + ' ' + EmailTypeValue;
      // Scrape emails from Google search results
        const response = await fetch(`${baseUrl}/api/scrape?q=${encodeURIComponent(fullQuery)}`);
        const data = await response.json();
        scrapedContent = data; // نستخدم الكائن كاملًا وليس فقط emails
  }


  if (scrapedContent) {
    const foundEmails = scrapeMode === 'google' && Array.isArray(scrapedContent.emails)
    ? scrapedContent.emails
    : extractEmails(scrapedContent);

    const uniqueEmails = [...new Set(foundEmails)];

    if (uniqueEmails.length > 0) {
      const domain = getDomain(url);
      
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

      // ✅ إرسال الإيميلات إلى GetResponse
      await sendToGetResponse(uniqueEmails, domain);

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
      const { data, error } = await supabase.functions.invoke('getresponse-api', {
        body: {
          action: 'getCampaigns',
          apiKey: getResponseApiKey
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && Array.isArray(data)) {
        setGetResponseLists(data);
        localStorage.setItem('getResponseApiKey', getResponseApiKey);
        
        toast({
          title: "Connected!",
          description: `Successfully connected to GetResponse. Found ${data.length} lists.`,
        });
      } else {
        throw new Error('Invalid response from GetResponse API');
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
      
      const { data, error } = await supabase.functions.invoke('getresponse-api', {
        body: {
          action: 'addContacts',
          apiKey: getResponseApiKey,
          listId: selectedList,
          emails: uniqueEmails
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Success!",
        description: `Successfully added ${data.successful} out of ${data.total} emails to your GetResponse list.`,
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

  const clearOnecard = (id) => {
    if (!id) return;
    const updatedEmails = emails.filter(entry => entry.id !== id);

        localStorage.setItem("emails", JSON.stringify(updatedEmails));
        setEmails(updatedEmails);
        saveEmails(updatedEmails);
        toast({
          title: "Removed",
          description: "Email entry has been removed.",
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
            Enter any website URL to extract email addresses or use Google search to find emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
             <Select value={scrapeMode} onValueChange={setScrapeMode}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Scrape Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">Website URL</SelectItem>
                <SelectItem value="google">Google Search</SelectItem>
              </SelectContent>
            </Select>
            {scrapeMode === 'google' && (
            <>
            <Select placeholder="Select Keyword value" value={keyworkdvalue} onValueChange={setkeyworkdvalue}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Keyword" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="contact us">Contact us</SelectItem> 
                <SelectItem value="intitle:">In-title </SelectItem>
                <SelectItem value="site:linkedin.com/in">Site:linkedin.com/in</SelectItem>
                <SelectItem value="site:github.com">Site:github.com</SelectItem>
                <SelectItem value="site:twitter.com">Site:twitter.com</SelectItem>
                <SelectItem value="site:facebook.com">Site:facebook.com</SelectItem>
                <SelectItem value="site:instagram.com">Site:instagram.com</SelectItem>
                <SelectItem value="site:youtube.com">Site:youtube.com</SelectItem>
                <SelectItem value="site:reddit.com">Site:reddit.com</SelectItem>
                <SelectItem value="site:quora.com">Site:quora.com</SelectItem>
                <SelectItem value="site:medium.com">Site:medium.com</SelectItem>
                <SelectItem value="site:stackoverflow.com">Site:stackoverflow.com</SelectItem>
                <SelectItem value="site:producthunt.com">Site:producthunt.com</SelectItem>
                <SelectItem value="site:dribbble.com">Site:dribbble.com</SelectItem>
                <SelectItem value="site:behance.net">Site:behance.net</SelectItem>
                <SelectItem value="site:dev.to">Site:dev.to</SelectItem>
                <SelectItem value="site:angel.co">Site:angel.co</SelectItem>
                <SelectItem value="site:crunchbase.com">Site:crunchbase.com</SelectItem>
                <SelectItem value="site:forbes.com">Site:forbes.com</SelectItem>
                <SelectItem value="site:inc.com">Site:inc.com</SelectItem>  
                <SelectItem value="site:techcrunch.com">Site:techcrunch.com</SelectItem>
                <SelectItem value="site:wired.com">Site:wired.com</SelectItem>
                <SelectItem value="site:theverge.com">Site:theverge.com</SelectItem>
                <SelectItem value="site:bbc.com">Site:bbc.com</SelectItem>
                <SelectItem value="site:cnn.com">Site:cnn.com</SelectItem>
                <SelectItem value="site:nytimes.com">Site:nytimes.com</SelectItem>
                <SelectItem value="site:theguardian.com">Site:theguardian.com</SelectItem>
                <SelectItem value="site:aljazeera.com">Site:aljazeera.com</SelectItem>
                <SelectItem value="site:reuters.com">Site:reuters.com</SelectItem>
                <SelectItem value="site:bbc.co.uk">Site:bbc.co.uk</SelectItem>
                <SelectItem value="site:thetimes.co.uk">Site:thetimes.co.uk</SelectItem>
                <SelectItem value="site:thetelegraph.co.uk">Site:thetelegraph.co.uk</SelectItem>
                <SelectItem value="site:theindependent.co.uk">Site:theindependent.co.uk</SelectItem>
                <SelectItem value="site:theeconomist.com">Site:theeconomist.com</SelectItem>
                <SelectItem value="site:theatlantic.com">Site:theatlantic.com</SelectItem>
                <SelectItem value="site:vox.com">Site:vox.com</SelectItem>
                <SelectItem value="site:slate.com">Site:slate.com</SelectItem>
                <SelectItem value="site:thehill.com">Site:thehill.com</SelectItem>
                <SelectItem value="site:politico.com">Site:politico.com</SelectItem>
                <SelectItem value="site:foreignpolicy.com">Site:foreignpolicy.com</SelectItem>
                <SelectItem value="site:axios.com">Site:axios.com</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={EmailTypeValue}
              onValueChange={setEmailTypeValue}>  
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Email Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="@gmail.com">@gmail.com</SelectItem>
                <SelectItem value="@yahoo.com">@yahoo.com</SelectItem>
                <SelectItem value="@hotmail.com">@hotmail.com</SelectItem>
                <SelectItem value="@outlook.com">@outlook.com</SelectItem>
                <SelectItem value="@icloud.com">@icloud.com</SelectItem>
                <SelectItem value="@aol.com">@aol.com</SelectItem>
                </SelectContent>
              </Select> 
              </>
              )}  {/* End check if scrape moad is google */}
            <Input
              placeholder={scrapeMode === 'url' ? 'Enter website URL' : 'Enter search query'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              onKeyPress={(e) => e.key === 'Enter' && scrapeWebsite()}
            />
           
            <Button 
              onClick={scrapeWebsite} 
              disabled={isLoading}
              className="w-full sm:min-w-[120px]"
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
            {isLoading ? (
               
                 <img src={loadGif} alt="Loading..." className="mx-auto mt-4" style={{ width: '100px', height: '100px' }} />  
                 
              ) : (
               
                 null
                 
              )}
      {/* GetResponse Integration */}
      <Card className="shadow-card border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            GetResponse Integration
          </CardTitle>
          <CardDescription>
            Connect your GetResponse account to send scraped emails. If you don't have an API key, signup at <a href="https://www.getresponse.com?a=WNXT7tMYMJ" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GetResponse</a>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
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
        
       <Card className="flex flex-col gap-4 shadow-card border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Scraped Emails ({totalEmails} total)
             
              </CardTitle>
              <CardDescription>
                Emails grouped by source domain
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button
                variant="outline"
                onClick={clearData}
                size="sm"
                className="w-full sm:w-auto"
              >
                Clear All
              </Button>

              <Button
                variant="outline"
                onClick={() => exportEmailsToExcel(emails)}
                size="sm"
                className="w-full sm:w-auto gap-2"
              >
                <Download id='exportxlsx' className="w-4 h-4" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardHeader>

      <CardContent className="space-y-4">
        {emails.map((entry) => (
          <>
          <Card key={entry.id} className="border border-border/50">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">{entry.domain}</CardTitle>
                <Badge variant="secondary" className="w-fit sm:w-auto">
                    {console.log(entry) }
                  {entry.emails.length} emails
                </Badge>
                <X
                    onClick={() => {
                      setShowDialog(true);
                      setSelectedId(entry.id); // Set the ID of the card to be cleared
                    }}
                    className="absolute right-2 pl-20 cursor-pointer"
                  />
              </div>

              <CardDescription className="text-xs break-all">
                Scraped from: {entry.url}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {entry.emails.map((email, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs break-all px-2 py-1"
                  >
                    {email}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        
          </>
        ))}
      </CardContent>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                   This will remove the{" "}
                        {
                          emails.find((entry) => entry.id === selectedId)?.emails.length || 0 
                        }{" "} : <br />
                        <ul className="list-disc pl-5">
                          {emails.find((entry) => entry.id === selectedId)?.emails.map((email, index) => (
                            <li key={index}> - {email}</li>
                          ))}
                        </ul>
                    selected emails block permanently.
                </p>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (!selectedId) return;
                      clearOnecard(selectedId); // Call the function to clear the specific card
                      setShowDialog(false);
                      setSelectedId(null);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
           </Dialog>

    </Card>

      )}
    </div>
  );
};

export default EmailScraper;