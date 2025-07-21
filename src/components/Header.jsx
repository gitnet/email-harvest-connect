import { useState } from "react";
import { Menu, X, Github, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">YourSite</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-4">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-4">How it works</a>
          <a href="#api" className="text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-4">API Integration</a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Button variant="outline"><Download className="mr-2 w-4 h-4" /> Download</Button>
          <Button variant="outline"><Github className="mr-2 w-4 h-4" /> GitHub</Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-muted-foreground">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t px-6 py-4 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-4">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-4">How it works</a>
          <a href="#api" className="text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-4">API Integration</a>

          <div className="border-t pt-4 mt-4 flex flex-col space-y-2">
            <Button variant="outline" className="w-full"><Download className="mr-2 w-4 h-4" /> Download</Button>
            <Button variant="outline" className="w-full"><Github className="mr-2 w-4 h-4" /> GitHub</Button>
          </div>
        </div>
      )}
    </header>
  );
}
