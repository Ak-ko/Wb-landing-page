interface PropsT {
    img: string;
    title: string;
    description: string;
}

export default function WhyUsCard({ img, title, description }: PropsT) {
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <img className="animate-why-us-img w-[180px]" src={img} />
            <h1 className="text-center text-xl font-bold uppercase">{title}</h1>
            <p className="max-w-[300px] text-center">{description}</p>
        </div>
    );
}
