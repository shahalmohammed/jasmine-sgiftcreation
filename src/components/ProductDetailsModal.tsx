import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, WHATSAPP_NUMBER, Review } from "@/types";
import { reviewService } from "@/services/productService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl leading-none transition ${n <= value ? "opacity-100" : "opacity-30 hover:opacity-60"
            }`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export const ProductDetailsModal = ({ product, onClose }: ProductDetailsModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Summary (use backend if present, else compute from loaded reviews)
  const [summaryAverage, setSummaryAverage] = useState<number>(product?.averageRating ?? 0);
  const [summaryCount, setSummaryCount] = useState<number>(product?.ratingsCount ?? 0);

  // Review form state
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Build image list: prefer imageUrls from backend, then images, then imageUrl
  const images = useMemo(() => {
    if (!product) return [] as string[];

    if (product.imageUrls && product.imageUrls.length > 0) return product.imageUrls;
    if (product.images && product.images.length > 0) return product.images;
    if (product.imageUrl) return [product.imageUrl];
    return [];
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);

      // reset form + review UI
      setRating(5);
      setCustomerName("");
      setComment("");
      setReviews([]);
      setReviewsError(null);

      setSummaryAverage(product.averageRating ?? 0);
      setSummaryCount(product.ratingsCount ?? 0);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  // Load reviews when modal opens
  useEffect(() => {
    if (!product?._id) return;

    const load = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const data = await reviewService.getReviews(product._id, 1, 10);

        const items: Review[] = Array.isArray(data.items) ? data.items : [];
        setReviews(items);

        // use server summary if provided, otherwise compute from items
        const avg = typeof data.averageRating === "number" ? data.averageRating : 0;
        const cnt = typeof data.ratingsCount === "number" ? data.ratingsCount : items.length;
        setSummaryAverage(avg);
        setSummaryCount(cnt);
      } catch (e: any) {
        setReviewsError(e?.message || "Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    load();
  }, [product?._id]);

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

    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      diff < 0 ? goToNextImage() : goToPrevImage();
      setTouchStartX(null);
    }
  };

  const canSubmit =
    rating >= 1 &&
    rating <= 5 &&
    (customerName.trim().length > 0 || comment.trim().length > 0);

  const submitReview = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setReviewsError(null);

      await reviewService.addReview(product._id, {
        rating,
        customerName: customerName.trim() || undefined,
        comment: comment.trim() || undefined,
      });

      // Refresh reviews after submit
      const data = await reviewService.getReviews(product._id, 1, 10);
      const items: Review[] = Array.isArray(data.items) ? data.items : [];
      setReviews(items);

      setSummaryAverage(typeof data.averageRating === "number" ? data.averageRating : summaryAverage);
      setSummaryCount(typeof data.ratingsCount === "number" ? data.ratingsCount : summaryCount);

      setComment("");
      // keep name for convenience
    } catch (e: any) {
      setReviewsError(e?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
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
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* LEFT: IMAGE AREA WITH GALLERY */}
          <div className="relative bg-muted overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
            <div
              className="relative aspect-square lg:aspect-[4/5] w-full overflow-hidden"
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

              {product.isPopular && (
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  Popular
                </Badge>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 w-2 rounded-full transition ${idx === currentImageIndex
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/70"
                        }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 px-4 py-3 bg-card/80 border-t border-border overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border transition ${idx === currentImageIndex
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

          {/* RIGHT: DETAILS + REVIEWS */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col">

            <div className="flex-1 space-y-4 sm:space-y-6">
              {product.category && (
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {product.category}
                </div>
              )}

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
                  {product.name}
                </h2>

                {/* rating summary */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-semibold text-foreground text-lg">
                      {Number(summaryAverage || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({summaryCount} {summaryCount === 1 ? 'rating' : 'ratings'})
                  </span>
                </div>

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
              </div>

              <div className="space-y-3 mt-6 sm:mt-8 pt-4 border-t border-border">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-5 sm:py-6 font-semibold"
                  onClick={handleWhatsAppInquiry}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Enquire on WhatsApp
                </Button>
              </div>

              {/* Review form */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5 space-y-4">
                <div className="font-semibold text-foreground text-lg">Write a Review</div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Your Rating *</div>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name (optional)</label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Review (optional)</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="bg-background min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={!canSubmit || submitting}
                  onClick={submitReview}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>

                {reviewsError && (
                  <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                    {reviewsError}
                  </div>
                )}
              </div>

              {/* Reviews list */}
              <div className="space-y-4">
                <div className="font-semibold text-foreground text-lg flex items-center justify-between">
                  <span>Customer Reviews</span>
                  {summaryCount > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {summaryCount} total
                    </span>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="text-sm text-muted-foreground py-8 text-center">
                    Loading reviews...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-muted/30 rounded-xl">
                    <div className="text-muted-foreground mb-2">No reviews yet</div>
                    <div className="text-sm text-muted-foreground">
                      Be the first to share your experience!
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {reviews.map((r) => (
                      <div key={r._id} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              {r.customerName || "Anonymous Customer"}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < r.rating ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                {r.rating}/5
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>
                        {r.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            {r.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};