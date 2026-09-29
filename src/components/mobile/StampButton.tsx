import type { ButtonHTMLAttributes } from 'react';
import { HandDrawnIcon } from './HandDrawnIcon';
import styles from './mobile.module.css';
export function StampButton({ children, className = '', tone = 'coral', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'coral' | 'yellow' }) {
  return <button type="button" {...props} className={`${styles.stampButton} ${className}`} data-tone={tone}><span>{children}</span><HandDrawnIcon name="arrow" /></button>;
}
