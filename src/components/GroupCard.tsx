import type { PhotoGroup } from '../domain/types';
import { categoryLabels } from '../data/mock';
import { PhotoStack, HandDrawnIcon } from './mobile';
import styles from './shared.module.css';
export function GroupCard({ group, onSelect }: { group: PhotoGroup; onSelect: () => void }) {
  return <button className={styles.groupCard} onClick={onSelect} aria-label={`查看完整照片组：${group.name}，${group.photoIds.length}张`}>
    <PhotoStack label="照片组占位" compact /><div className={styles.cardText}><span className={styles.eyebrow}>{categoryLabels[group.category]} · {group.photoIds.length} 张</span><h2>{group.name}</h2><span className={styles.muted}>{group.description}</span></div><HandDrawnIcon name="arrow" width="18" height="18" />
  </button>;
}
