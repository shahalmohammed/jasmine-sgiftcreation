import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";

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
            <ProductCard 
              key={p._id} 
              product={p} 
              index={i} 
              onClick={() => setSelectedProduct(p)} 
              animationDelay={50}
            />
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