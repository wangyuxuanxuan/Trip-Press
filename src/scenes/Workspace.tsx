import {SourceBank} from '../components/editorial/SourceBank';
import {editorialTrip,stickersForCover} from '../data/editorial';
import {StickerCover} from '../components/editorial/StickerArt';
import {localTrip} from '../data/localTrips';
import {SafeImage} from '../components/mobile/SafeImage';
import {photoById} from '../data/mock';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { GroupDraft } from '../state/groupEdits';
import { motion, useReducedMotion } from 'framer-motion';
import { groupsForMode, categoryLabels } from '../data/mock';
import type { GroupCategory } from '../domain/types';
import {workspaceViews} from '../data/workspaceViews';
import { DeskPhotoStack } from '../components/workspace/DeskPhotoStack';
import { useRegroup } from '../components/workspace/useRegroup';
import styles from '../components/workspace/workspace.module.css';
export function Workspace({ mode, drafts, onSelect,tripId="osaka-2026" }: { tripId?:string; drafts:Record<string,GroupDraft>; mode: GroupCategory; onSelect: (id: string) => void }) {
  const reduced=Boolean(useReducedMotion());
  const {displayedMode,phase}=useRegroup(mode,reduced);
  const view=workspaceViews.find(view=>view.id===displayedMode)!;
  const lastMode=useRef(mode);
  useEffect(()=>{if(lastMode.current!==mode){document.querySelector('main')?.scrollTo({top:0,behavior:'instant'});lastMode.current=mode;}},[mode]);
  const visibleGroups=groupsForMode(displayedMode,tripId).map(group=>drafts[group.id]?{...group,name:drafts[group.id].name,photoIds:drafts[group.id].photoIds}:group);
  const [opening,setOpening]=useState<{id:string;recipe:string;wide:boolean;rect:DOMRect;target:DOMRect}|null>(null);
  const openingRef=useRef(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    // A new view supersedes an in-flight selection, including its delayed dispatch.
    openingRef.current=false;setOpening(null);
    return()=>{if(timer.current)clearTimeout(timer.current);};
  },[mode]);
  const select=(id:string)=>{
    if(openingRef.current)return;openingRef.current=true;
    const button=document.querySelector<HTMLElement>(`[data-group-id="${id}"]`)!;
    const rect=button.querySelector('[data-photo-layer]:last-child')!.getBoundingClientRect();
    const target=document.querySelector('[data-testid="mobile-app-shell"]')!.getBoundingClientRect();
    setOpening({id,recipe:id,wide:visibleGroups[0]?.id===id,rect,target});
    timer.current=setTimeout(()=>onSelect(id),reduced?140:380);
  };
  return <div className={styles.workspace} data-workspace-mode={mode} data-pile-phase={phase} data-opening={Boolean(opening)}>
    {opening&&createPortal(<motion.div className={styles.openingPile} aria-hidden="true"
      style={{left:opening.rect.left-opening.target.left,top:opening.rect.top-opening.target.top,width:opening.rect.width,height:opening.rect.height}}
      initial={{opacity:1,x:0,y:0,scale:1,rotate:0}}
      animate={{opacity:reduced?0:1,x:reduced?0:opening.target.width/2-(opening.rect.left-opening.target.left)-opening.rect.width/2,y:reduced?0:opening.target.height*.43-(opening.rect.top-opening.target.top)-opening.rect.height/2,scale:reduced?1:1.65,rotate:reduced?0:3}}
      transition={{duration:reduced?.14:.38,ease:'easeInOut'}}>{stickersForCover(visibleGroups.find(g=>g.id===opening.id)!.photoIds,opening.id).length?<StickerCover stickers={stickersForCover(visibleGroups.find(g=>g.id===opening.id)!.photoIds,opening.id)} title={visibleGroups.find(g=>g.id===opening.id)!.name} people={displayedMode==='people'} focusFirst={displayedMode==='theme'} compact/>:<SafeImage src={photoById(visibleGroups.find(g=>g.id===opening.id)!.photoIds[0]).src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</motion.div>,document.querySelector('[data-testid="mobile-app-shell"]')!)}
    <h1 className={styles.srOnly} tabIndex={-1} data-scene-heading>{localTrip(tripId)?.trip.name??editorialTrip(tripId)?.name??'大阪散步日记'} · 照片工作桌</h1>
    <div className={styles.deskIntro}><div><h2>{view.label}</h2><p>{view.description}</p></div><small>{visibleGroups.length}组</small></div>
    {visibleGroups.length===0&&<div className={styles.emptyView} role="status"><span>这一页，先留白</span><h3>{displayedMode==='people'?'还没有适合放进「我们」的照片':'暂时没有适合这个视角的照片组'}</h3><p>{displayedMode==='people'?'风景里的路人，不会被当作同行者。等有了人物与关系明确的照片，再放进来。':'只收有共同线索的照片，不为了凑齐分组而重复归类。'}</p><p>可以切换上方视角，或查看下方保留的全部样片。</p></div>}
    <div className={styles.desk} data-testid="photo-desk">
      <div className={styles.piles} aria-busy={phase!=='settled'}>
        {visibleGroups.map((group,index)=><DeskPhotoStack key={group.id} group={group} index={index} phase={phase} onSelect={()=>select(group.id)} />)}
      </div>
    </div>
    <p className={styles.status} role="status" aria-live="polite">{phase==='settled'?(visibleGroups.length?`${categoryLabels[displayedMode]} · ${visibleGroups.length} 组照片`:'当前视角暂未成组'):'照片正在重新成堆…'}</p>
    <SourceBank tripId={tripId}/>
    <p className={styles.demoNote}>{editorialTrip(tripId)?'摄影样片与预制贴纸演示 · 分组可以重叠，也可以留空；不必包含全部照片。旅程日期为示意。':'按导入顺序暂存为片段；人物、主题与视觉分析尚未接入。'}</p>
    {editorialTrip(tripId)&&<details className={styles.credits}><summary>示例照片署名</summary><a href="./assets/editorial/attribution.html" target="_blank" rel="noreferrer">查看摄影来源与说明</a></details>}
  </div>;
}

