import type { ComponentProps } from 'react';

export function Container({ className = '', ...props }: ComponentProps<'div'>) {
  return <div {...props} className={`mx-auto w-full max-w-[1440px] px-4 lg:px-8 xl:px-20 ${className}`} />;
}
