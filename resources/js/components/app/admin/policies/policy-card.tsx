import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, FileText } from 'lucide-react';
import { useState } from 'react';
import PolicyForm from './policy-form';

interface PolicyCardProps {
    title: string;
    content: string | null;
    type: 'mission' | 'vision' | 'core_values';
}

export default function PolicyCard({ title, content, type }: PolicyCardProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    return (
        <>
            <Card className="h-full">
                <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">{title}</h3>
                    {content ? (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                            <FileText className="mb-2 h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500">No content added yet</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end p-4 pt-0">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit {title}</DialogTitle>
                    </DialogHeader>
                    <PolicyForm
                        content={content || ''}
                        type={type}
                        onSuccess={() => {
                            setIsEditDialogOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
