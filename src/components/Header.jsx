import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Github, Download } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      {/* الشعار أو اسم الموقع */}
      <div className="text-xl font-bold text-primary">
        <Mail className="inline-block mr-2 font-bold" />
        Scrap Your List
      </div>

      {/* قائمة التنقل */}
        <nav className="mx-auto flex gap-x-3 text-lg">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:underline underline-offset-4 hover:scale-105 px-2">
            Home
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:underline underline-offset-4 hover:scale-105 px-2">
            How it works
          </a>
          <a
            href="#api"
            className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:underline underline-offset-4 hover:scale-105 px-2">
            Contact Us
          </a>
        </nav>

      {/* الأزرار */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Github className="w-4 h-4" />
          GitHub
        </Button>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>
    </header>
  );
};

export default Header;
