import { cn } from '@/lib/utils';

interface PropsT {
    header: string;
    description?: string;
    headerClass?: string;
    descriptionClass?: string;
}

export default function SectionHeader({ header, headerClass, descriptionClass, description }: PropsT) {
    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <h1 className={cn('text-center text-[40px] font-extrabold uppercase sm:text-[50px]', headerClass)}>{header}</h1>
            <p className={cn('text-md font-inter max-w-[350px] text-center font-medium sm:max-w-[550px] sm:text-lg', descriptionClass)}>
                {description}
            </p>
        </div>
    );
}
