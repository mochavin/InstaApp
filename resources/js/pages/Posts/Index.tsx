import AppLayout from '@/layouts/app-layout';
import { PaginatedData, Post, SharedData } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { FormEventHandler, useState, useEffect, useRef } from 'react';
import * as postsRoutes from '@/routes/posts';
import PostCard from '@/components/post-card';

interface Props {
    posts: PaginatedData<Post>;
}

export default function Index({ posts }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [allPosts, setAllPosts] = useState<Post[]>(posts.data);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (flash.newPost) {
            setAllPosts((prev) => {
                if (prev.some((p) => p.id === flash.newPost!.id)) return prev;
                return [flash.newPost!, ...prev];
            });
        }
    }, [flash.newPost]);

    useEffect(() => {
        if (flash.updatedPost) {
            setAllPosts((prev) => prev.map((p) => (p.id === flash.updatedPost!.id ? flash.updatedPost! : p)));
        }
    }, [flash.updatedPost]);

    useEffect(() => {
        if (flash.deletedPostId) {
            setAllPosts((prev) => prev.filter((p) => p.id !== flash.deletedPostId));
        }
    }, [flash.deletedPostId]);

    const [showCreate, setShowCreate] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        image: null as File | null,
        caption: '',
    });

    useEffect(() => {
        setAllPosts((prev) => {
            if (posts.current_page === 1) {
                return posts.data;
            }

            const updatedPrev = prev.map((p) => {
                const updated = posts.data.find((newP) => newP.id === p.id);
                return updated ? updated : p;
            });

            const newPosts = posts.data.filter((p) => !prev.some((existing) => existing.id === p.id));
            return [...updatedPrev, ...newPosts];
        });
    }, [posts.data, posts.current_page]);

    useEffect(() => {
        if (loading) return;

        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0,
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && posts.next_page_url) {
                setLoading(true);
                router.get(
                    posts.next_page_url!,
                    {},
                    {
                        preserveState: true,
                        preserveScroll: true,
                        only: ['posts'],
                        onFinish: () => setLoading(false),
                    },
                );
            }
        };

        observer.current = new IntersectionObserver(callback, options);
        if (lastPostRef.current) {
            observer.current.observe(lastPostRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [posts.next_page_url, loading]);

    useEffect(() => {
        if (!data.image) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(postsRoutes.store().url, {
            onSuccess: () => {
                reset();
                setShowCreate(false);
                setPreview(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Feed" />

            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 mb-8 flex justify-between items-center border-b">
                    <h1 className="text-2xl font-bold">Feed</h1>
                    <Button onClick={() => setShowCreate(!showCreate)}>
                        {showCreate ? 'Cancel' : 'Create Post'}
                    </Button>
                </div>

                {/* Create Post */}
                {showCreate && (
                    <Card className="mb-8">
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Create Post</h3>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                        accept="image/*"
                                    />
                                    {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                                </div>

                                {preview && (
                                    <div className="relative mt-4">
                                        <img src={preview} alt="Preview" className="w-full h-auto rounded-md max-h-96 object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => setData('image', null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                <div>
                                    <Textarea
                                        placeholder="Write a caption..."
                                        value={data.caption}
                                        onChange={(e) => setData('caption', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.caption && <div className="text-red-500 text-sm mt-1">{errors.caption}</div>}
                                </div>
                                <Button type="submit" disabled={processing || !data.image}>
                                    Post
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Feed */}
                <div className="space-y-6">
                    {allPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Loading Sentinel */}
                <div ref={lastPostRef} className="h-20 flex items-center justify-center mt-4">
                    {loading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
                </div>
            </div>
        </AppLayout>
    );
}
