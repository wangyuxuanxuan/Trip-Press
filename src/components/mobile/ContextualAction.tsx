import type { ReactNode } from 'react';
import styles from './mobile.module.css';
/** Scene-owned primary action slot, never persistent navigation. */
export function ContextualAction({ children }: { children: ReactNode }) {
  return <div className={styles.contextualAction}>{children}</div>;
}
