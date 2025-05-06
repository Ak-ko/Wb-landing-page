import { InertiaLinkProps, Link } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';

type PropsT = {
    link?: InertiaLinkProps;
    onClick?: MouseEventHandler;
};

export default function TableEditButton({ link, onClick }: PropsT) {
    return link ? (
        <Link onClick={onClick} {...link} className="bg-primary flex h-5 w-5 items-center justify-center gap-2 rounded-full">
            <PencilIcon className="text-white" size={10} />
        </Link>
    ) : (
        <div onClick={onClick} className="bg-primary flex h-5 w-5 items-center justify-center gap-2 rounded-full">
            <PencilIcon className="text-white" size={10} />
        </div>
    );
}
