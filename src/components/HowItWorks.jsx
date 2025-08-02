import React from "react";
import { Mail, Globe, Send } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          How It Works
        </h2>
        <p className="mt-2 text-gray-700">
          A streamlined pipeline to find, collect, and activate email leads in any niche.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20 flex flex-col items-center text-center">
          <Globe className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">1. Search or Input</h3>
          <p className="text-sm text-muted-foreground">
            Enter a website URL or craft niche-specific search queries (e.g., “digital marketing agencies @gmail.com”) to discover potential leads.
          </p>
        </div>

        <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20 flex flex-col items-center text-center">
          <Mail className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">2. Smart Extraction</h3>
          <p className="text-sm text-muted-foreground">
            The tool crawls the provided targets, extracts visible and mailto emails using advanced regex patterns, and groups them by source domain with timestamped history.
          </p>
        </div>

        <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20 flex flex-col items-center text-center">
          <Send className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">3. Activate & Export</h3>
          <p className="text-sm text-muted-foreground">
            Send collected emails directly to GetResponse campaigns or export them to Excel for offline follow-up. Organize, dedupe, and scale outreach effortlessly.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-600">
        <p>
          Tip: Use targeted query patterns like <code className="bg-gray-100 px-1 rounded">@gmail.com "digital marketing agency"</code> or <code className="bg-gray-100 px-1 rounded">intitle:"web design"</code> to surface higher-quality leads.
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;
