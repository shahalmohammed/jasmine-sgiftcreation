import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import heroImage1 from "@/assets/hero-bg.jpg";
import heroImage2 from "@/assets/hero-bg4.jpg";
import heroImage3 from "@/assets/hero-bg3.jpg";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // New state to manage the content animation for each slide
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: heroImage1,
      title: "Personalized Gifts",
      subtitle: "For Your Loved Ones",
      description: "Create unforgettable memories with our beautifully crafted frames, canvases, and candles.",
    },
    {
      image: heroImage3,
      title: "Custom Baby Gifts",
      subtitle: "Celebrate New Arrivals",
      description: "Make every milestone special with personalized baby gifts that parents will treasure forever.",
    },
    {
      image: heroImage2,
      title: "Wedding Memories",
      subtitle: "Cherish Forever",
      description: "Transform your special day into timeless keepsakes with our elegant wedding gift collection.",
    },
  ];

  useEffect(() => {
    // Set up the interval for the carousel cycle
    const intervalTimer = setInterval(() => {
      // Start exit animation
      setIsAnimating(false);

      // Transition to next slide after exit animation
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 800);

      // Start entry animation after slide change
      setTimeout(() => {
        setIsAnimating(true);
      }, 1200);

    }, 10000); // 10 seconds total cycle time

    return () => {
      clearInterval(intervalTimer);
    };
  }, [slides.length]);

  // Initial load/mount animation
  useEffect(() => {
    // This ensures the content is visible and animated on first load
    setIsAnimating(true);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
      <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                /* Custom Keyframes for smoother content transition */
                @keyframes content-slide-in {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes content-slide-out {
                    to { transform: translateY(-20px); opacity: 0; }
                }
                .slide-in {
                    animation: content-slide-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .slide-out {
                    animation: content-slide-out 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
                }
            `}</style>

      {/* Carousel Container */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center h-full"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Slightly richer background gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 animate-float">
        <Heart className="h-12 w-12 text-primary/30" fill="currentColor" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="h-10 w-10 text-accent/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div
          // Add the 'slide-in' or 'slide-out' animation class based on isAnimating state
          className={`max-w-2xl ${isAnimating ? 'slide-in' : 'slide-out'}`}
        >
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            // Staggered animation: delay applied directly for Title
            style={{ animationDelay: isAnimating ? '0s' : '0s' }}
          >
            {slide.title}
            <span
              className="block text-primary mt-2"
              // Staggered animation: delay applied directly for Subtitle
              style={{
                animationDelay: isAnimating ? '0.2s' : '0s',
                display: isAnimating ? 'block' : 'none' // Hide during exit
              }}
            >
              {slide.subtitle}
            </span>
          </h2>
          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            // Staggered animation: delay applied directly for Description
            style={{
              animationDelay: isAnimating ? '0.4s' : '0s',
              display: isAnimating ? 'block' : 'none' // Hide during exit
            }}
          >
            {slide.description}
          </p>
          <div
            className="flex flex-wrap gap-4"
            // Staggered animation: delay applied directly for Buttons
            style={{
              animationDelay: isAnimating ? '0.6s' : '0s',
              display: isAnimating ? 'flex' : 'none' // Hide during exit
            }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-elegant hover:shadow-hover transition-all"
            >
              Enguire Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary hover:bg-primary/10 transition-all"
            >
              View Collections
            </Button>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute top-1 bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              // Manual click animation handling
              setIsAnimating(false);
              setTimeout(() => {
                setCurrentSlide(index);
              }, 500); // Wait for exit animation
              setTimeout(() => {
                setIsAnimating(true);
              }, 800);
            }}
            className={`h-2 rounded-full transition-all ${index === currentSlide
                ? "bg-primary w-8"
                : "bg-primary/40 w-2 hover:bg-primary/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;