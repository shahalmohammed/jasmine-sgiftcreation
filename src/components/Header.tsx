import { Search, Heart, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logojs.png";
import { useState } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    "Personalised Baby Gifts",
    "Personalised Wedding Gifts",
    "Mugs",
    "Frames",
    "Home Decor",
    "Accessories"
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Jasmine's Gift Creation"
              className="h-10 w-10 object-contain"
            />
            <div className="">
              <h1 className="text-base font-bold text-primary-foreground leading-tight">
                Jasmine's Gift Creation
              </h1>
              <p className="text-[10px] text-muted-foreground">Personalized Gifts</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for personalised gifts..."
                className="pl-10 bg-muted/50 border-border focus:border-primary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Icons & WhatsApp CTA */}
          <div className="flex items-center gap-2">
            {/* About Us - Desktop Only */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden xl:flex text-sm hover:bg-primary/10"
              onClick={() => window.location.hash = 'about'}
            >
              About Us
            </Button>

            {/* Contact Us - Desktop Only */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden xl:flex text-sm hover:bg-primary/10"
              onClick={() => window.location.hash = 'contact'}
            >
              Contact Us
            </Button>

            {/* WhatsApp CTA Button - NOW USING SECONDARY COLOR */}
            <Button
              size="default"
              className="hidden lg:flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors shadow-md"
              onClick={() => window.open('https://wa.me/+447936761983', '_blank')}
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </Button>

            {/* WhatsApp Icon - Mobile/Tablet */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-primary/10"
              onClick={() => window.open('https://wa.me/+447936761983', '_blank')}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Menu Icon - Mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for gifts..."
              className="pl-10 bg-muted/50 border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:block border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                >
                  {category}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
            
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {/* About Us & Contact Us at top */}
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-semibold hover:bg-primary/10 hover:text-primary hover:border-primary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.hash = 'about';
                }}
              >
                About Us
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-semibold hover:bg-primary/10 hover:text-primary hover:border-primary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.hash = 'contact';
                }}
              >
                Contact Us
              </Button>
              
              {/* Divider */}
              <div className="my-2 border-t border-border"></div>
              
              {/* Categories */}
              <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
                SHOP BY CATEGORY
              </div>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium hover:bg-primary/10 hover:text-primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.hash = category.toLowerCase().replace(/\s+/g, '-');
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;