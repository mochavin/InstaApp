import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as commentsRoutes from '@/routes/comments';
import * as postsRoutes from '@/routes/posts';
import * as usersRoutes from '@/routes/users';
import { Post, SharedData } from '@/types';
import { useForm, usePage, Link } from '@inertiajs/react';
import { Edit2, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';

export default function PostCard({ post }: { post: Post }) {
    const { auth } = usePage<SharedData>().props;
    const { post: postLike, delete: deleteLike } = useForm();
    const { data: commentData, setData: setCommentData, post: postComment, reset: resetComment, processing: commentProcessing } = useForm({
        body: '',
    });
    const { data: editData, setData: setEditData, post: updatePost, delete: deletePost, processing: updateProcessing } = useForm({
        caption: post.caption || '',
        image: null as File | null,
        _method: 'PATCH',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'post' | 'comment', id: number } | null>(null);

    useEffect(() => {
        if (!editData.image) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(editData.image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [editData.image]);

    const toggleLike = () => {
        if (post.is_liked) {
            deleteLike(postsRoutes.unlike(post.id).url, { preserveScroll: true });
        } else {
            postLike(postsRoutes.like(post.id).url, { preserveScroll: true });
        }
    };

    const submitComment: FormEventHandler = (e) => {
        e.preventDefault();
        postComment(commentsRoutes.store(post.id).url, {
            preserveScroll: true,
            onSuccess: () => resetComment(),
        });
    };

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        updatePost(postsRoutes.update(post.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setPreview(null);
                setEditData('image', null);
            },
        });
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;

        if (deleteConfirm.type === 'post') {
            deletePost(postsRoutes.destroy(deleteConfirm.id).url, { preserveScroll: true });
        } else {
            deletePost(commentsRoutes.destroy(deleteConfirm.id).url, { preserveScroll: true });
        }
        setDeleteConfirm(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-3">
                        <Link href={usersRoutes.posts(post.user_id).url} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <Avatar>
                                <AvatarImage src={post.user.avatar} />
                                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{post.user.name}</span>
                        </Link>
                    </div>
                    {post.user_id === auth.user.id && (
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: 'post', id: post.id })}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    {isEditing ? (
                        <div className="p-4 space-y-4">
                            <div className="relative">
                                <img src={preview || post.image} alt="Preview" className="w-full h-auto aspect-square object-cover rounded-md" />
                                <Input
                                    type="file"
                                    onChange={(e) => setEditData('image', e.target.files ? e.target.files[0] : null)}
                                    accept="image/*"
                                    className="mt-2"
                                />
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-2">
                                <Textarea
                                    value={editData.caption}
                                    onChange={(e) => setEditData('caption', e.target.value)}
                                    rows={3}
                                    placeholder="Write a caption..."
                                />
                                <div className="flex space-x-2">
                                    <Button type="submit" size="sm" disabled={updateProcessing}>Save</Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => {
                                        setIsEditing(false);
                                        setPreview(null);
                                        setEditData('image', null);
                                    }}>Cancel</Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <img
                                        src={post.image}
                                        alt={post.caption || ''}
                                        className="w-full h-auto aspect-square object-cover cursor-pointer transition-opacity hover:opacity-90"
                                    />
                                </DialogTrigger>
                                <DialogContent className="min-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none flex items-center justify-center">
                                    <img src={post.image} alt={post.caption || ''} className="w-full h-auto max-h-[90vh] object-contain" />
                                </DialogContent>
                            </Dialog>
                            <div className="px-4 pt-4 pb-2">
                                <p className="text-sm">
                                    <Link href={usersRoutes.posts(post.user_id).url} className="font-bold mr-2 hover:underline">
                                        {post.user.name}
                                    </Link>
                                    {post.caption}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase mt-1">
                                    {post.created_at_human}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 pt-0">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <Button variant="ghost" onClick={toggleLike} className='px-2'>
                                <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="font-bold text-sm ml-1">{post.likes_count}</span>
                            </Button>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" className='px-2'>
                                <MessageCircle className="h-4 w-4" />
                                <span className="font-bold text-sm ml-1">{post.comments.length}</span>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Comments */}
                    <div className="w-full space-y-3 mt-2 mb-4">
                        {post.comments.map((comment) => (
                            <div key={comment.id} className="text-sm flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <Link href={usersRoutes.posts(comment.user_id).url} className="font-bold hover:underline">
                                            {comment.user.name}
                                        </Link>
                                        <span className="text-[10px] text-muted-foreground">
                                            {comment.created_at_human}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90 mt-0.5">
                                        {comment.body}
                                    </p>
                                </div>
                                {comment.user_id === auth.user.id && (
                                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-2" onClick={() => setDeleteConfirm({ type: 'comment', id: comment.id })}>
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={submitComment} className="flex w-full items-center space-x-2">
                        <Input
                            placeholder="Add a comment..."
                            value={commentData.body}
                            onChange={(e) => setCommentData('body', e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={commentProcessing || !commentData.body}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title={`Delete ${deleteConfirm?.type === 'post' ? 'Post' : 'Comment'}`}
                description={`Are you sure you want to delete this ${deleteConfirm?.type}? This action cannot be undone.`}
            />
        </>
    );
}
