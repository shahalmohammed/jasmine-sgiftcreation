import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, WHATSAPP_NUMBER } from "@/types";

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: () => void;
  animationDelay?: number;
}

export const ProductCard = ({
  product,
  index,
  onClick,
  animationDelay = 50,
}: ProductCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const imageSrc = product.imageUrls?.[0] || product.imageUrl || null;

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) io.observe(cardRef.current);

    return () => {
      io.disconnect();
    };
  }, []);

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message =
      `Hi! I'm interested in:\n${product.name}` +
      (product.price != null ? `\nPrice: £${product.price.toFixed(2)}` : "");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 cursor-pointer ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${Math.min(index * animationDelay, 500)}ms` }}
      onClick={onClick}
    >
      <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-white/70 text-sm font-medium text-center px-2">
                {product.name}
              </span>
            </div>
          )}

          {product.isPopular && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground z-10">
              Popular
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-2 flex-1 flex flex-col">
          {product.category && (
            <div className="text-xs text-muted-foreground font-medium">
              {product.category}
            </div>
          )}

          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* rating summary */}
          <div className="text-xs text-muted-foreground">
            {(product.averageRating ?? 0).toFixed(1)} / 5.0 ({product.ratingsCount ?? 0})
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-base sm:text-xl font-bold text-foreground">
              {product.price != null ? `£${product.price.toFixed(2)}` : "—"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
              onClick={handleWhatsAppInquiry}
            >
              Enquire
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
