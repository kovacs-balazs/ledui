'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ellenőrzés első betöltéskor
    const checkIsMobile = () => setIsMobile(window.innerWidth < breakpoint);

    checkIsMobile();

    // Frissítés, ha az ablak mérete változik
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}

// export function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
//     const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
//     setIsMobile(mobile);
//   }, []);

//   return isMobile;
// }