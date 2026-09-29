import {SafeImage} from '../mobile/SafeImage';
import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { Photo } from '../../domain/types';
import styles from './groupDetail.module.css';
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
export function PhotoZoom({photo}:{photo:Photo}){
 const [view,setView]=useState({scale:1,x:0,y:0});
 const viewRef=useRef(view);
 const points=useRef(new Map<number,{x:number;y:number}>());
 const origin=useRef<{distance:number;scale:number;x:number;y:number;centerX:number;centerY:number}|null>(null);
 const canvas=useRef<HTMLDivElement>(null);
 const update=(scale:number,x=0,y=0)=>{const rect=canvas.current!.getBoundingClientRect();scale=clamp(scale,1,4);const next={scale,x:clamp(x,-rect.width*(scale-1)/2,rect.width*(scale-1)/2),y:clamp(y,-rect.height*(scale-1)/2,rect.height*(scale-1)/2)};viewRef.current=next;setView(next);};
 const baseline=()=>{const ps=[...points.current.values()];if(!ps.length){origin.current=null;return;}const a=ps[0],b=ps[1]??a;origin.current={distance:Math.hypot(b.x-a.x,b.y-a.y),scale:viewRef.current.scale,x:viewRef.current.x,y:viewRef.current.y,centerX:(a.x+b.x)/2,centerY:(a.y+b.y)/2};};
 const end=(e:PointerEvent)=>{points.current.delete(e.pointerId);baseline();};
 return <div className={styles.zoom}>
  <p>双指缩放，单指移动。也可以使用下方按钮。</p>
  <div ref={canvas} className={styles.zoomCanvas} data-testid="zoom-canvas" data-scale={view.scale.toFixed(2)}
   onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);points.current.set(e.pointerId,{x:e.clientX,y:e.clientY});baseline();}}
   onPointerMove={e=>{if(!points.current.has(e.pointerId)||!origin.current)return;points.current.set(e.pointerId,{x:e.clientX,y:e.clientY});const [a,b=a]=[...points.current.values()];const o=origin.current;update(o.distance>0?o.scale*Math.hypot(b.x-a.x,b.y-a.y)/o.distance:o.scale,o.x+(a.x+b.x)/2-o.centerX,o.y+(a.y+b.y)/2-o.centerY);}}
   onPointerUp={end} onPointerCancel={end} onContextMenu={e=>e.preventDefault()}>
   <SafeImage src={photo.src} alt={photo.label} draggable={false} style={{transform:`translate(${view.x}px,${view.y}px) scale(${view.scale})`}}/>
  </div>
  <div className={styles.zoomControls}><button aria-label="缩小照片" disabled={view.scale<=1} onClick={()=>update(view.scale-.5)}>−</button><output>{Math.round(view.scale*100)}%</output><button aria-label="放大照片细节" disabled={view.scale>=4} onClick={()=>update(view.scale+.5)}>＋</button><button onClick={()=>update(1)}>重置</button></div>
  <p className={styles.hint}>关闭后回到当前照片，整组顺序保持不变。</p>
 </div>;
}
