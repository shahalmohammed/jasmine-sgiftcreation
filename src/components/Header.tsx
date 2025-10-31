import { Search, Heart, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logojs.png";
import { useState } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary-foreground leading-tight">
                Jasmine's Gift Creation
              </h1>
              <p className="text-xs text-muted-foreground">Personalized Gifts</p>
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

            {/* Heart/Wishlist Icon - Retained for product saving */}
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
              <Heart className="h-5 w-5" />
              {/* Retain the badge for the Wishlist count */}
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* WhatsApp CTA Button - NOW USING SECONDARY COLOR */}
            <Button
              size="default"
              // Updated className to use secondary color for background and text
              className="hidden lg:flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors shadow-md"
              onClick={() => window.open('https://wa.me/YOURWHATSAPPNUMBER', '_blank')}
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </Button>

            {/* WhatsApp Icon - Mobile/Tablet - NOW USING PRIMARY/FOREGROUND COLOR */}
            <Button
              variant="ghost"
              size="icon"
              // Updated className to use the brand's primary color or foreground color for the icon, 
              // ensuring it still stands out as an important action.
              className="lg:hidden text-foreground hover:bg-primary/10"
              onClick={() => window.open('https://wa.me/YOURWHATSAPPNUMBER', '_blank')}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Menu Icon - Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
              <Menu className="h-5 w-5" />
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

      {/* Navigation */}
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
    </header>
  );
};

export default Header;