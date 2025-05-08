import CloseQuote from './icons/close-quote';

export default function TestimonialCard() {
    return (
        <div className="w-full rounded-xl bg-[#F5F5F5] p-15 shadow lg:min-w-[550px]">
            <div className="mb-3 flex items-start justify-between">
                <div>
                    {/* avatar  */}
                    <img />
                    <div>
                        <h1 className="text-lg font-bold">[name]</h1>
                        {/* dynamic text color */}
                        <span className="text-sm">[role]</span>
                    </div>
                </div>
                {/* dynamic quote color */}
                <CloseQuote width={50} />
            </div>
            <p className="line-clamp-3 text-sm leading-[2]">[dynamic paragraph]</p>
        </div>
    );
}
