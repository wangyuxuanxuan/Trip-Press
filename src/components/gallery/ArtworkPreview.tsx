import {useLayoutEffect,useRef,useState} from 'react';
import {motion,useAnimationControls,useReducedMotion} from 'framer-motion';
import type {Artwork,Edition,EditionLayout} from '../../domain/types';
import {HandDrawnIcon} from '../mobile';
import {layoutLabels} from '../../data/gallery';
import {ArtworkContent} from './ArtworkContent';
import styles from './gallery.module.css';
interface Props {notice:string;art:Artwork;edition:Edition;origin:DOMRect;onClose:()=>void;onLayout:(layout:EditionLayout)=>void;onSave:()=>void;onShare:()=>void;onExport:()=>Promise<void>;}
export function ArtworkPreview({notice,art,edition,origin,onClose,onLayout,onSave,onShare,onExport}:Props){
 const dialog=useRef<HTMLDialogElement>(null),paper=useRef<HTMLDivElement>(null),closing=useRef(false);
 const controls=useAnimationControls(),reduce=Boolean(useReducedMotion());const [exporting,setExporting]=useState(false);
 const transform=useRef({x:0,y:0,scale:1});
 useLayoutEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;const scroller=document.querySelector('main')!;const scroll=scroller.scrollTop;
  dialog.current!.showModal();const target=paper.current!.getBoundingClientRect();
  transform.current={x:origin.x+origin.width/2-target.x-target.width/2,y:origin.y+origin.height/2-target.y-target.height/2,scale:origin.width/target.width};
  controls.set({opacity:0,...(reduce?{x:0,y:0,scale:1}:transform.current)});
  void controls.start({opacity:1,x:0,y:0,scale:1,transition:{duration:reduce?.15:.3,ease:'easeOut'}});
  return()=>{dialog.current?.close();scroller.scrollTop=scroll;previous?.focus({preventScroll:true});};
 },[controls,reduce,origin]);
 const close=async()=>{
  if(closing.current)return;closing.current=true;
  await controls.start({opacity:0,...(reduce?{x:0,y:0,scale:1}:transform.current),transition:{duration:reduce?.12:.24,ease:'easeInOut'}});
  onClose();
 };
 return <dialog ref={dialog} className={styles.preview} aria-labelledby="artwork-preview-title" onCancel={e=>{e.preventDefault();void close();}} onClick={e=>{if(e.target===e.currentTarget)void close();}}>
  <header className={styles.previewHeader}><div><small>FROM THE WALL</small><h2 id="artwork-preview-title">{art.title}</h2></div><button onClick={()=>void close()} aria-label="关闭作品预览"><HandDrawnIcon name="close"/></button></header>
  <div className={styles.previewStage}><motion.div ref={paper} className={styles.previewPaper} data-kind={art.kind} initial={{opacity:0}} animate={controls}><ArtworkContent art={art} edition={edition}/></motion.div></div>
  <div className={styles.previewTools}>
   <div className={styles.layouts} role="group" aria-label="作品排版">{Object.entries(layoutLabels).map(([value,label])=><button key={value} aria-pressed={edition.layout===value} onClick={()=>onLayout(value as EditionLayout)}>{label}</button>)}</div>
   <div className={styles.previewActions}><button onClick={onSave}>保存单张</button><button onClick={onShare}>分享此作品</button>{art.kind==='stickers'&&<button className={styles.exportButton} disabled={exporting} onClick={async()=>{setExporting(true);try{await onExport();}finally{setExporting(false);}}}>{exporting?'正在生成 PNG…':'导出透明贴纸 PNG'}</button>}</div>
   <p role="status" aria-live="polite">{notice||'保存与分享为模拟反馈'}</p>
  </div>
 </dialog>;
}
