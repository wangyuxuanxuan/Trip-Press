import type { ReactNode } from 'react';
import { HandDrawnIcon } from './HandDrawnIcon';
import styles from './mobile.module.css';
/** Presentation shell only; no sorting controls or category logic. */
export function CompassShell({ children }: { children?: ReactNode }) {
  return <div className={styles.compassShell}><span className={styles.compassFace}><HandDrawnIcon name="compass" /></span><div>{children}</div></div>;
}
