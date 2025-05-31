import { cn } from '@/lib/utils';
import htmlParser, { DOMNode } from 'html-react-parser';
import { useId } from 'react';

interface PropsT {
    title: string;
    content: string;
    containerClassName?: string;
    titleClassName?: string;
    contentClassName?: string;
}

export default function PhilosophyCard({ title, content, titleClassName, contentClassName, containerClassName }: PropsT) {
    const id = useId();
    return (
        <div className={cn('flex flex-col rounded-3xl bg-[#F5F5F5] p-8 shadow', containerClassName)}>
            <h1 className={cn('mb-5 text-center text-[40px] font-bold uppercase sm:text-[45px]', titleClassName)}>{title}</h1>
            <div className={cn('', contentClassName)}>
                {htmlParser(content, {
                    replace: (domNode: DOMNode) => {
                        // @ts-expect-error @ts-ignore
                        if (domNode?.name === 'li') {
                            // @ts-expect-error @ts-ignore
                            const children = domNode.children || [];

                            return (
                                <li className="my-4 flex list-none gap-3">
                                    <img src="/assets/logo.png" alt="bullet" className="mt-1 size-5" />
                                    <span>
                                        {
                                            // @ts-expect-error  @ts-ignore
                                            children.map((child) => {
                                                if (child?.type === 'text') return child.data;
                                                if (child?.type === 'tag') {
                                                    if (child?.children[0]?.type === 'text') return child.children[0].data;

                                                    if (child?.children[0]?.type === 'tag') {
                                                        if (child?.children[0]?.name === 'strong') {
                                                            return <strong key={id}>{child?.children[0]?.children[0]?.data}</strong>;
                                                        }

                                                        if (child?.children[0]?.name === 'a') {
                                                            return (
                                                                <a key={id} href={child?.children[0]?.attribs?.href}>
                                                                    {child?.children[0]?.children[0]?.data}
                                                                </a>
                                                            );
                                                        }

                                                        if (child?.children[0]?.name === 'em') {
                                                            return <em key={id}>{child?.children[0]?.children[0]?.data}</em>;
                                                        }

                                                        if (child?.children[0]?.name === 'u') {
                                                            return <u key={id}>{child?.children[0]?.children[0]?.data}</u>;
                                                        }

                                                        if (child?.children[0]?.name === 's') {
                                                            return <s key={id}>{child?.children[0]?.children[0]?.data}</s>;
                                                        }
                                                    }
                                                }
                                                return child?.children?.[0]?.data || null;
                                            })
                                        }
                                    </span>
                                </li>
                            );
                        }
                    },
                })}
            </div>
        </div>
    );
}
