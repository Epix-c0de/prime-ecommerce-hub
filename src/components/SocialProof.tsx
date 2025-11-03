import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Wanjiku",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "Nairobi",
    rating: 5,
    text: "Amazing shopping experience! Fast delivery and quality products. I've been shopping here for 2 years now.",
    product: "Samsung Galaxy S24",
  },
  {
    id: 2,
    name: "John Kamau",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "Mombasa",
    rating: 5,
    text: "Best tech store in Kenya. Their customer service is outstanding and prices are competitive.",
    product: "MacBook Pro M3",
  },
  {
    id: 3,
    name: "Grace Achieng",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
    location: "Kisumu",
    rating: 5,
    text: "Love the lifestyle section! Got beautiful home décor items that transformed my living room.",
    product: "Home Decor Bundle",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "99%", label: "On-Time Delivery" },
  { value: "24/7", label: "Customer Support" },
];

export function SocialProof() {
  return (
    <section className="bg-card py-12">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-3">"{testimonial.text}"</p>
                <div className="text-sm text-primary font-medium">
                  Purchased: {testimonial.product}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-8 border-t">
          <div className="text-center">
            <div className="font-semibold mb-1">Secure Payments</div>
            <div className="text-xs text-muted-foreground">256-bit SSL encryption</div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1">Verified Products</div>
            <div className="text-xs text-muted-foreground">100% Genuine guarantee</div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1">Easy Returns</div>
            <div className="text-xs text-muted-foreground">7-day return policy</div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1">Free Delivery</div>
            <div className="text-xs text-muted-foreground">Orders above KSh 5,000</div>
          </div>
        </div>
      </div>
    </section>
  );
}
