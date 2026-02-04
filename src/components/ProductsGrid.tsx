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
  const [question, setQuestion] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState<string[]>([]);

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

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      setSubmittedQuestions([...submittedQuestions, question.trim()]);
      setQuestion("");
    }
  };

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

        {/* Questions Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Have Questions?
            </h3>
          </div>

          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write your question here..."
              className="w-full p-4 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmitQuestion();
                }
              }}
            />
            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={handleSubmitQuestion}
              disabled={!question.trim()}
            >
              Submit Question
            </Button>
          </div>

          {/* Display Submitted Questions */}
          {submittedQuestions.length > 0 && (
            <div className="mt-12">
              <h4 className="text-2xl font-serif font-semibold text-foreground mb-6">
                Your Questions
              </h4>
              <div className="space-y-4">
                {submittedQuestions.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-accent/50 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-foreground flex-1">{q}</p>
                      <button
                        onClick={() => {
                          setSubmittedQuestions(submittedQuestions.filter((_, i) => i !== index));
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete question"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      We'll get back to you soon!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;