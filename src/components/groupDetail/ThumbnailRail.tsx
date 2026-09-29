import {SafeImage} from '../mobile/SafeImage';
import {useEffect,useRef,useState} from 'react';
import type {Photo} from '../../domain/types';
import {touchFeedback} from '../mobile/feedback';
import styles from './groupDetail.module.css';
interface Props {photos:Photo[];activeId?:string;onSelect:(index:number)=>void;onReorder:(ids:string[])=>void;}
interface Drag {id:string;x:number;y:number;pointerId:number;scroll:number;mode:'pending'|'scroll'|'reorder';moved:boolean;target:string|null;clientX:number;}
export function ThumbnailRail({photos,activeId,onSelect,onReorder}:Props){
 const rail=useRef<HTMLDivElement>(null),drag=useRef<Drag|null>(null);
 const hold=useRef<ReturnType<typeof setTimeout>|null>(null),edge=useRef<ReturnType<typeof setInterval>|null>(null);
 const [dragId,setDragId]=useState<string|null>(null),[target,setTarget]=useState<string|null>(null);const skipClick=useRef(false);
 const clear=()=>{if(hold.current)clearTimeout(hold.current);if(edge.current)clearInterval(edge.current);hold.current=null;edge.current=null;};
 useEffect(()=>()=>clear(),[]);
 useEffect(()=>{rail.current?.querySelector('[aria-current="true"]')?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});},[activeId]);
 const locate=()=>{const d=drag.current;if(!d||!rail.current)return;const buttons=Array.from(rail.current.querySelectorAll<HTMLElement>('[data-thumb-id]'));if(!buttons.length)return;const nearest=buttons.reduce((a,b)=>Math.abs(b.getBoundingClientRect().x+b.offsetWidth/2-d.clientX)<Math.abs(a.getBoundingClientRect().x+a.offsetWidth/2-d.clientX)?b:a);d.target=nearest.dataset.thumbId!;setTarget(d.target);};
 const begin=()=>{const d=drag.current;if(!d)return;d.mode='reorder';skipClick.current=true;setDragId(d.id);touchFeedback();edge.current=setInterval(()=>{const current=drag.current,el=rail.current;if(!current||!el)return;const box=el.getBoundingClientRect();const amount=current.clientX>box.right-22?7:current.clientX<box.left+22?-7:0;if(amount){el.scrollLeft+=amount;locate();}},32);};
 const reset=()=>{clear();drag.current=null;setDragId(null);setTarget(null);};
 return <div className={styles.thumbRail} ref={rail} aria-label="照片顺序，横滑浏览，长按后拖动排序">
  {photos.map((photo,index)=><button key={photo.id} data-thumb-id={photo.id} className={styles.thumb} data-dragging={dragId===photo.id} data-drop={target===photo.id} aria-current={activeId===photo.id} aria-label={`查看第${index+1}张：${photo.label}`} onContextMenu={e=>e.preventDefault()}
   onPointerDown={e=>{if(!e.isPrimary)return;clear();skipClick.current=false;drag.current={id:photo.id,x:e.clientX,y:e.clientY,clientX:e.clientX,pointerId:e.pointerId,scroll:rail.current!.scrollLeft,mode:'pending',moved:false,target:null};e.currentTarget.setPointerCapture(e.pointerId);if(e.pointerType!=='mouse')hold.current=setTimeout(begin,380);}}
   onPointerMove={e=>{const d=drag.current;if(!d||d.pointerId!==e.pointerId)return;d.clientX=e.clientX;const dx=e.clientX-d.x,dy=e.clientY-d.y;
    if(d.mode==='pending'&&Math.hypot(dx,dy)>9){if(hold.current)clearTimeout(hold.current);if(Math.abs(dy)>Math.abs(dx)){skipClick.current=true;return;}if(e.pointerType==='mouse')begin();else d.mode='scroll';}
    if(d.mode==='scroll'){skipClick.current=true;rail.current!.scrollLeft=d.scroll-dx;}
    else if(d.mode==='reorder'){d.moved=true;locate();}
   }}
   onPointerUp={()=>{const d=drag.current;if(d?.mode==='reorder'&&d.moved&&d.target&&d.id!==d.target){const ids=photos.map(p=>p.id);const from=ids.indexOf(d.id),to=ids.indexOf(d.target);ids.splice(from,1);ids.splice(to,0,d.id);onReorder(ids);}reset();}}
   onPointerCancel={()=>{skipClick.current=true;reset();}} onLostPointerCapture={()=>{if(drag.current)reset();}}
   onClick={()=>{if(skipClick.current){skipClick.current=false;return;}onSelect(index);}}>
    <SafeImage src={photo.src} alt="" draggable={false}/><span>{index+1}</span>
   </button>)}
 </div>;
}