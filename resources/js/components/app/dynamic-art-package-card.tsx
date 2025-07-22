import { isLightColor } from '@/lib/colors';
import { MESSENGER } from '@/lib/social-links';
import { ArtPackageT } from '@/types';
import { Check, ChevronRight } from 'lucide-react';

interface PropsT {
    artPackage: ArtPackageT;
}

export default function DynamicArtPackageCard({ artPackage }: PropsT) {
    if (!artPackage) {
        return null;
    }

    const textColor = isLightColor(artPackage?.color) ? 'black' : 'white';

    return (
        <div
            className={`rounded-2xl bg-black p-7 transition-all duration-500 hover:shadow-xl hover:ring-4 hover:ring-black`}
            style={{ color: '#fff' }}
        >
            <h1 className="text-3xl font-bold uppercase" style={{ color: artPackage?.color }}>
                {artPackage?.title}
            </h1>
            <ul className="my-5 space-y-3">
                {artPackage?.items &&
                    artPackage?.items?.map((i) => (
                        <li key={i?.id} className="flex items-center gap-1 text-sm">
                            <Check className="size-3.5 stroke-3" style={{ color: artPackage?.color }} />
                            <span>{i?.item}</span>
                        </li>
                    ))}
            </ul>

            <ul className="space-y-6">
                {artPackage?.prices &&
                    artPackage?.prices?.map((p) => (
                        <li key={p?.id} className="space-y-1">
                            <h1 className="text-2xl font-bold">{p?.price}</h1>
                            <div className="flex items-center gap-2 text-sm">
                                <span>Duration:</span>
                                <div className="flex items-center">
                                    <span className="inline-block h-[1px] w-[50px]" style={{ backgroundColor: '#fff' }} />
                                    <ChevronRight className="-ml-2 size-4" />
                                </div>
                                <span> {p?.duration}</span>
                            </div>
                        </li>
                    ))}
            </ul>

            <div className="mx-5 mt-6 text-center">
                <a
                    href={MESSENGER}
                    target="_blank"
                    className="block w-full cursor-pointer rounded-lg px-8 py-4 font-bold transition-all duration-500 hover:-translate-y-1"
                    style={{ backgroundColor: artPackage?.color, color: textColor }}
                >
                    Get This Package
                </a>
            </div>
        </div>
    );
}
