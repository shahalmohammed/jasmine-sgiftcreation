import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-foreground">About Us</h3>
            <p className="text-sm text-muted-foreground">
              Jasmine's Gift Creation specializes in beautiful personalised gifts for your family, friends, and loved ones.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <a href="https://www.facebook.com/jasminesgiftcreation" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Contact", "Returns Policy", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2">
              {["Baby Gifts", "Wedding Gifts", "Mugs & Frames", "Home Decor", "Accessories"].map((category) => (
                <li key={category}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get special offers and updates
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-background border-border"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <a href="tel:+44" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Jasmine's Gift Creation. All rights reserved. Made with love 💕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
