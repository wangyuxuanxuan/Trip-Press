import type { ReactNode } from 'react';
import { HandDrawnIcon } from './HandDrawnIcon';
import styles from './mobile.module.css';
/** Static housing; the existing scene owns generation timing. */
export function PrintMachineShell({ children }: { children: ReactNode }) {
  return <div className={styles.printMachineShell}><div className={styles.machineTop}><HandDrawnIcon name="print" /><span>TRIP PRESS / 印制台</span><i aria-hidden="true" /></div><div className={styles.machineSlot} aria-hidden="true" /><div className={styles.machinePaper}>{children}</div></div>;
}
