import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Review {
  id: number;
  name: string;
  rating: number | string | null; // be defensive – DB can return numeric as string
  comment: string;
  approved: boolean;
  created_at: string;
}

type SummaryRow = {
  avg_rating: number | string | null;
  total_reviews: number | string | null;
};

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const [summary, setSummary] = useState<SummaryRow | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Optional summary view
        const { data: summaryData, error: summaryErr } = await supabase
          .from('approved_reviews_summary')
          .select('*')
          .maybeSingle();

        if (summaryErr) {
          // not fatal, just log/toast if you want
          console.warn('summary err:', summaryErr);
        } else if (summaryData) {
          setSummary(summaryData as SummaryRow);
        }

        const { data: revs, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews((revs || []) as Review[]);
      } catch (e: any) {
        toast.error(e.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Safe helpers
  const toNum = (v: unknown, fallback = 0): number => {
    const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
    return Number.isFinite(n) ? n : fallback;
  };

  const clampStars = (v: unknown): number => {
    const n = Math.round(toNum(v, 0));
    return Math.max(0, Math.min(5, n));
    // ensures 0..5 whole number
  };

  const computed = useMemo(() => {
    // Prefer view summary if present
    const sumAvg = summary?.avg_rating;
    const sumTotal = summary?.total_reviews;

    const totalFromSummary = toNum(sumTotal, NaN); // NaN -> fall back to reviews
    const total =
      Number.isFinite(totalFromSummary) ? totalFromSummary : reviews.length;

    let avg: number;

    if (sumAvg !== undefined && sumAvg !== null) {
      // View can return numeric as string, coerce to number
      avg = toNum(sumAvg, 0);
    } else if (total > 0) {
      const sumRatings = reviews.reduce(
        (acc, r) => acc + toNum(r.rating, 0),
        0
      );
      avg = sumRatings / total;
    } else {
      avg = 0;
    }

    // Always return numbers
    return {
      avg_rating: Number.isFinite(avg) ? avg : 0,
      total_reviews: Number.isFinite(total) ? total : 0,
    };
  }, [summary, reviews]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim() || !comment.trim()) {
        toast.error('Please fill in your name and comment');
        return;
      }
      const { error } = await supabase
        .from('reviews')
        .insert({ name, comment });
      if (error) throw error;
      toast.success(
        'Thank you! Your review was submitted and is pending approval.'
      );
      setName('');
      setComment('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Reviews</h1>
            <p className="text-muted-foreground mt-2">
              Only approved reviews are shown below.
            </p>
          </header>

          <section className="grid md:grid-cols-3 gap-8 items-start">
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                What people are saying
              </h2>
              {loading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : reviews.length ? (
                <ul className="space-y-4">
                  {reviews.map((r) => {
                    const stars = clampStars(r.rating);
                    return (
                      <li
                        key={r.id}
                        className="rounded-xl border border-border/20 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{r.name}</span>
                          <span className="text-primary">
                            {'★'.repeat(stars)}
                            {'☆'.repeat(5 - stars)}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-2">
                          {r.comment}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p className="text-3xl font-bold">
                {toNum(computed.avg_rating, 0).toFixed(1)} / 5
              </p>
              <p className="text-muted-foreground">
                {toNum(computed.total_reviews, 0)} reviews
              </p>

              <hr className="my-6 border-border/20" />

              <h3 className="text-lg font-semibold mb-2">Leave a review</h3>
              <form onSubmit={submit} className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  placeholder="Your comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewsPage;
