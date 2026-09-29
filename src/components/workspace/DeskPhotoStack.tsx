import {stickersForCover} from '../../data/editorial';
import {StickerCover} from '../editorial/StickerArt';
import {SafeImage} from '../mobile/SafeImage';
import {motion,useReducedMotion} from 'framer-motion';
import type {PhotoGroup} from '../../domain/types';
import type {PilePhase} from './useRegroup';
import {photoById} from '../../data/mock';
import styles from './workspace.module.css';
const tilts=[-4,-2,1,0];
export function DeskPhotoStack({group,index,phase,onSelect}:{group:PhotoGroup;index:number;phase:PilePhase;onSelect:()=>void}){
 const reduced=useReducedMotion(),spread=phase==='scatter';
 return <div className={styles.pileSlot} data-slot={index}>
  <button className={styles.stackButton} disabled={phase!=='settled'} onClick={onSelect} aria-label={`查看完整照片组：${group.name}，${group.photoIds.length}张`} data-group-id={group.id} data-back-gesture="allow">
   <span className={styles.photoPile} aria-hidden="true">
    {[0,1,2,3].map(layer=><motion.span className={styles.photoSheet} data-photo-layer key={layer}
     initial={phase==='gather'?{opacity:0,x:reduced?0:(layer-1.5)*20,y:reduced?0:(layer%2?16:-16),rotate:reduced?0:tilts[layer]*2}:false}
     animate={{x:reduced?0:spread?(layer-1.5)*20:0,y:reduced?0:spread?(layer%2?16:-16):0,rotate:reduced?0:spread?tilts[layer]*2:tilts[layer],opacity:spread?0:1}}
     transition={{duration:reduced?.13:spread?.23:.38,delay:reduced?0:layer*.015,ease:'easeOut'}}>
     {layer===3&&(stickersForCover(group.photoIds,group.id).length?<StickerCover stickers={stickersForCover(group.photoIds,group.id)} title={group.name} compact people={group.category==='people'} focusFirst={group.category==='theme'}/>:<SafeImage src={group.cover??photoById(group.photoIds[0]).src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>)}
    </motion.span>)}
   </span>
   <span className={styles.groupMeta}><span className={styles.groupName}>{group.name}</span><span className={styles.countLabel}>{group.photoIds.length}张</span></span>
   <span className={styles.groupDescription}>{group.description}</span>
  </button>
 </div>;
}

