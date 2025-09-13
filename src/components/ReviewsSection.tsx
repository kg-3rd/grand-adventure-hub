import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState<Array<{ id: number; name: string; rating: number | string | null; comment: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toNum = (v: unknown, fallback = 0): number => {
    const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
    return Number.isFinite(n) ? n : fallback;
  };
  const clampStars = (v: unknown): number => {
    const n = Math.round(toNum(v, 0));
    return Math.max(0, Math.min(5, n));
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('reviews')
          .select('id,name,rating,comment,created_at')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        if (!active) return;
        setReviews((data || []) as any);
        setCurrentReview(0);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || 'Failed to load reviews');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return; // no auto-rotate if less than 2
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
  <section id="reviews" className="py-32 bg-gradient-cinematic relative overflow-hidden border-t border-border/20 scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          {/* <p className="text-xs tracking-[0.2em] uppercase text-primary/70 mb-2">Adventure Stories</p> */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">What Our Adventurers Say</h2>

          {/* <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            What Our
            <span className="block text-primary"> Adventurers Say</span>
          </h2> */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Real stories from real people who've experienced the magic of GrandHiking adventures
          </p>
        </div>

        {/* Review Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading reviews…</p>
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground">No reviews yet.</p>
          ) : (
            <>
              <Card className="bg-card/50 backdrop-blur-xl border-border/20 shadow-cinematic overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96 md:h-80 flex items-center">
                    {reviews.map((review, index) => {
                      const stars = clampStars(review.rating);
                      return (
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
                            "{review.comment}"
                          </blockquote>
                          
                          {/* Reviewer Info */}
                          <div>
                            <h4 className="text-xl font-semibold text-foreground">
                              {review.name}
                            </h4>
                            {stars > 0 && (
                              <div className="flex items-center mt-2">
                                {[...Array(stars)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-primary text-primary mr-1"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
            </>
          )}
        </div>

        {/* Leave a review */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card className="bg-card/60 backdrop-blur border-border/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Leave a review</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (!name.trim() || !comment.trim()) {
                      toast.error('Please fill in your name and comment');
                      return;
                    }
                    setSubmitting(true);
                    const { data, error } = await supabase
                      .from('reviews')
                      .insert({ name, rating, comment })
                      .select('id,name,rating,comment,created_at')
                      .single();
                    if (error) throw error;
                    // Prepend to local list so it shows immediately
                    const newItem = data ?? { id: Date.now(), name, rating, comment };
                    setReviews((prev) => [newItem, ...prev]);
                    setCurrentReview(0);
                    toast.success('Thanks! Your review is visible here and pending approval.');
                    setName('');
                    setRating(5);
                    setComment('');
                  } catch (e: any) {
                    toast.error(e.message || 'Failed to submit review');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-3"
              >
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {/* Star rating picker */}
                <div className="flex items-center gap-2" aria-label="Select rating">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      className="p-1"
                      aria-label={`${i} star${i > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 mr-0.5 ${i <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Your comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;