import type { ReactNode } from 'react';
import styles from './mobile.module.css';
export function PaperLabel({ children, tone = 'yellow' }: { children: ReactNode; tone?: 'yellow' | 'blue' | 'cream' }) {
  return <span className={styles.paperLabel} data-tone={tone}>{children}</span>;
}
