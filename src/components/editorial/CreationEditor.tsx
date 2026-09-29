import {useRef,useState} from 'react';
import type {Creation} from '../../state/creations';
import {updateCreation} from '../../state/creations';
import {artStickers,stickersForTrip,editorialPhoto} from '../../data/editorial';
import {StickerArt,StickerInk,stickerRegion} from './StickerArt';
import {exportStickers} from '../gallery/exportStickers';
import styles from './creator.module.css';
const papers={white:'#ffffff',blue:'#edf8ff',cream:'#fff7e5'};
export function CreationCanvas({draft}:{draft:Creation}){
 const main=artStickers.find(s=>s.id===draft.mainId)!,others=stickersForTrip(draft.tripId).filter(s=>s.id!==main.id).slice(0,2),photo=editorialPhoto(draft.photoId)!;
 const draw=(s:typeof main,x:number,y:number,w:number,h:number)=><svg key={s.id} x={x} y={y} width={w} height={h} viewBox={stickerRegion(s)}><StickerInk sticker={s}/></svg>;
 return <svg viewBox="0 0 360 480" role="img" aria-label={`创作预览：${draft.title}`} data-testid="creation-canvas">
  <rect width="360" height="480" fill={papers[draft.paper]}/><text x="27" y="33" fill="#526c7e" fontSize="8" letterSpacing="2" fontFamily="sans-serif">TRIP PRESS / TRAVEL STUDIES</text>
  <text x="27" y="72" fill="#17394c" fontSize="21" fontWeight="600" fontFamily="sans-serif">{draft.title.slice(0,14)}</text>{draft.title.length>14&&<text x="27" y="100" fill="#17394c" fontSize="21" fontFamily="sans-serif">{draft.title.slice(14)}</text>}
  {draft.template==='photo'&&<image href={photo.src} x="25" y="115" width="310" height="288" preserveAspectRatio="xMidYMid meet"/>}
  {draft.template==='postcard'&&<><rect x="26" y="121" width="308" height="263" rx="2" fill="white" stroke="#d7e5ec"/><path d="M225 140v226M246 325h68M246 347h68" stroke="#d7e5ec" strokeDasharray="3 3"/></>}
  <g transform={`translate(${180+draft.x} ${260+draft.y}) rotate(${draft.rotation}) scale(${draft.scale}) translate(-180 -260)`}>
   {draft.template==='photo'?draw(main,210,286,102,113):draft.template==='postcard'?draw(main,38,148,187,222):draw(main,27,128,228,268)}
   {draft.template==='cover'&&others.map((s,i)=>draw(s,251,160+i*112,84,105))}
  </g>
  <path d="M27 423h306" stroke="#d7e5ec"/><text x="27" y="446" fill="#526c7e" fontSize="9" fontFamily="sans-serif">{photo.location}</text><text x="297" y="446" fill="#17394c" fontSize="10" fontFamily="sans-serif">旅印所</text>
 </svg>;
}
export function CreationEditor({initial,onSave,onClose}:{initial:Creation;onSave:(draft:Creation)=>void;onClose:()=>void}){
 const [draft,setDraft]=useState(initial),[history,setHistory]=useState<Creation[]>([]),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const preview=useRef<HTMLDivElement>(null);
 const change=(patch:Partial<Creation>)=>{const next=updateCreation(draft,patch);if(JSON.stringify(next)===JSON.stringify(draft))return;setHistory(h=>[...h.slice(-29),draft]);setDraft(next);};
 const reset=()=>{setHistory(h=>[...h.slice(-29),draft]);setDraft({...initial,x:0,y:0,scale:1,rotation:0});};
 const download=async()=>{const svg=preview.current?.querySelector('svg');if(!svg)return;setBusy(true);try{await exportStickers(svg,'trip-press-creation.png');setNotice('作品 PNG 已生成。');}catch{setNotice('导出没有完成，请再试一次。');}finally{setBusy(false);}};
 return <div className={styles.editor}>
  <div className={styles.preview} ref={preview}><CreationCanvas draft={draft}/></div>
  <div className={styles.templates} role="group" aria-label="创作模板">{(['cover','photo','postcard'] as const).map((value,i)=><button key={value} aria-pressed={draft.template===value} onClick={()=>change({template:value})}>{['贴纸封面','照片内容页','明信片'][i]}</button>)}</div>
  <label className={styles.title}>作品标题<input value={draft.title} maxLength={24} enterKeyHint="done" onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}} onChange={e=>change({title:e.target.value})}/></label>
  <fieldset className={styles.main}><legend>换一枚主贴纸</legend>{stickersForTrip(draft.tripId).map(s=><button key={s.id} aria-label={`使用${s.title}`} aria-pressed={draft.mainId===s.id} onClick={()=>change({mainId:s.id})}><StickerArt sticker={s}/><span>{s.title}</span></button>)}</fieldset>
  <p className={styles.note}>照片内容页会跟随主贴纸切换到它的来源照片。</p>
  <div className={styles.controls}>{([{key:'scale',label:'大小',step:.1,min:.7,max:1.3},{key:'rotation',label:'旋转',step:5,min:-20,max:20},{key:'x',label:'左右位置',step:5,min:-30,max:30},{key:'y',label:'上下位置',step:5,min:-30,max:30}] as const).map(c=><div key={c.key}><span>{c.label}</span><button aria-label={`减小${c.label}`} disabled={draft[c.key]<=c.min} onClick={()=>change({[c.key]:draft[c.key]-c.step})}>−</button><output>{c.key==='scale'?`${Math.round(draft.scale*100)}%`:draft[c.key]}</output><button aria-label={`增大${c.label}`} disabled={draft[c.key]>=c.max} onClick={()=>change({[c.key]:draft[c.key]+c.step})}>＋</button></div>)}</div>
  <div className={styles.templates} role="group" aria-label="纸张颜色">{(['white','blue','cream'] as const).map((paper,i)=><button key={paper} aria-pressed={draft.paper===paper} onClick={()=>change({paper})}>{['白纸','浅蓝','奶油白'][i]}</button>)}</div>
  <div className={styles.templates}><button disabled={!history.length} onClick={()=>{setDraft(history.at(-1)!);setHistory(h=>h.slice(0,-1));}}>撤销</button><button onClick={reset}>恢复初始排版</button></div>
  <p role="status" className={styles.note}>{notice||'保存后会收进这趟旅行的「我的创作」，随时继续调整。'}</p>
  <div className={styles.actions}><button onClick={onClose}>取消</button><button disabled={busy} onClick={()=>void download()}>{busy?'导出中…':'导出 PNG'}</button><button disabled={!draft.title.trim()} onClick={()=>onSave(draft)}>保存创作</button></div>
 </div>;
}
