import { cn } from '@/lib/utils';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const NotFoundLottie = ({ className }: { className?: string }) => {
    return <DotLottieReact src="/assets/lottie/not-found.lottie" loop autoplay className={cn('w-[400px]', className)} />;
};
