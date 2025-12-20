import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <Card className="w-full min-w-xl border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-muted rounded-full p-4 mb-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    {description}
                </p>
                {actionLabel && onAction && (
                    <Button onClick={onAction} variant="outline">
                        {actionLabel}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
