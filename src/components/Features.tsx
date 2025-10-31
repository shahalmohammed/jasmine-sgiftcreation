import { Truck, Shield, Heart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Delivery",
    description: "Worldwide shipping"
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% satisfaction"
  },
  {
    icon: Heart,
    title: "Made With Love",
    description: "Every item carefully crafted"
  },
  {
    icon: Sparkles,
    title: "Unique Designs",
    description: "Personalised just for you"
  }
];

const Features = () => {
  return (
    <section className="py-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
