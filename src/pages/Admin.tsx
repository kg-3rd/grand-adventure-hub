import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import tghLogo from '@/assets/tgh_logo.png';
import { toast } from 'sonner';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'; // assumes shadcn/ui tabs are available
import { Separator } from '@/components/ui/separator';

type Bucket = 'events-posters' | 'gallery';

interface ImageItem {
  name: string;
  url: string;
}

const AdminPage = () => {
  // Function base(s): prefer Netlify Dev (8888) in dev, then same-origin; allow override via VITE_FUNCTIONS_BASE
  const functionBases: string[] = (import.meta as any).env.VITE_FUNCTIONS_BASE
    ? [((import.meta as any).env.VITE_FUNCTIONS_BASE as string)]
    : (import.meta as any).env.DEV
      ? ['http://localhost:8888', '']
      : [''];

  const fetchFunction = async (name: string, init: RequestInit, qs?: URLSearchParams) => {
    let lastErr: any = null;
    for (const base of functionBases) {
      const url = `${base}/.netlify/functions/${name}${qs ? `?${qs.toString()}` : ''}`;
      try {
        const res = await fetch(url, init);
        return res;
      } catch (e: any) {
        lastErr = e;
        // Try next base on network error
        continue;
      }
    }
    throw lastErr || new Error('Could not reach Netlify Functions');
  };
  // auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // ui state
  const [activeTab, setActiveTab] = useState<'events' | 'gallery'>('events');
  const activeBucket: Bucket | null = useMemo(() => {
    if (activeTab === 'events') return 'events-posters';
    if (activeTab === 'gallery') return 'gallery';
    return null;
  }, [activeTab]);

  // media
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; name: string; size: number; type: string }[]>([]);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setSessionToken(data.session.access_token);
    })();
  }, []);

  // ---- helpers ----
  const callFunction = async (name: string, init: RequestInit) => {
    if (!sessionToken) throw new Error('Not authenticated');
    const res = await fetchFunction(name, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
        'x-user-role': 'admin',
        ...(init.headers || {}),
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  // ---- ordering helpers (events only) ----
  const applyOrder = (items: ImageItem[], order?: string[]) => {
    if (!order || !order.length) return items;
    const indexMap = new Map(order.map((n, i) => [n, i] as const));
    return [...items].sort((a, b) => {
      const ai = indexMap.has(a.name) ? (indexMap.get(a.name) as number) : Number.MAX_SAFE_INTEGER;
      const bi = indexMap.has(b.name) ? (indexMap.get(b.name) as number) : Number.MAX_SAFE_INTEGER;
      return ai - bi || a.name.localeCompare(b.name);
    });
  };
  const moveImagePosition = (name: string, delta: number) => {
    if (activeBucket !== 'events-posters') return;
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.name === name);
      if (idx < 0) return prev;
      const next = [...prev];
      const ni = Math.max(0, Math.min(next.length - 1, idx + delta));
      if (ni === idx) return prev;
      const [it] = next.splice(idx, 1);
      next.splice(ni, 0, it);
      return next;
    });
    setOrderDirty(true);
  };
  const saveOrder = async () => {
    if (activeBucket !== 'events-posters' || !orderDirty) return;
    try {
      await callFunction('admin-upload-image', {
        method: 'POST',
        body: JSON.stringify({ action: 'saveOrder', bucket: 'events-posters', order: images.map((i) => i.name) }),
      });
      toast.success('Order saved');
      setOrderDirty(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save order');
    }
  };

  // ---- media ----
  const listImages = async (bucket: Bucket) => {
    try {
      setMediaLoading(true);
  const q = new URLSearchParams({ bucket });
  const res = await fetchFunction('admin-upload-image', { headers: { Authorization: `Bearer ${sessionToken}`, 'x-user-role': 'admin' } }, q);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const items = (data.items || []) as ImageItem[];
      const ordered = bucket === 'events-posters' ? applyOrder(items, data.order as string[] | undefined) : items;
      setImages(ordered);
      setLastRefreshedAt(new Date().toLocaleString());
      setOrderDirty(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to list images');
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (sessionToken && activeBucket) {
      listImages(activeBucket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken, activeBucket]);

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previewUrlsRef.current = [];
    };
  }, []);

  // clear selection when switching tabs
  useEffect(() => {
  previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
  previewUrlsRef.current = [];
    setPreviews([]);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFilesSelected = (files: FileList | null) => {
    const arr = files ? Array.from(files) : [];
    // revoke previous URLs and create new previews
    previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    const next = arr.map((f) => ({ url: URL.createObjectURL(f), name: f.name, size: f.size, type: f.type }));
    previewUrlsRef.current = next.map((n) => n.url);
    setSelectedFiles(arr);
    setPreviews(next);
  };

  const removeSelected = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    const removed = previews[index];
    if (removed) {
      URL.revokeObjectURL(removed.url);
      previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== removed.url);
    }
    setSelectedFiles(newFiles);
    setPreviews(previews.filter((_, i) => i !== index));
    if (fileInputRef.current && newFiles.length === 0) fileInputRef.current.value = '';
  };

  const clearSelection = () => {
  previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
  previewUrlsRef.current = [];
    setPreviews([]);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFiles = async (files?: File[] | null) => {
    const list = files ?? selectedFiles;
    if (!list || !list.length || !activeBucket) return;
    setUploading(true);
    try {
      const fileToBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
          };
          reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      // upload sequentially to keep it simple & reliable
      for (const file of Array.from(list)) {
        const base64 = await fileToBase64(file);
        const payload = {
          bucket: activeBucket,
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          fileData: base64,
        };
  const res = await fetchFunction('admin-upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
            'x-user-role': 'admin',
          },
          body: JSON.stringify(payload),
  });
        if (!res.ok) throw new Error(await res.text());
        await res.json(); // not used, but we validate ok
      }
      toast.success(`Uploaded ${list.length} file${list.length > 1 ? 's' : ''}`);
      clearSelection();
      await listImages(activeBucket);
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string) => {
    if (!activeBucket) return;
    const ok = confirm(`Delete "${path}" from ${activeBucket}?`);
    if (!ok) return;
    try {
  const res = await fetchFunction('admin-upload-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-role': 'admin',
        },
        body: JSON.stringify({ bucket: activeBucket, path }),
  });
      if (!res.ok) throw new Error(await res.text());
      await listImages(activeBucket);
      toast.success('Deleted');
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied');
    } catch {
      toast.error('Could not copy URL');
    }
  };

  // ---- auth ----
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      toast.error(error?.message || 'Sign in failed');
      return;
    }
    setSessionToken(data.session.access_token);
    toast.success('Signed in');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSessionToken(null);
    toast.success('Signed out');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl shadow-cinematic border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24 md:h-28 lg:h-32 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <Link to="/" aria-label="GrandHiking Home" className="inline-flex items-center gap-3">
                <img
                  src={tghLogo}
                  alt="GrandHiking logo"
                  className="h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-md"
                />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link to="/">Home</Link>
              </Button>
              {sessionToken && (
                <Button variant="secondary" onClick={signOut}>Logout</Button>
              )}
            </div>
          </div>
        </div>
      </header>
  <main className="container mx-auto mt-4 px-6 pt-32 pb-24 max-w-6xl">
        {!sessionToken ? (
          <Card className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Admin Sign In</h1>
            <form onSubmit={signIn} className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </Card>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(v) => {console.log("value", v); setActiveTab(v as 'events' | 'gallery')}}
            className="space-y-6"
          >
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="events" onClick={() => setActiveTab('events')}>Events Posters</TabsTrigger>
              <TabsTrigger className="flex-1" value="gallery" onClick={() => setActiveTab('gallery')}>Gallery</TabsTrigger>
            </TabsList>

            {/* EVENTS POSTERS */}
            {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Events Posters</h2>
                <div className="text-sm text-muted-foreground">
                  {lastRefreshedAt ? `Last refreshed: ${lastRefreshedAt}` : ''}
                </div>
              </div>
      <Card className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => listImages('events-posters')} variant="outline" disabled={mediaLoading}>
                      {mediaLoading ? 'Refreshing…' : 'Refresh'}
                    </Button>
                    <Button disabled={uploading || !selectedFiles.length} onClick={() => uploadFiles(selectedFiles)}>
                      {uploading ? 'Uploading…' : 'Upload'}
                    </Button>
                    <Button variant="ghost" disabled={!selectedFiles.length} onClick={clearSelection}>Clear</Button>
        <Button variant="secondary" disabled={!orderDirty} onClick={saveOrder}>Save Order</Button>
                  </div>
                </div>
    {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previews.map((p, i) => (
                      <div key={p.url} className="relative group border border-border/20 rounded-md overflow-hidden">
      <img src={p.url} alt={p.name} className="w-full max-h-40 object-contain bg-muted" />
                        <button
                          type="button"
                          onClick={() => removeSelected(i)}
                          className="absolute top-1 right-1 bg-background/80 hover:bg-background text-foreground border border-border/50 rounded px-2 text-xs"
                          aria-label={`Remove ${p.name}`}
                        >
                          ×
                        </button>
                        <div className="p-2 text-xs whitespace-normal break-words" title={`${p.name} • ${(p.size/1024).toFixed(1)} KB`}>
                          {p.name}
                        </div>
                      </div>)
                    )}
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {images.length} image{images.length !== 1 ? 's' : ''} in Events Posters
                  </p>
                </div>
        {mediaLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border/20 rounded-lg p-2">
                <Skeleton className="w-full h-40 rounded bg-muted" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
          <div key={img.name} className="border border-border/20 rounded-lg p-2">
                      <a href={img.url} target="_blank" rel="noreferrer noopener" title="Open full size">
                        <img src={img.url} alt={img.name} className="w-full max-h-80 object-contain bg-muted rounded" />
                      </a>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm whitespace-normal break-words" title={img.name}>{img.name}</div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => moveImagePosition(img.name, -1)}>Up</Button>
                          <Button size="sm" variant="outline" onClick={() => moveImagePosition(img.name, 1)}>Down</Button>
                          <Button size="sm" variant="secondary" onClick={() => copyUrl(img.url)}>Copy URL</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteImage(img.name)}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
        )}
              </Card>
            </div>
            )}

            {/* GALLERY */}
            {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Gallery</h2>
                <div className="text-sm text-muted-foreground">
                  {lastRefreshedAt ? `Last refreshed: ${lastRefreshedAt}` : ''}
                </div>
              </div>
              <Card className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => listImages('gallery')} variant="outline" disabled={mediaLoading}>
                      {mediaLoading ? 'Refreshing…' : 'Refresh'}
                    </Button>
                    <Button disabled={uploading || !selectedFiles.length} onClick={() => uploadFiles(selectedFiles)}>
                      {uploading ? 'Uploading…' : 'Upload'}
                    </Button>
                    <Button variant="ghost" disabled={!selectedFiles.length} onClick={clearSelection}>Clear</Button>
                  </div>
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previews.map((p, i) => (
                      <div key={p.url} className="relative group border border-border/20 rounded-md overflow-hidden">
                        <img src={p.url} alt={p.name} className="w-full h-32 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSelected(i)}
                          className="absolute top-1 right-1 bg-background/80 hover:bg-background text-foreground border border-border/50 rounded px-2 text-xs"
                          aria-label={`Remove ${p.name}`}
                        >
                          ×
                        </button>
                        <div className="p-2 text-xs truncate" title={`${p.name} • ${(p.size/1024).toFixed(1)} KB`}>
                          {p.name}
                        </div>
                      </div>)
                    )}
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {images.length} image{images.length !== 1 ? 's' : ''} in Gallery
                  </p>
                </div>
                {mediaLoading ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="border border-border/20 rounded-lg p-2">
                        <Skeleton className="w-full h-40 rounded bg-muted" />
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.name} className="border border-border/20 rounded-lg p-2">
                      <a href={img.url} target="_blank" rel="noreferrer noopener" title="Open full size">
                        <img src={img.url} alt={img.name} className="w-full max-h-80 object-contain bg-muted rounded" />
                      </a>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm whitespace-normal break-words" title={img.name}>{img.name}</div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" onClick={() => copyUrl(img.url)}>Copy URL</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteImage(img.name)}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </Card>
            </div>
            )}
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
