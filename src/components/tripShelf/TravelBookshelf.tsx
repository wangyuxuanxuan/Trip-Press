import {useEffect,useRef,useState} from 'react';
import {useReducedMotion} from 'framer-motion';
import type {ShelfTrip} from '../../data/tripShelf';
import {TravelBook} from './TravelBook';
import styles from './shelfLayout.module.css';

export function TravelBookshelf({trips,onPreview}:{trips:ShelfTrip[];onPreview:(trip:ShelfTrip)=>void}){
 const shelf=useRef<HTMLDivElement>(null),reduce=useReducedMotion();
 const [edges,setEdges]=useState({start:true,end:false});
 const measure=()=>{const el=shelf.current;if(!el)return;const start=el.scrollLeft<2,end=el.scrollLeft+el.clientWidth>=el.scrollWidth-2;setEdges(previous=>previous.start===start&&previous.end===end?previous:{start,end});};
 useEffect(()=>{measure();const observer=new ResizeObserver(measure);if(shelf.current)observer.observe(shelf.current);return()=>observer.disconnect();},[trips.length]);
 const scroll=(direction:number)=>{const el=shelf.current;if(el)el.scrollBy({left:direction*el.clientWidth*.85,behavior:reduce?'instant':'smooth'});};
 return <>
  <div className={styles.collectionLabel}><h2>我的旅行</h2><span>{trips.length} 本</span></div>
  <div ref={shelf} role="region" aria-label="旅行相册书架" className={styles.books} onScroll={measure} tabIndex={0} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();scroll(event.key==='ArrowRight'?1:-1);}}}>
   {trips.map(trip=><TravelBook key={trip.id} trip={trip} onOpen={()=>onPreview(trip)}/>)}
  </div>
  <div className={styles.shelfControls}><span>左右滑动，翻阅更多旅行</span><div><button aria-label="向左浏览相册" disabled={edges.start} onClick={()=>scroll(-1)}>‹</button><button aria-label="向右浏览相册" disabled={edges.end} onClick={()=>scroll(1)}>›</button></div></div>
 </>;
}
