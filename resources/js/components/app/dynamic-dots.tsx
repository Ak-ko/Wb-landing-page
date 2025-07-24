export default function DynamicDots() {
    return (
        <span className="mx-2 overflow-hidden whitespace-nowrap text-white" style={{ letterSpacing: 1.5 }}>
            {/* Mobile (default) */}
            <span className="block sm:hidden">{'·'.repeat(12)}</span>
            {/* Small screens */}
            <span className="hidden sm:block md:hidden">{'·'.repeat(18)}</span>
            {/* Medium screens */}
            <span className="hidden md:block lg:hidden">{'·'.repeat(25)}</span>
            {/* Large screens */}
            <span className="hidden lg:block xl:hidden">{'·'.repeat(35)}</span>
            {/* Extra large screens */}
            <span className="hidden xl:block 2xl:hidden">{'·'.repeat(45)}</span>
            {/* 2XL screens */}
            <span className="hidden 2xl:block">{'·'.repeat(60)}</span>
        </span>
    );
}
