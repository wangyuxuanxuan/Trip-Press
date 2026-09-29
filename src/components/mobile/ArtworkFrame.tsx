import type { ReactNode } from 'react';
import styles from './mobile.module.css';
export function ArtworkFrame({ children, label }: { children: ReactNode; label?: string }) {
  return <div className={styles.artworkFrame}>{children}{label && <span className={styles.frameLabel}>{label}</span>}</div>;
}
