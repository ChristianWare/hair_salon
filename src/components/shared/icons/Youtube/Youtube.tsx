// src/icons/Youtube/Youtube.tsx
import { SVGProps } from "react";

export default function Youtube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 -3 20 20'
      width='1em'
      height='1em'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      aria-label='youtube'
      {...props}
    >
      <path d='M11.988 6.586v-5.612c1.993.937 3.536 1.842 5.361 2.818-1.505.835-3.368 1.772-5.361 2.793M23.091 3.783a1.67 1.67 0 0 0-1.552-1.92c-1.833-.348-13.267-.349-15.099 0a1.67 1.67 0 0 0-1.328.672c-1.612 1.496-1.107 9.518-.718 10.817.163.562.374.968.64 1.234.343.352.812.594 1.351.703 1.509.312 9.283.486 15.121.046.538-.094 1.014-.344 1.39-.711 1.49-1.49 1.389-9.963.195-11.842' />
    </svg>
  );
}
