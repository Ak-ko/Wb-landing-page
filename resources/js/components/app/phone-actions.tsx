import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Assuming you have tooltip components
import { Copy, CopyCheck, Phone } from 'lucide-react';
import { useState } from 'react';

interface PhoneActionsProps {
    phone: string | null;
}

export default function PhoneActions({ phone }: PhoneActionsProps) {
    const [copied, setCopied] = useState(false);

    if (!phone) {
        return <span className="text-gray-400">Not provided</span>;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        } catch (err) {
            console.error('Failed to copy phone number: ', err);
            alert('Failed to copy phone number. Please check browser permissions or if the site is served over HTTPS.');
        }
    };

    const formattedPhone = phone.replace(/[^\d+]/g, '');

    return (
        <div className="flex items-center gap-1">
            <span>{phone}</span>
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
                            <a href={`tel:${formattedPhone}`}>
                                <Phone className="h-3 w-3" />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Call Phone Number</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
