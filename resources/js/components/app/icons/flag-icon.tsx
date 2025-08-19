import { SVGProps } from 'react';
const FlagIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 56" width={49} height={56} fill="none" {...props}>
        <path
            fill={props.style?.fill || '#1274EF'}
            d="M7 3.5C7 1.564 5.436 0 3.5 0A3.496 3.496 0 0 0 0 3.5v49C0 54.436 1.564 56 3.5 56S7 54.436 7 52.5V39.2l6.858-2.056a18.762 18.762 0 0 1 13.803 1.192 18.775 18.775 0 0 0 15.006.787l4.058-1.52A3.502 3.502 0 0 0 49 34.322V7.23c0-2.516-2.647-4.157-4.9-3.03l-1.29.645a17.444 17.444 0 0 1-15.62 0 17.43 17.43 0 0 0-12.818-1.104L7 5.95V3.5Z"
        />
    </svg>
);
export default FlagIcon;
