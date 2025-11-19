import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, WHATSAPP_NUMBER } from "@/types";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal = ({ product, onClose }: ProductDetailsModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Build image list (prefer product.images, fall back to imageUrl)
  const images = useMemo(() => {
    if (!product) return [] as string[];
    if (product.images && product.images.length > 0) return product.images;
    if (product.imageUrl) return [product.imageUrl];
    return [];
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0); // reset to first image when opening a new product
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleWhatsAppInquiry = () => {
    const message =
      `Hi! I'm interested in:\n${product.name}` +
      (product.price != null ? `\nPrice: £${product.price.toFixed(2)}` : "");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const goToPrevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;

    const threshold = 50; // px
    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        goToNextImage();
      } else {
        goToPrevImage();
      }
      setTouchStartX(null); // reset after a swipe
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 shadow-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* LEFT: IMAGE AREA WITH GALLERY */}
          <div className="relative bg-muted overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            <div
              className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <span className="text-white/70 text-lg font-medium text-center px-4">
                    {product.name}
                  </span>
                </div>
              )}

              {/* Prev/Next buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70 transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70 transition"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Popular badge */}
              {product.isPopular && (
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  Popular
                </Badge>
              )}

              {/* Small dots indicator (optional) */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 w-2 rounded-full transition ${
                        idx === currentImageIndex
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex gap-2 px-4 py-3 bg-card/80 border-t border-border overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border transition ${
                      idx === currentImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="p-8 flex flex-col">
            <div className="flex-1 space-y-6">
              {product.category && (
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {product.category}
                </div>
              )}

              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  {product.name}
                </h2>
                <div className="text-3xl font-bold text-primary mt-4">
                  {product.price != null
                    ? `£${product.price.toFixed(2)}`
                    : "Price on request"}
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground">
                {product.description ? (
                  <p className="leading-relaxed">{product.description}</p>
                ) : (
                  <p className="leading-relaxed">
                    This beautifully crafted personalised item makes the perfect
                    gift for any occasion. Each piece is carefully designed to
                    create lasting memories.
                  </p>
                )}

                {product.features && product.features.length > 0 ? (
                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>High-quality materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Customisable design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Fast delivery available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                onClick={handleWhatsAppInquiry}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Enquire on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
