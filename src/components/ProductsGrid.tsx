import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  popular?: boolean;
}

const products: Product[] = [
  { id: 1, name: "Personalised Baby Gift Set", category: "Baby Gifts", price: 24.99, image: "baby", popular: true },
  { id: 2, name: "Custom Wedding Frame", category: "Wedding Gifts", price: 34.99, image: "wedding", popular: true },
  { id: 3, name: "Personalised Mug", category: "Mugs", price: 12.99, image: "mug" },
  { id: 4, name: "Custom Photo Frame", category: "Frames", price: 18.99, image: "frame" },
  { id: 5, name: "Engraved Slate Tile", category: "Home Decor", price: 22.99, image: "slate" },
  { id: 6, name: "Personalised Money Box", category: "Gifts", price: 16.99, image: "moneybox" },
  { id: 7, name: "Custom Book Markers", category: "Stationery", price: 8.99, image: "bookmark" },
  { id: 8, name: "Personalised Chopping Board", category: "Kitchen", price: 28.99, image: "board" },
  { id: 9, name: "Plain Cushion", category: "Home Decor", price: 19.99, image: "cushion" },
  { id: 10, name: "Sequin Cushion", category: "Home Decor", price: 24.99, image: "sequin", popular: true },
  { id: 11, name: "Sequin Backpack", category: "Accessories", price: 29.99, image: "backpack" },
  { id: 12, name: "Custom Puzzle", category: "Games", price: 21.99, image: "puzzle" },
  { id: 13, name: "Personalised Water Bottle", category: "Drinkware", price: 14.99, image: "bottle" },
  { id: 14, name: "Custom Pencil Case", category: "Stationery", price: 11.99, image: "pencilcase" },
  { id: 15, name: "Personalised Tin", category: "Storage", price: 9.99, image: "tin" },
  { id: 16, name: "Sequin Make-up Bag", category: "Accessories", price: 17.99, image: "makeup" },
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in:\n${product.name}\nCategory: ${product.category}\nPrice: £${product.price.toFixed(2)}`;
    window.open(`https://wa.me/+919497621273?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Placeholder gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
            <span className="text-white/70 text-sm font-medium text-center px-2">{product.name}</span>
          </div>
          
          {product.popular && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground z-10">
              Popular
            </Badge>
          )}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleWhatsAppInquiry}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Inquire Now
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="text-xs text-muted-foreground font-medium">{product.category}</div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-foreground">£{product.price.toFixed(2)}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={handleWhatsAppInquiry}
            >
              Inquire
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ProductsGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully curated selection of personalised gifts, 
            perfect for every occasion and loved one.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;