import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'The festival trip to Joshua Tree was absolutely magical. GrandHiking created an experience that perfectly blended adventure with amazing music. The community feel was incredible!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      location: 'Seattle, WA',
      rating: 5,
      text: 'Three years of camping trips with GrandHiking and each one has been better than the last. The guides are knowledgeable, the locations are breathtaking, and the memories are priceless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      location: 'Denver, CO',
      rating: 5,
      text: 'As someone who was hesitant about group travel, GrandHiking completely changed my perspective. The Rocky Mountain expedition was life-changing and I made friends for life.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 4,
      name: 'Jake Thompson',
      location: 'Austin, TX',
      rating: 5,
      text: 'The attention to detail and safety measures while still maintaining that sense of adventure is what sets GrandHiking apart. Every trip feels like a professionally crafted journey.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section id="reviews" className="py-32 bg-gradient-cinematic relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            What Our
            <span className="block text-primary"> Adventurers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Real stories from real people who've experienced the magic of GrandHiking adventures
          </p>
        </div>

        {/* Review Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-xl border-border/20 shadow-cinematic overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-96 md:h-80 flex items-center">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className={`absolute inset-0 p-12 md:p-16 flex flex-col justify-center transition-all duration-1000 ${
                      index === currentReview
                        ? 'opacity-100 translate-x-0'
                        : index < currentReview 
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                    }`}
                  >
                    {/* Quote Icon */}
                    <Quote className="text-primary w-12 h-12 mb-8 opacity-30" />
                    
                    {/* Review Text */}
                    <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed mb-8 italic">
                      "{review.text}"
                    </blockquote>
                    
                    {/* Reviewer Info */}
                    <div className="flex items-center">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-16 h-16 rounded-full border-2 border-primary/20 mr-6"
                      />
                      <div>
                        <h4 className="text-xl font-semibold text-foreground mb-1">
                          {review.name}
                        </h4>
                        <p className="text-muted-foreground text-base">
                          {review.location}
                        </p>
                        <div className="flex items-center mt-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-primary text-primary mr-1"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;