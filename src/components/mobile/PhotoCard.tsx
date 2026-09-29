import {SafeImage} from './SafeImage';
import { HandDrawnIcon } from './HandDrawnIcon';
import styles from './mobile.module.css';
export interface PhotoCardProps { src?: string; alt?: string; label?: string; compact?: boolean; }
export function PhotoCard({ src, alt = '', label = '照片占位', compact = false }: PhotoCardProps) {
  return <div className={styles.photoCard} data-compact={compact}>
    <div className={styles.photoWindow}>{src ? <SafeImage src={src} alt={alt} loading="lazy" /> : <><HandDrawnIcon name="photo" /><span>{label}</span></>}</div>
    {!compact && <div className={styles.photoCaption}>a little moment, kept forever.</div>}
  </div>;
}
