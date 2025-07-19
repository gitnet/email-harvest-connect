import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Github, Download } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EmailScraper
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#api" className="text-muted-foreground hover:text-foreground transition-colors">
              API Integration
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="hero" size="sm" className="hidden md:flex">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;