import { useEffect, useState, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, ShoppingCart } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  isPopular?: boolean;
  isActive?: boolean;
  description?: string;
  features?: string[];
};

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

const ProductDetailsModal = ({ product, onClose }: { product: Product | null; onClose: () => void }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
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
    window.open(`https://wa.me/+447936761983?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"
        }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
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
          <div className="relative aspect-square md:aspect-auto bg-muted overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <span className="text-white/70 text-lg font-medium text-center px-4">{product.name}</span>
              </div>
            )}
            {product.isPopular && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">Popular</Badge>
            )}
          </div>

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
                  {product.price != null ? `£${product.price.toFixed(2)}` : "Price on request"}
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground">
                {product.description ? (
                  <p className="leading-relaxed">{product.description}</p>
                ) : (
                  <p className="leading-relaxed">
                    This beautifully crafted personalised item makes the perfect gift for any occasion.
                    Each piece is carefully designed to create lasting memories.
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

            {/* Action Buttons */}
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

const ProductCard = ({ product, index, onClick }: { product: Product; index: number; onClick: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
      if (cardRef.current) io.unobserve(cardRef.current);
    };
  }, []);

  const handleWhatsAppInquiry = () => {
    const message =
      `Hi! I'm interested in:\n${product.name}` +
      (product.price != null ? `\nPrice: £${product.price.toFixed(2)}` : "");
    window.open(`https://wa.me/+447936761983?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover z-10"
              loading="lazy"
              onLoad={() => console.log("IMG LOADED:", product.imageUrl)}
              onError={(e) => {
                console.error("IMG ERROR:", product.imageUrl, e);
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center z-0">
            <span className="text-white/70 text-sm font-medium text-center px-2">{product.name}</span>
          </div>

          {product.isPopular && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground z-20">Popular</Badge>
          )}

        </div>

        <div className="p-4 space-y-2">
          {product.category && (
            <div className="text-xs text-muted-foreground font-medium">{product.category}</div>
          )}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-base sm:text-xl font-bold text-foreground">
              {product.price != null ? `£${product.price.toFixed(2)}` : "—"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsAppInquiry();
              }}
            >
              Enquire
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ProductsGrid = () => {
  const [popular, setPopular] = useState<Product[]>([]);
  const [normal, setNormal] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [popRes, normRes] = await Promise.all([
          fetch(`https://jasminesgiftbackend.vercel.app/api/products/popular?limit=5`, { signal: ctrl.signal }),
          fetch(`https://jasminesgiftbackend.vercel.app/api/products?limit=10`, { signal: ctrl.signal }),
        ]);

        if (!popRes.ok) throw new Error(`Popular fetch failed: ${popRes.status}`);
        if (!normRes.ok) throw new Error(`Products fetch failed: ${normRes.status}`);

        const popJson = await popRes.json();
        const normJson = await normRes.json();

        const popItems: Product[] = Array.isArray(popJson.items) ? popJson.items : [];
        const normItems: Product[] = Array.isArray(normJson.items) ? normJson.items : [];

        const popularIds = new Set(popItems.map(p => p._id));
        const filteredNormal = normItems.filter(p => !popularIds.has(p._id));

        setPopular(popItems.slice(0, 5));
        setNormal(filteredNormal.slice(0, 10));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  const products = useMemo(() => [...popular, ...normal], [popular, normal]);

  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Loading products…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-background">
      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Our Collections</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully curated selection of personalised gifts, perfect for every occasion and loved one.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            onClick={() => window.location.assign("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;