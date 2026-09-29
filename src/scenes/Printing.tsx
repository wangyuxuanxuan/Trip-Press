import {editorialGroup} from '../data/editorial';
import { useEffect, useRef } from 'react';
import { printSteps } from '../data/mock';
import type { PhotoGroup } from '../domain/types';
import type { PrintStatus } from '../state/flow';
import { StampButton, HandDrawnIcon } from '../components/mobile';
import { PrintTheatre } from '../components/printing/PrintTheatre';
import styles from '../components/printing/printing.module.css';
export const PRINT_STAGE_MS=950;
export const PRINT_FINISH_MS=350;
interface Props {group:PhotoGroup;step:number;status:PrintStatus;autoEnter:boolean;onAdvance:()=>void;onGallery:()=>void;onFail:()=>void;onRetry:()=>void;onBack:()=>void;}
export function Printing({group,step,status,autoEnter,onAdvance,onGallery,onFail,onRetry,onBack}:Props){
 const stages=editorialGroup(group.id)?['整理选中的照片','取出对应元素贴纸','排好照片与插画','准备配文与发布包']:group.tripId.startsWith('local-')?['整理照片顺序','保留原始照片','制作照片拼贴','准备示例配文']:printSteps;
 const complete=status==='complete',failed=status==='failed';
 const startedAt=useRef<number|null>(null);
 useEffect(()=>{
  if(status==='running'){
   if(step===0||startedAt.current===null)startedAt.current=performance.now();
   const delay=Math.max(0,startedAt.current+(step+1)*PRINT_STAGE_MS-performance.now());
   const timer=window.setTimeout(onAdvance,delay);return()=>clearTimeout(timer);
  }
  if(complete&&autoEnter){
   const delay=startedAt.current===null?PRINT_FINISH_MS:Math.max(0,startedAt.current+printSteps.length*PRINT_STAGE_MS+PRINT_FINISH_MS-performance.now());
   const timer=window.setTimeout(onGallery,delay);return()=>clearTimeout(timer);
  }
  if(failed)startedAt.current=null;
 },[step,status,complete,failed,autoEnter,onAdvance,onGallery]);
 return <div className={styles.printing}>
  <header className={styles.header}><button onClick={onBack} aria-label="← 返回照片组详情"><HandDrawnIcon name="back"/>照片组</button><span>TRIP PRESS / PRINT ROOM</span></header>
  <div className={styles.intro}><h1 tabIndex={-1} data-scene-heading>{failed?'这一版没有印好，再试一次。':complete?'好时光，印好了。':'让旅途，慢慢成形。'}</h1><p>「{group.name}」· 完整照片组</p></div>
  <PrintTheatre key={failed?'failed':status==='running'&&step===0?'start':'press'} group={group} step={step} status={status}/>
  <div className={styles.progressArea}>
   <div className={styles.status} role="status" aria-live="polite"><span>{failed?'照片都还在，重试就好。':complete?'一套旅行作品，准备好了':stages[step]}</span><small>{failed?'TRY AGAIN':complete?'DONE':`0${step+1} / 04`}</small></div>
   <progress className={styles.srOnly} value={step} max={printSteps.length} aria-label="作品生成进度"/>
   <ol className={styles.steps}>{stages.map((label,i)=><li key={label} data-current={!failed&&!complete&&i===step} data-done={step>i} aria-current={!failed&&!complete&&i===step?'step':undefined}><span>{String(i+1).padStart(2,'0')}</span>{label}</li>)}</ol>
  </div>
  <footer className={styles.footer}>
   {failed?<StampButton onClick={onRetry}>重新印刷</StampButton>:complete?<StampButton onClick={onGallery}>查看发布包</StampButton>:<button className={styles.demoButton} onClick={onFail}>演示一次印刷失败</button>}
   <p>{failed?'原组照片与调整均已保留。':complete?(autoEnter?'正在收好这一套发布包…':'这一版已完成，可以再次查看。'):'约 4 秒 · 本地排版演示 · 不上传照片'}</p>
  </footer>
 </div>;
}
