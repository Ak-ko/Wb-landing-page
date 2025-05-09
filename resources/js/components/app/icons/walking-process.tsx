import { SVGProps } from 'react';
const WalkingProcess = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200" width={114} height={182} fill="none" {...props}>
        <rect width={114} height={128} fill={props.color || '#1274EF'} rx={16} />

        <path
            fill={props.color || '#1274EF'}
            d="M52.486 112v52.646l.014 12.631c0 2.583-2.117 4.681-4.732 4.685l-36.56.038a1.71 1.71 0 0 1-1.703-1.853c.938-12.281 11.237-19.857 23.89-20.018v-48.126h19.087l.004-.003ZM62.514 112v52.646l-.014 12.631c0 2.583 2.067 4.681 4.622 4.685l35.71.038c.985 0 1.739-.86 1.663-1.853-.916-12.281-10.976-19.857-23.335-20.018v-48.126H62.517l-.003-.003Z"
        />
    </svg>
);
export default WalkingProcess;
