import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export type FlashT = {
    [key: string]: string;
};

interface PropsT {
    flash: FlashT | unknown;
}

export default function Toast({ flash }: PropsT) {
    useEffect(() => {
        // @ts-expect-error @ts-ignore
        if (flash?.success) {
            // @ts-expect-error @ts-ignore
            toast.success(flash.success);
        }
        // @ts-expect-error @ts-ignore
        if (flash?.error) {
            // @ts-expect-error @ts-ignore
            toast.error(flash.error);
        }
    }, [flash]);

    return <Toaster position="top-right" richColors closeButton />;
}
