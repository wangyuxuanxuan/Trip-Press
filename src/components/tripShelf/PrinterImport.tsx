import {useId} from 'react';
import {TravelPostcardArt} from './TravelPostcardArt';
import styles from './shelfLayout.module.css';

export function PrinterImport({onOpen,disabled=false}:{onOpen:()=>void;disabled?:boolean}){
 const id=useId().replace(/:/g,'');
 const paint=(name:string)=>`url(#${id}-${name})`;
 return <button disabled={disabled} className={styles.printerButton} aria-label="导入旅行照片，开启照片导入" onClick={onOpen}>
  <span className={styles.printerPhotos} aria-hidden="true">
   <span><TravelPostcardArt place="osaka"/></span>
   <span><TravelPostcardArt place="qingdao"/></span>
   <span><TravelPostcardArt place="kyoto"/></span>
  </span>
  <svg className={styles.printerBody} viewBox="0 0 360 180" preserveAspectRatio="none" aria-hidden="true">
   <defs>
    <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#FF997F"/><stop offset=".5" stopColor="#FF8671"/><stop offset="1" stopColor="#FF705C"/></linearGradient>
    <linearGradient id={`${id}-top`} x2="0" y2="1"><stop stopColor="#FFB9A7"/><stop offset="1" stopColor="#FF9C87"/></linearGradient>
    <linearGradient id={`${id}-blue`} x2="0" y2="1"><stop stopColor="#93E4F8"/><stop offset="1" stopColor="#68CFEF"/></linearGradient>
    <linearGradient id={`${id}-slot`} x2="0" y2="1"><stop stopColor="#733F36"/><stop offset=".6" stopColor="#263A40"/><stop offset="1" stopColor="#C65D49"/></linearGradient>
    <linearGradient id={`${id}-lip`} x2="0" y2="1"><stop stopColor="#FFF9F7"/><stop offset="1" stopColor="#FFDBD1"/></linearGradient>
   </defs>
   <rect x="16" y="156" width="329" height="19" rx="6" fill="#425A58" opacity=".55"/>
   <path d="M1 40h358v105q0 23-23 23H24Q1 168 1 145Z" fill={paint('front')} stroke="#EF735D" strokeWidth=".8"/>
   <path d="M1 42h14v110q0 11 8 15Q1 165 1 144Z" fill="#FFAF94" opacity=".45"/>
   <path d="M346 44h13v101q0 18-19 22 7-9 6-22Z" fill="#EA624C" opacity=".22"/>
   <path d="M26 2h308l24 35q6 15-16 16H19Q-1 51 2 38Z" fill={paint('top')} stroke="#FFD5C8" strokeWidth="1"/>
   <path d="M30 4h300l11 20q1 15-15 15H34Q15 38 20 24Z" fill={paint('blue')}/>
   <path d="M4 45q5 8 18 8h316q14 0 19-8" stroke="#FFE3D9" strokeWidth="1.2" fill="none"/>
   <rect x="42" y="112" width="276" height="31" rx="5" fill={paint('slot')} stroke="#CE6552" strokeWidth="2"/>
   <path d="M47 114h266q3 0 3 4v5H44v-5q0-4 3-4" fill={paint('lip')}/>
   <path d="M44 123h272v7H44z" fill="#192E34" opacity=".5"/>
   <circle cx="294" cy="83" r="3.7" fill="#34BF86"/><circle cx="294" cy="82" r="2" fill="#58DBA2"/>
   <circle cx="322" cy="85" r="10" fill="#D88547" opacity=".3"/><circle cx="322" cy="82" r="9.5" fill="#FFDF76" stroke="#FFF0B0" strokeWidth="1.2"/>
   <path d="M316 78q3-5 8-3" stroke="#FFF3BC" strokeWidth="1.1" fill="none"/>
  </svg>
  <span className={styles.printedAction}>
   <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 14H5v23h30V14h-3M20 25V2m-8 9 8-9 8 9" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/><path d="m7 34 8-8 6 5 7-7 5 10" fill="currentColor"/></svg>
   <span>导入旅行照片</span><svg viewBox="0 0 20 26" aria-hidden="true"><path d="m6 4 9 9-9 9" fill="none" stroke="currentColor" strokeWidth="2.2"/></svg>
  </span>
 </button>;
}
