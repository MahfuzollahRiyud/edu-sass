import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.webp"
            alt="EduFlow Logo"
            className={`object-contain ${className || 'size-6'}`}
            {...props}
        />
    );
}

