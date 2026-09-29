import {SafeImage} from '../mobile/SafeImage';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Photo } from '../../domain/types';
import { HandDrawnIcon, Tape } from '../mobile';
import {PublishPhoto} from '../editorial/PublishPhoto';
import styles from './groupDetail.module.css';
interface Props { content?:ReactNode; photos:Photo[]; index:number; onIndex:(index:number)=>void; onZoom:()=>void; onInfo:()=>void; }
export function PhotoBrowser({photos,index,onIndex,onZoom,onInfo,content}:Props){
 const reduce=useReducedMotion();
 const gesture=useRef<{x:number;y:number;id:number;long:boolean}|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const suppress=useRef(false);
 const clear=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;};
 useEffect(()=>()=>clear(),[]);
 const current=photos[index];
 if(!current)return <div className={styles.empty}><strong>照片暂时都收起来了</strong><p>在“调整本组”中恢复照片，或撤销上一步。</p></div>;
 return <>
  <div className={styles.fan} role="region" aria-roledescription="照片轮播" aria-label="完整照片组浏览" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();onIndex(Math.max(0,index-1));}if(e.key==='ArrowRight'){e.preventDefault();onIndex(Math.min(photos.length-1,index+1));}}}>
   <span className={styles.fanMark} aria-hidden="true">{'TRAVEL'}<br/><b>PHOTO NOTES</b></span>
   {[-2,-1,1,2].filter(offset=>index+offset>=0&&index+offset<photos.length).map((offset)=>{const item=photos[index+offset];return <motion.div key={offset} aria-hidden="true" className={styles.fanBack} initial={{opacity:0,x:0,rotate:0,scale:reduce?1:.85}} animate={{opacity:.9,x:reduce?0:offset*17,y:reduce?0:Math.abs(offset)*7,rotate:reduce?0:offset*7,scale:1}} transition={{duration:reduce?.15:.45,delay:reduce?0:.08}}><SafeImage src={item.src} alt="" draggable={false}/></motion.div>;})}
   <motion.button className={styles.heroPhoto} data-testid="current-photo" aria-label={`放大照片：${current.label}`}
     initial={{opacity:0,scale:reduce?1:.91,rotate:reduce?0:-4}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:reduce?.15:.28}}
     onContextMenu={e=>e.preventDefault()}
     onPointerDown={e=>{
      if(!e.isPrimary)return;
      e.currentTarget.setPointerCapture(e.pointerId);suppress.current=false;
      gesture.current={x:e.clientX,y:e.clientY,id:e.pointerId,long:false};
      clear();timer.current=setTimeout(()=>{if(gesture.current){gesture.current.long=true;suppress.current=true;onInfo();}},520);
     }}
     onPointerMove={e=>{const g=gesture.current;if(g&&Math.hypot(e.clientX-g.x,e.clientY-g.y)>10)clear();}}
     onPointerUp={e=>{clear();const g=gesture.current;gesture.current=null;if(!g||g.id!==e.pointerId)return;if(g.long){suppress.current=true;return;}const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){suppress.current=true;onIndex(Math.max(0,Math.min(photos.length-1,index+(dx<0?1:-1))));}}}
     onPointerCancel={()=>{clear();gesture.current=null;suppress.current=true;}}
     onClick={()=>{if(suppress.current){suppress.current=false;return;}onZoom();}}>
     {content??<PublishPhoto photo={current} index={index} total={photos.length}/>}
   </motion.button>
   <Tape className={styles.heroTape} tone="yellow" />
  </div>
  <div className={styles.browseControls}>
   <button aria-label="上一张照片" disabled={index===0} onClick={()=>onIndex(index-1)}><HandDrawnIcon name="back"/></button>
   <span className={styles.position} role="status" aria-live="polite"><b>{index+1}</b> / {photos.length}</span>
   <button aria-label="下一张照片" disabled={index===photos.length-1} onClick={()=>onIndex(index+1)}><HandDrawnIcon name="arrow"/></button>
   <button className={styles.infoAction} onClick={onInfo}>拍摄信息</button>
  </div>
 </>
}

