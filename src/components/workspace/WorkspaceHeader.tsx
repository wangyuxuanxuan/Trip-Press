import { trip as defaultTrip } from '../../data/mock';
import { HandDrawnIcon } from '../mobile';
import type {GroupCategory} from '../../domain/types';
import {ViewSwitcher} from './ViewSwitcher';
import styles from './workspace.module.css';
export function WorkspaceHeader({ onBack, onGallery, mode,onModeChange,trip=defaultTrip }: { onBack: () => void; onGallery: () => void; trip?:typeof defaultTrip;mode:GroupCategory;onModeChange:(mode:GroupCategory)=>void }) {
  return <header className={styles.header}>
    <div className={styles.headerRow}>
     <button className={styles.backLabel} aria-label="← 返回旅行盒子" onClick={onBack}><HandDrawnIcon name="back" width="16" height="16" /><span>返回</span></button>
     <div className={styles.tripHeading}><strong>{trip.name.replace(/^\d{4}\.\d{2} /,'')}</strong><span>{trip.date} · {trip.photoCount}张</span></div>
     <button className={styles.galleryLabel} onClick={onGallery} aria-label="查看当前旅行贴纸册"><span>贴纸册</span><span aria-hidden="true">›</span></button>
    </div>
    <ViewSwitcher mode={mode} onChange={onModeChange}/>
  </header>;
}
