import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import EmailScraper from '../components/EmailScraper';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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

      {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Built with React and powered by GetResponse API integration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
