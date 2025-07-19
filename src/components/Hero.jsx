import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Zap, Database, Send, ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToScraper = () => {
    document.getElementById('email-scraper')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[80vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-background/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-background/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-background/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 bg-background/20 text-background border-background/30">
            <Zap className="h-3 w-3 mr-1" />
            Free & Open Source Email Scraper
          </Badge>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-tight">
            Extract Emails from
            <span className="block bg-gradient-to-r from-background to-background/80 bg-clip-text text-transparent">
              Any Website
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-background/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            A powerful React-based tool for scraping email addresses from websites and seamlessly integrating with GetResponse email marketing platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="hero"
              onClick={scrollToScraper}
              className="text-lg px-8 py-4"
            >
              <Mail className="h-5 w-5 mr-2" />
              Start Scraping Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 bg-background/10 border-background/30 text-background hover:bg-background/20"
            >
              <Database className="h-5 w-5 mr-2" />
              View Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20">
              <Mail className="h-8 w-8 text-background mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-background mb-2">Smart Email Extraction</h3>
              <p className="text-background/80 text-sm">
                Advanced regex patterns to find all email addresses on any public website
              </p>
            </div>
            
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20">
              <Send className="h-8 w-8 text-background mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-background mb-2">GetResponse Integration</h3>
              <p className="text-background/80 text-sm">
                Direct API connection to send scraped emails to your marketing lists
              </p>
            </div>
            
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20">
              <Database className="h-8 w-8 text-background mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-background mb-2">Local Storage</h3>
              <p className="text-background/80 text-sm">
                Organize and store emails by domain with persistent local storage
              </p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollToScraper}
              className="text-background/80 hover:text-background animate-bounce"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;