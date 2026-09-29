import type { ReactNode } from 'react';
import styles from './mobile.module.css';
export function SafeAreaScene({ children }: { children: ReactNode }) {
  return <div className={styles.safeScene} data-safe-area-scene>{children}</div>;
}
