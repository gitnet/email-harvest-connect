import React from 'react';

import Hero from '../components/Hero';
import EmailScraper from '../components/EmailScraper';


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
     
      <Hero />
      
      {/* Main Scraper Tool */}
      <section id="email-scraper" className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Email Scraping Tool
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter any website URL to extract email addresses and manage them with GetResponse integration
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <EmailScraper />
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Index;
