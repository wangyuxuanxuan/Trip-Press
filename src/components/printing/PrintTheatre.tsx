import {editorialGroup,stickersForPhotos} from '../../data/editorial';
import {StickerArt} from '../editorial/StickerArt';
import {SafeImage} from '../mobile/SafeImage';
import { motion, useReducedMotion } from 'framer-motion';
import type { PhotoGroup } from '../../domain/types';
import type { PrintStatus } from '../../state/flow';
import { photoById } from '../../data/mock';
import { TravelElement, travelElements, elementLabels } from './TravelElement';
import { IllustratedPress } from './IllustratedPress';
import styles from './printing.module.css';
export function PrintTheatre({group,step,status}:{group:PhotoGroup;step:number;status:PrintStatus}){
 const reduce=Boolean(useReducedMotion()),failed=status==='failed',complete=status==='complete';
 const curated=Boolean(editorialGroup(group.id)),assets=stickersForPhotos(group.photoIds);
 const local=group.tripId.startsWith('local-');
 const extracting=step===1||step===2;
 return <div className={styles.theatre} data-testid="print-theatre" data-reduced={reduce} data-status={status} data-stage={step}>
  <svg className={styles.deskLines} viewBox="0 0 390 460" preserveAspectRatio="none" aria-hidden="true"><path d="M18 91q120-103 299-19M15 351q144 43 345-3" fill="none" stroke="#DEBF91" strokeWidth="1" strokeDasharray="3 7"/><path d="m331 65 9 11-15 3" fill="none" stroke="#DDB792" strokeWidth="2"/><circle cx="28" cy="285" r="4" fill="#EFDEA9"/><path d="m350 250 11 9m-10 1 9-11" stroke="#A8CCD4" strokeWidth="2"/></svg>
  <span className={styles.marginNote} aria-hidden="true">{curated?'TRAVEL / ILLUSTRATED MEMORIES':local?'MY TRAVEL / PHOTO NOTES':'OSAKA / THE RED EDITION'}</span>
  <motion.div className={styles.inputStack} aria-label={`整组 ${group.photoIds.length} 张照片送入印刷机`} data-testid="print-input"
    initial={false} animate={{opacity:step===0&&!failed?1:0,y:reduce?0:step===0?[-68,-62,27]:27,scale:reduce?1:step===0?[1,1,.62]:.62}}
    transition={{duration:reduce?.2:.92,times:[0,.3,1],ease:'easeInOut'}}>
   {group.photoIds.slice(0,4).map((id,i)=><SafeImage key={id} src={photoById(id).src} alt="" style={{rotate:`${(i-1.5)*5}deg`}}/>)}
   <span>{group.photoIds.length} 张 · 整组入机</span>
  </motion.div>
  <div className={styles.elements} aria-label="旅行元素示例">
   {assets.map((asset,i)=><motion.div key={asset.id} className={styles.element} data-kind={travelElements[i%8]} initial={{opacity:0,y:0}} animate={{opacity:extracting&&!failed?1:0,y:reduce?0:extracting?0:40,rotate:reduce?0:i%2?6:-6}} transition={{duration:reduce?.15:.35,delay:extracting?i*.07:0}}><StickerArt sticker={asset}/><span>{asset.title}</span></motion.div>)}
   {(!local&&!curated?travelElements:[]).map((kind,i)=><motion.div key={kind} className={styles.element} data-kind={kind}
    initial={{opacity:0,x:0,y:0,scale:1}}
    animate={{opacity:extracting&&!failed?1:0,x:reduce?0:extracting?0:(i%2?-35:35),y:reduce?0:extracting?0:65,rotate:reduce?0:(i%2?9:-9),scale:reduce?1:extracting?1:.6}}
    transition={{duration:reduce?.15:.38,delay:extracting?(i%4)*.08:0,ease:'easeOut'}}>
    <TravelElement kind={kind}/><span>{elementLabels[kind]}</span>
   </motion.div>)}
  </div>
  {!local&&!curated&&<motion.div className={styles.personSource} aria-hidden="true" animate={{opacity:step===1&&!failed?.8:0}} transition={{duration:.2}}><SafeImage src="./assets/photos/companion.jpg" alt=""/><span>摄影示例</span></motion.div>}
  <div className={styles.machineZone}>
   <IllustratedPress status={status} step={step}/>
   <div className={styles.outputTray} aria-hidden="true">
    {!failed&&[0,1,2].map(i=><motion.div key={i} className={styles.outputPaper} data-output-paper={i} style={reduce?{top:55-i*22,left:10+i*15}:undefined} initial={{opacity:0,y:reduce?0:-145}}
     animate={{opacity:step>=2?1:0,y:reduce?0:step>=2?(i===0?55:i===1?40:24):-145,x:reduce?0:(i-1)*12,rotate:reduce?0:(i-1)*7}}
     transition={{duration:reduce?.2:.62,delay:step>=2?i*.5:0,ease:'easeOut'}}>
      {curated?<><b>TRAVEL STUDIES</b>{i===1&&assets.length?<div className={styles.miniStickers}>{assets.slice(0,3).map(s=><StickerArt key={s.id} sticker={s}/>)}</div>:<SafeImage src={photoById(group.photoIds[i%group.photoIds.length]).src} alt=""/>}<small>PHOTO + STICKERS</small></>:local?<><b>TRAVEL NOTES</b><SafeImage src={photoById(group.photoIds[i%group.photoIds.length]).src} alt=""/><small>PHOTO / {i+1}</small></>:i===0?<><b>OSAKA</b><SafeImage src={photoById(group.photoIds[0]).src} alt=""/><small>THE RED NOTES</small></>:i===1?<><b>旅途小收藏</b><div className={styles.miniStickers}><TravelElement kind="umbrella" decorative/><TravelElement kind="person" decorative/><TravelElement kind="lantern" decorative/></div><small>STICKER SHEET / 01</small></>:<><b>把大阪印下来</b><div className={styles.paperCollage}><SafeImage src={photoById(group.photoIds[0]).src} alt=""/><TravelElement kind="sign" decorative/></div><small>{step>=3?'在大阪，把脚步放慢一点。':'旅行拼贴 / OSAKA'}</small></>}
     </motion.div>)}
    {failed&&<motion.div className={styles.crumpledPaper} data-testid="failed-paper" initial={{opacity:0,y:reduce?0:-120,rotate:reduce?0:-4}} animate={{opacity:1,y:reduce?0:17,rotate:reduce?0:4}} transition={{duration:reduce?.2:.5}}>
     <svg viewBox="0 0 170 140"><path d="m4 2 58 5 48-5 55 6-3 45 7 34-7 46-48 3-44-4-62 6 5-53Z" fill="#FDFCF7"/><path d="m62 7 9 52-11 34 6 39m44-130-10 65 14 69M8 85l63-26 90 28M4 2l67 57L165 8" stroke="#DCC6A3" fill="none"/><path d="m71 59 43 77-14-69 10-65" fill="#EAD7B4" opacity=".45"/></svg><span>这一版<br/>没有印好。</span>
     </motion.div>}
   </div>
   <div className={styles.slotLip} aria-hidden="true"/>
  </div>
  {complete&&<motion.span className={styles.doneStamp} initial={{opacity:0,scale:reduce?1:1.12}} animate={{opacity:1,scale:1}} transition={{duration:.2}}>印 好 了<br/><small>READY TO KEEP</small></motion.span>}
 </div>;
}
