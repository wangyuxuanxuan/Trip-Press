import {useEffect,useRef,useState} from 'react';
import type {ShelfView} from '../state/flow';
import {shelfTrips,type ShelfTrip} from '../data/tripShelf';
import {localTrips,prepareLocalTrip,registerLocalTrip,releaseLocalTrip,type LocalTrip} from '../data/localTrips';
import {HomeImportAnimation} from '../components/tripShelf/HomeImportAnimation';
import {PrinterImport} from '../components/tripShelf/PrinterImport';
import {TravelBookshelf} from '../components/tripShelf/TravelBookshelf';
import {TripPreview} from '../components/tripShelf/TripPreview';
import layout from '../components/tripShelf/shelfLayout.module.css';
import styles from '../components/tripShelf/tripShelf.module.css';
import importStyles from '../components/tripShelf/homeImport.module.css';
interface Props {view:ShelfView;step:number;onOpen:(id:string)=>void;onStart:(id:string)=>void;onAdvance:()=>void;onComplete:()=>void;onBack:()=>void;onModalChange:(open:boolean)=>void;}
export function TripShelf({view,step,onOpen,onStart,onAdvance,onComplete,onBack,onModalChange}:Props){
 const [preview,setPreview]=useState<ShelfTrip|null>(null),[preparing,setPreparing]=useState(false),[error,setError]=useState('');
 const input=useRef<HTMLInputElement>(null),pending=useRef<LocalTrip|null>(null),alive=useRef(true),request=useRef(0),abort=useRef<AbortController|null>(null);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;request.current++;abort.current?.abort();if(pending.current)releaseLocalTrip(pending.current);};},[]);
 useEffect(()=>{onModalChange(Boolean(preview)||preparing);return()=>onModalChange(false);},[preview,preparing,onModalChange]);
 const select=async(files:File[])=>{
  if(!files.length)return;setError('');setPreparing(true);const token=++request.current;abort.current?.abort();const controller=new AbortController();abort.current=controller;
  try{const entry=await prepareLocalTrip(files,controller.signal);if(!alive.current||token!==request.current){releaseLocalTrip(entry);return;}pending.current=entry;registerLocalTrip(entry);onStart(entry.trip.id);}
  catch(error){if(alive.current&&token===request.current)setError(error instanceof Error?error.message:'照片未读取成功，请重试。');}
  finally{if(alive.current&&token===request.current)setPreparing(false);}
 };
 const cancel=()=>{request.current++;abort.current?.abort();setPreparing(false);if(pending.current){releaseLocalTrip(pending.current);pending.current=null;}onBack();};
 const complete=()=>{pending.current=null;onComplete();};
 const busy=preparing||view==='importing';
 return <div className={styles.shelf} data-shelf-view={view}>
  <div className={layout.collection}>
   <div className={layout.intro}><h1 tabIndex={-1} data-scene-heading>把旅行，印成回忆</h1><p>让散落的瞬间，重新鲜活。</p></div>
   <input ref={input} className={importStyles.input} type="file" accept="image/*" multiple aria-label="选择旅行照片" onChange={e=>{const files=Array.from(e.currentTarget.files??[]);e.currentTarget.value='';void select(files);}}/>
   <div className={`${importStyles.hero} ${busy?importStyles.busy:''}`}>
    <PrinterImport disabled={busy} onOpen={()=>{setError('');input.current?.click();}}/>
    {view==='importing'&&pending.current&&<HomeImportAnimation photos={pending.current.photos} step={step} onAdvance={onAdvance} onComplete={complete} onCancel={cancel}/>}
   </div>
   {preparing?<div className={importStyles.notice} role="status">正在读取照片，留在这个桌面就好。<button onClick={cancel}>取消读取</button></div>:!busy&&<p className={layout.printerHint}>点击打印机，放入新的旅行</p>}
   {error&&<p className={`${importStyles.notice} ${importStyles.error}`} role="alert">{error}</p>}
   {!busy&&<><TravelBookshelf trips={[...localTrips().map(entry=>entry.shelf),...shelfTrips]} onPreview={setPreview}/><p className={importStyles.notice}>新导入的照片仅留在本次浏览中，刷新后需重新导入。</p></>}
  </div>
  <TripPreview trip={preview} onClose={()=>setPreview(null)} onOpen={()=>{if(!preview)return;const id=preview.id;setPreview(null);onOpen(id==='osaka'?'osaka-2026':id);}}/>
 </div>;
}
