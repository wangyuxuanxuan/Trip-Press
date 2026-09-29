import {SafeImage} from '../mobile/SafeImage';
import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {importStages,importTimings} from '../../data/tripShelf';
import {CompassShell,StampButton,Tape} from '../mobile';
import styles from './tripShelf.module.css';
function OpenSuitcase(){
 return <svg viewBox="0 0 320 240" className={styles.suitcase} role="img" aria-label="打开的旅行箱">
  <path d="M113 40V26q0-12 13-12h56q14 0 14 12v14" fill="none" stroke="#364D43" strokeWidth="10"/>
  <path d="M49 37q-6-15 12-16h198q15 0 13 17l-17 108H62Z" fill="#A9C4AE" stroke="#789780" strokeWidth="3"/>
  <path d="M66 38h188l-14 91H79Z" fill="#EEE8D9"/><path d="m90 45 5 77m113-77-5 77" stroke="#DDB792" strokeWidth="8"/>
  <path d="M111 64h73v45h-73Z" fill="#FDFCF7" transform="rotate(-8 148 86)"/><text x="148" y="88" textAnchor="middle" fill="#52755F" fontSize="12" letterSpacing="2">BON VOYAGE</text>
  <path d="M59 130h202l34 60-28 33H39l-20-31Z" fill="#789780"/><path d="M61 135h196l30 52H30Z" fill="#DDB792"/>
  <path d="M75 141h168l19 33H53Z" fill="#B4A182"/><path d="M72 146h174l10 20H63Z" fill="#EEE8D9"/>
  <path d="M23 186q139 21 271 0l-19 36q-115 17-235 0Z" fill="#A9C4AE"/>
  <path d="M78 196v26m163-27v27" stroke="#EFDEA9" strokeWidth="15"/><path d="M133 208v13h40v-13" stroke="#364D43" strokeWidth="6" fill="none"/>
  <path d="m252 52 28 7-8 39-29-7Z" fill="#A8CCD4" stroke="#FDFCF7" strokeWidth="3"/><path d="m250 79 21-10m-15-8 10 25" stroke="#FDFCF7" strokeWidth="3"/>
 </svg>;
}
const photoNames=['red','street','lantern','ramen','takoyaki','doll','paper-lantern','alley','store'];
const scattered=[[-.35,89,-18],[-.07,142,13],[.26,78,18],[-.24,198,8],[.07,216,-16],[.33,171,20],[-.37,148,-7],[.16,133,-22],[-.02,70,9]];
export function ImportDesk({running,step,onStart,onAdvance,onComplete,onCancel}:{running:boolean;step:number;onStart:()=>void;onAdvance:()=>void;onComplete:()=>void;onCancel:()=>void}){
 const reduce=Boolean(useReducedMotion()),board=useRef<HTMLDivElement>(null);const [width,setWidth]=useState(340);
 useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));if(board.current)observer.observe(board.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{
  if(!running)return;const start=performance.now();let next=0;let timer:ReturnType<typeof setTimeout>;
  const tick=()=>{const elapsed=performance.now()-start;while(next<4&&elapsed>=importTimings[next]){onAdvance();next++;}if(elapsed>=importTimings[4]){onComplete();return;}timer=setTimeout(tick,Math.max(16,importTimings[next]-elapsed));};
  timer=setTimeout(tick,importTimings[0]);return()=>clearTimeout(timer);
 },[running,onAdvance,onComplete]);
 return <div className={styles.importDesk} data-import-state={running?'importing':'empty'} data-import-step={running?step:undefined}>
  <div ref={board} className={styles.deskIllustration} data-reduced-motion={reduce}>
   <OpenSuitcase/><Tape className={styles.looseTape}/><Tape tone="blue" className={styles.blueTape}/>
   {photoNames.map((name,i)=>{
    const pile=i%3,layer=Math.floor(i/3),spread=scattered[i];
    const destination=step<2?{x:spread[0]*width,y:spread[1]-(step===0?48:0),rotate:spread[2]}:step===2?{x:(pile-1)*width*.23+layer*8,y:130+pile%2*30+layer*10,rotate:(layer-1)*12}: {x:(pile-1)*width*.26+layer*3,y:167+pile%2*28-layer*3,rotate:(layer-1)*5};
    const idle={x:(pile-1)*width*.24,y:173+(pile%2)*17,rotate:(pile-1)*14};
    return <motion.div key={`${running?'loaded':'blank'}-${name}`} className={styles.fallingPhoto} data-import-photo={i} initial={running?(reduce?{opacity:0,...idle,rotate:0}:{opacity:0,x:0,y:35,rotate:0}):false}
     animate={reduce?{...idle,opacity:running||i<3?1:0,rotate:0}:running?{...destination,opacity:1}: {...idle,opacity:i<3?1:0}}
     transition={{duration:reduce?.18:.65,delay:reduce?0:i*.025,ease:'easeInOut'}} aria-hidden="true">
      {running?<SafeImage src={`./assets/photos/${name}.jpg`} alt="" draggable={false}/>:<span/>}<i/>
    </motion.div>;
   })}
   {running&&step>=3&&<motion.div className={styles.pileLabels} initial={{opacity:0}} animate={{opacity:1}}><span>街角的红</span><span>一路好味</span><span>偶遇的小事</span></motion.div>}
   {running&&step===4&&<motion.div className={styles.arrivingCompass} initial={reduce?{opacity:0}:{opacity:0,scale:.8,y:10}} animate={{opacity:1,scale:1,y:0}}><CompassShell><b>推荐</b><small>颜色 · 人物 · 主题</small></CompassShell></motion.div>}
  </div>
  <div className={styles.importNote}><Tape/><h1 tabIndex={-1} data-shelf-heading>{running?'好照片，慢慢聚在一起。':'把一趟旅行倒在桌面上。'}</h1><p>{running?'大阪散步日记 · 83 张示例照片':'我们会帮你把照片整理成一叠叠可以发布的内容。'}</p></div>
  {running?<div className={styles.importProgress}><p role="status" aria-live="polite"><span aria-hidden="true">0{step+1} / 05</span>{importStages[step]}</p><button onClick={onCancel}>取消导入</button></div>:<div className={styles.importActions}><StampButton onClick={onStart}>导入旅行照片</StampButton><p>模拟体验 · 使用大阪的 83 张示例照片</p></div>}
 </div>;
}
