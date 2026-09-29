import type { SVGProps } from 'react';
export type IconName = 'arrow' | 'back' | 'photo' | 'compass' | 'print' | 'info' | 'close' | 'check';
const paths: Record<IconName, string> = {
  arrow: 'M4 12.5 20 12M14 5l7 7-7 7',
  back: 'M20 12H4M10 5l-7 7 7 7',
  photo: 'M3 5.5 21 5l.2 15-18 .4ZM4 17l5-5 4 4 3-3 5 5M16 9h.1',
  compass: 'M12 2.5a9.5 9.5 0 1 0 .1 0M15.5 8.5l-2 5-5 2 2-5Z',
  print: 'M7 8V3h10v5M7 18H3V9h18v9h-4M7 14h10v8H7ZM17 11h.1',
  info: 'M12 2.5a9.5 9.5 0 1 0 .1 0M12 10v7M12 6.5h.1',
  close: 'm6 6 12 12M18 6 6 18',
  check: 'm4 12 5 6 11-12',
};
export function HandDrawnIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><path d={paths[name]} /></svg>;
}
