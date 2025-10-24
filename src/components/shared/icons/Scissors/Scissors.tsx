// src/icons/Scissors/Scissors.tsx
import { SVGProps } from "react";

export default function Scissors(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <circle cx='6' cy='6' r='3' />
      <path d='M8.12 8.12 12 12' />
      <path d='M20 4 8.12 15.88' />
      <circle cx='6' cy='18' r='3' />
      <path d='M14.8 14.8 20 20' />
    </svg>
  );
}
