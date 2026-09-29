import type { HTMLAttributes } from 'react';
import styles from './mobile.module.css';
export function PaperSurface({ tone = 'cream', className = '', children, ...props }: HTMLAttributes<HTMLDivElement> & { tone?: 'cream' | 'coral' | 'apricot' }) {
  return <div {...props} className={`${styles.paper} ${className}`} data-tone={tone}>{children}</div>;
}
