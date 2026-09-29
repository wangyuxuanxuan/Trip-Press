import { HandDrawnIcon } from './mobile';
import styles from './shared.module.css';
export function Placeholder({ label, compact = false }: { label: string; compact?: boolean }) {
  return <div className={compact ? styles.compactPlaceholder : styles.placeholder}><HandDrawnIcon name="photo" /><span>{label}</span></div>;
}
