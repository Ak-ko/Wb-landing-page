import { SVGProps } from 'react';
const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={80} height={80} fill="none" {...props}>
        <g fill={props?.fill || '#000'} clipPath="url(#a)">
            <path d="m73.617 17.046-7.908 7.893H14.29l-7.894-7.893L17.045 6.398l15.432 15.43V0h15.06v21.829L62.97 6.398l10.648 10.648ZM80 47.538H58.186l15.431 15.431L62.97 73.617 47.538 58.186V80H32.477V58.186L17.046 73.617 6.398 62.97l15.43-15.431H0V32.477h80v15.061Z" />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h80v80H0z" />
            </clipPath>
        </defs>
    </svg>
);
export default Logo;
