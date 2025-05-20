import { cn } from '@/lib/utils';
import { SVGProps } from 'react';
const OpenQuote = (props: SVGProps<SVGSVGElement>) => (
    <svg
        className={cn('rotate-y-[180deg]', props.className)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 70 70"
        width={68}
        height={48}
        fill="none"
        {...props}
    >
        <path
            fill={props.color || '#1274EF'}
            d="M67.069 18c0-9.945-8.04-18-17.968-18h-1.197a4.79 4.79 0 0 0-4.792 4.8 4.79 4.79 0 0 0 4.792 4.8H49.1c4.627 0 8.385 3.765 8.385 8.4v1.2h-9.582c-5.286 0-9.583 4.305-9.583 9.6v9.6c0 5.295 4.297 9.6 9.583 9.6h9.582c5.286 0 9.583-4.305 9.583-9.6V18Zm-38.33 0c0-9.945-8.041-18-17.968-18H9.573a4.79 4.79 0 0 0-4.791 4.8 4.79 4.79 0 0 0 4.791 4.8h1.198c4.627 0 8.385 3.765 8.385 8.4v1.2H9.573c-5.285 0-9.583 4.305-9.583 9.6v9.6c0 5.295 4.298 9.6 9.583 9.6h9.583c5.285 0 9.582-4.305 9.582-9.6V18Z"
        />
    </svg>
);
export default OpenQuote;
