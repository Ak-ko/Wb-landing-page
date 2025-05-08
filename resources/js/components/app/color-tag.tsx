export default function ColorTag({ color }: { color: string }) {
    return <div style={{ backgroundColor: color }} className="h-[20px] w-[20px] rounded-full border shadow"></div>;
}
