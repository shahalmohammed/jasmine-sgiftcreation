import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Sparkles, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <Gift className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            About Jasmine's Gift Creation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Crafting moments of joy, one personalized gift at a time
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-12">
        <Card className="p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            Our Story
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Welcome to Jasmine's Gift Creation, where every gift tells a story and every creation carries a piece of our heart. Founded with a passion for making special moments even more memorable, we specialize in personalized gifts that speak from the soul.
            </p>
            <p>
              What started as a small passion project has blossomed into a beloved gift creation studio. We believe that the best gifts are those that carry personal meaning, crafted with attention to detail and delivered with love.
            </p>
            <p>
              Each item in our collection is carefully curated or handcrafted to ensure it meets our high standards of quality and uniqueness. From custom frames to personalized keepsakes, we transform ordinary moments into extraordinary memories.
            </p>
          </div>
        </Card>
      </section>

      {/* Our Values */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          What We Stand For
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Crafted with Love</h3>
            <p className="text-muted-foreground">
              Every piece is made with care and attention to detail, ensuring your gift is as special as the person receiving it.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
              <Sparkles className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Uniquely Yours</h3>
            <p className="text-muted-foreground">
              Personalization is at the heart of what we do. We create one-of-a-kind gifts that reflect your unique story.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Quality First</h3>
            <p className="text-muted-foreground">
              We use only the finest materials and techniques to ensure your gift stands the test of time.
            </p>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose Jasmine's Gift Creation?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Custom Designs</h3>
                  <p className="text-muted-foreground">
                    We work with you to create the perfect personalized gift that captures your vision.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Fast Turnaround</h3>
                  <p className="text-muted-foreground">
                    We understand timing matters. Our efficient process ensures timely delivery.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Affordable Pricing</h3>
                  <p className="text-muted-foreground">
                    Quality gifts shouldn't break the bank. We offer competitive prices for all budgets.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Customer Satisfaction</h3>
                  <p className="text-muted-foreground">
                    Your happiness is our priority. We go above and beyond to exceed expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 ">
        <Card className="p-12 max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Create Something Special?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Let's work together to create a gift that will be cherished forever
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate("/products")}
              className="bg-primary hover:bg-primary/90"
            >
              <Gift className="h-5 w-5 mr-2" />
              Browse Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
            >
              Get in Touch
            </Button>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;