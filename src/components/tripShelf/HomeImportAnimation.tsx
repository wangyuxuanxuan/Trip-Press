import {useEffect} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import type {Photo} from '../../domain/types';
import {SafeImage} from '../mobile/SafeImage';
import styles from './homeImport.module.css';
const stages=['照片已放上桌面','把瞬间轻轻铺开','按导入顺序收拢','一叠叠记忆，整理好了','准备打开照片工作桌'];
export function HomeImportAnimation({photos,step,onAdvance,onComplete,onCancel}:{photos:Photo[];step:number;onAdvance:()=>void;onComplete:()=>void;onCancel:()=>void}){
 const reduced=useReducedMotion();
 useEffect(()=>{const timer=setTimeout(step<4?onAdvance:onComplete,800);return()=>clearTimeout(timer);},[step,onAdvance,onComplete]);
 return <div className={styles.animation} data-testid="home-import-animation">
  <div className={styles.table} aria-hidden="true">{photos.slice(0,9).map((photo,index)=>{
   const spread=step<2;return <motion.div key={photo.id} className={styles.photo} initial={{opacity:0,y:reduced?0:-90}} animate={{opacity:1,x:reduced?0:spread?(index%3-1)*88:(index%3-1)*72,y:reduced?0:spread?Math.floor(index/3)*48-35:Math.floor(index/3)*5+30,rotate:reduced?0:spread?(index%2?12:-9):index%3-1}} transition={{duration:reduced?.15:.6,delay:index*.025}}><SafeImage src={photo.src} alt=""/></motion.div>;
  })}</div>
  <div className={styles.status} role="status"><strong>{stages[step]}</strong><small>{photos.length} 张照片 · 保留在本次浏览中</small></div>
  <button onClick={onCancel}>取消整理</button>
 </div>;
}
