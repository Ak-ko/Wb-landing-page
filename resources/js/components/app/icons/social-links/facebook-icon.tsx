import { SVGProps } from 'react';
const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={69} height={69} fill="none" {...props}>
        <path
            fill="#000"
            fillRule="evenodd"
            d="M34.621.72c18.795 0 34.032 15.222 34.032 34 0 18.777-15.237 34-34.032 34-18.794 0-34.03-15.223-34.03-34 0-18.778 15.236-34 34.03-34Z"
            clipRule="evenodd"
        />
        <path
            fill="#fff"
            d="M39.044 68.434V42.172h7.411l.982-9.243h-8.393l.013-4.626c0-2.41.23-3.702 3.695-3.702h4.633v-9.245h-7.412c-8.903 0-12.037 4.484-12.037 12.025v5.55h-5.55v9.243h5.55v25.888a34.372 34.372 0 0 0 11.108.372Z"
        />
    </svg>
);
export default FacebookIcon;
