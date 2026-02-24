import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { reviewService } from "@/services/productService";

const ProductsGrid = () => {
  const [popular, setPopular] = useState<Product[]>([]);
  const [normal, setNormal] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [question, setQuestion] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState<string[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<Array<{ name: string; rating: number; text: string }>>([]);
  const [reviews, setReviews] = useState<Array<any>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);

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

  // Fetch reviews when products load
  useEffect(() => {
    const productId = popular[0]?._id || normal[0]?._id;
    if (productId) {
      fetchReviews(productId);
    }
  }, [popular, normal]);

  const products = useMemo(() => [...popular, ...normal], [popular, normal]);

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      setSubmittedQuestions([...submittedQuestions, question.trim()]);
      setQuestion("");
    }
  };

  const handleSubmitReview = async () => {
    if (reviewName.trim() && reviewText.trim()) {
      try {
        // Submit to backend using the review service
        const productId = popular[0]?._id || normal[0]?._id;
        if (!productId) {
          alert("No product available");
          return;
        }

        await reviewService.addReview(productId, {
          rating: reviewRating,
          comment: reviewText.trim(),
          customerName: reviewName.trim(),
        });

        // Fetch updated reviews
        await fetchReviews(productId);

        setReviewName("");
        setReviewRating(5);
        setReviewText("");
      } catch (err: any) {
        console.error("Error submitting review:", err);
        alert("Failed to submit review");
      }
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const data = await reviewService.getReviews(productId, 1, 20);
      console.log("Reviews data:", data); // Debug log
      setReviews(data.items || []);
      setAverageRating(data.averageRating || 0);
      setRatingsCount(data.ratingsCount || 0);
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
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

        {/* Write a Review Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Share Your Review
            </h3>
            <p className="text-lg text-muted-foreground">
              We'd love to hear about your experience with our personalised gifts
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Your name..."
              className="w-full p-4 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setReviewRating(rating)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${rating} stars`}
                  >
                    <svg
                      className={`w-8 h-8 ${
                        rating <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } cursor-pointer transition-colors`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-4 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmitReview();
                }
              }}
            />
            
            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={handleSubmitReview}
              disabled={!reviewName.trim() || !reviewText.trim()}
            >
              Submit Review
            </Button>
          </div>

          {/* Display Submitted Reviews */}
          {submittedReviews.length > 0 && (
            <div className="mt-12">
              <h4 className="text-2xl font-serif font-semibold text-foreground mb-6">
                Customer Reviews
              </h4>
              <div className="space-y-4">
                {submittedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-accent/50 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-foreground">{review.name}</h4>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSubmittedReviews(submittedReviews.filter((_, i) => i !== index));
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete review"
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
                    <p className="text-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* All Reviews from Backend */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              All Customer Reviews
            </h3>
            <div className="flex items-center justify-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg text-muted-foreground">
                {averageRating.toFixed(1)} ({ratingsCount} {ratingsCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-3"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{review.customerName || "Anonymous"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Just now"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < (review.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">{review.comment || review.text || "No comment"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
        </div>


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