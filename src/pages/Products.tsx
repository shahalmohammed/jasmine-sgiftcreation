import { useEffect, useState, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      style={{ transitionDelay: `${Math.min(index * 30, 500)}ms` }}
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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:4000/api/products?limit=100`, { signal: ctrl.signal });

        if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);

        const json = await res.json();
        const items: Product[] = Array.isArray(json.items) ? json.items : [];

        setProducts(items);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      if (!searchQuery) {
        // No search query, only filter by category
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        return matchesCategory;
      }

      // Split search query into individual words
      const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0);
      
      // Check if product matches ANY of the search words in name or description
      const matchesSearch = searchWords.some(word => {
        const nameMatch = p.name.toLowerCase().includes(word);
        const descMatch = p.description && p.description.toLowerCase().includes(word);
        return nameMatch || descMatch;
      });

      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24">
          <p className="text-center text-muted-foreground">Loading products…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      
      {/* Filters */}
      <div className="border-b bg-card sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="popular">Popular First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {searchQuery && (
              <span className="font-medium">Search results for "{searchQuery}" - </span>
            )}
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortBy("default");
                window.history.pushState({}, '', '/products');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {paginatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} onClick={() => setSelectedProduct(p)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first, last, current, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 py-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;