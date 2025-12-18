import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import * as postsRoutes from '@/routes/posts';
import PostCard from '@/components/post-card';

interface Props {
    posts: Post[];
}

export default function Index({ posts }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        image: null as File | null,
        caption: '',
    });

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
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
