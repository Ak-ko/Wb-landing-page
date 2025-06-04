import { cn } from '@/lib/utils';
import CommonHeaderAnimation from './common-header-animation';

export default function ArtPlanHeaderSection() {
    return (
        <CommonHeaderAnimation>
            <div>
                <div className={cn('flex flex-col items-center justify-center gap-5 px-3 lg:px-0')}>
                    <h1 className={cn('text-center text-[40px] font-extrabold uppercase sm:text-[50px]')}>
                        With the power of <span className="text-primary-orange">Art</span>
                    </h1>
                    <p
                        className={cn(
                            'text-md font-inter max-w-[350px] text-center font-medium sm:max-w-[550px] sm:text-lg',
                            'text-secondary-pink mt-2 !max-w-[700px] !text-[30px] font-bold uppercase sm:!text-[35px]',
                        )}
                    >
                        Ever Wished your brand could high-five customers?
                    </p>
                </div>

                <p className="mx-auto mt-5 max-w-[800px] text-center text-lg font-medium">
                    Our talented artists create fun and memorable mascots that do just that.
                </p>
            </div>
        </CommonHeaderAnimation>
    );
}
