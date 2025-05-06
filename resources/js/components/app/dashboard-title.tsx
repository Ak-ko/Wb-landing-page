interface PropsT {
    title: string;
    description?: string;
}

export default function DashboardTitle({ title, description }: PropsT) {
    return (
        <div className="space-y-1">
            <h1 className="text-xl font-bold text-black dark:text-white">{title}</h1>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
    );
}
