import { InertiaLinkProps, Link } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';

type PropsT = {
    link: InertiaLinkProps;
};

export default function TableViewButton({ link }: PropsT) {
    return (
        <Link {...link} className="bg-primary flex h-5 w-5 items-center justify-center gap-2 rounded-full">
            <EyeIcon className="text-white" size={11} />
        </Link>
    );
}
