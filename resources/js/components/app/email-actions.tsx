import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Assuming you have tooltip components
import { Copy, CopyCheck, Mail } from 'lucide-react';
import { useState } from 'react';

interface EmailActionsProps {
    email: string | null;
}

export default function EmailActions({ email }: EmailActionsProps) {
    const [copied, setCopied] = useState(false);

    if (!email) {
        return <span className="text-gray-400">Not provided</span>;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <span>{email}</span>
            <TooltipProvider>
                <Tooltip open={copied}>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6">
                            {copied ? <CopyCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{copied ? 'Copied !' : 'Copy'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                            <a href={`mailto:${email}`}>
                                <Mail className="h-3 w-3" />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Send Email</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
