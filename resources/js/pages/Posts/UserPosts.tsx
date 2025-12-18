import AppLayout from '@/layouts/app-layout';
import { PaginatedData, Post, User, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import PostCard from '@/components/post-card';

interface Props {
    user: User;
    posts: PaginatedData<Post>;
    posts_count: number;
}

export default function UserPosts({ user, posts, posts_count }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [allPosts, setAllPosts] = useState<Post[]>(posts.data);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostRef = useRef<HTMLDivElement | null>(null);

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

    return (
        <AppLayout>
            <Head title={`${user.name}'s Posts`} />

            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 mb-8 border-b">
                    <h1 className="text-2xl font-bold">{user.name}'s Posts</h1>
                    <p className="text-sm text-muted-foreground">{posts_count} {posts_count === 1 ? 'post' : 'posts'}</p>
                </div>

                {allPosts.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            This user hasn't posted anything yet.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {allPosts.map((post, index) => (
                            <div ref={index === allPosts.length - 1 ? lastPostRef : null} key={post.id}>
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading Sentinel */}
                <div className="h-20 flex items-center justify-center mt-4">
                    {loading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
                </div>
            </div>
        </AppLayout>
    );
}
