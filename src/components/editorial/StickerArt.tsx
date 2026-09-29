import {useId} from 'react';
import {photoCutouts,sceneryCutout} from './photoCutouts';
import {editorialPhoto,type ArtSticker} from '../../data/editorial';
import styles from './editorial.module.css';
const regions:Record<ArtSticker['atlas'],number[][]>={
 journey:[[0,145,458,475],[465,117,374,541],[847,137,402,518],[0,685,445,468],[449,775,383,380],[833,713,418,442]],
 italy:[[0,85,449,545],[450,211,379,410],[830,95,424,525],[0,673,501,519],[502,624,279,566],[812,640,442,552]],
 photo:[[0,0,300,350]],
 japan:[[87,260,303,350],[520,270,247,340],[918,270,220,337],[90,698,279,340],[488,755,297,285],[886,747,277,280]],
 landscape:[[86,246,312,348],[501,291,276,294],[894,231,255,375],[85,684,333,369],[503,710,280,329],[889,701,285,353]],
 terrain:[[0,242,445,375],[446,244,411,375],[858,150,396,480],[0,677,440,474],[441,691,412,461],[854,710,400,445]],
 coast:[[39,188,451,448],[491,108,337,530],[831,257,398,378],[36,702,474,484],[511,722,307,465],[896,674,331,506]],
 train:[[80,240,333,359],[481,274,319,326],[941,228,171,381],[86,733,362,362],[470,784,337,317],[926,732,223,386]],
};
export const stickerRegion=(s:ArtSticker)=>s.medium==='photo'&&photoCutouts[s.photoId]?photoCutouts[s.photoId].viewBox:regions[s.atlas][s.cell].join(' ');
export function StickerInk({sticker}:{sticker:ArtSticker}){
 const id=useId();const [x,y,width,height]=regions[sticker.atlas][sticker.cell];
 if(sticker.medium==='photo'){
  const cutout=photoCutouts[sticker.photoId],path=cutout?.path??sceneryCutout;
  const border=cutout?Math.min(...cutout.viewBox.split(' ').slice(2).map(Number))*.055:12;
  return <g data-photo-cutout={cutout?'subject':'scenery'}><defs><clipPath id={id}><path d={path}/></clipPath></defs><path d={path} fill="#fff" stroke="#fff" strokeWidth={border} strokeLinejoin="round"/><image href={editorialPhoto(sticker.photoId)?.src} x="0" y="0" width={cutout?1200:300} height={cutout?800:350} preserveAspectRatio={cutout?'none':'xMidYMid slice'} clipPath={`url(#${id})`}/></g>;
 } return <><defs><clipPath id={id}><rect x={x} y={y} width={width} height={height}/></clipPath></defs><image href={`./assets/stickers/${sticker.atlas}-v2.png`} width="1254" height="1254" clipPath={`url(#${id})`}/></>;
}
export function StickerArt({sticker,className}: {sticker:ArtSticker;className?:string}){
 return <svg className={className} viewBox={stickerRegion(sticker)} role="img" aria-label={sticker.title} data-sticker-id={sticker.id} data-source-photo={sticker.photoId} style={{overflow:'hidden'}}><StickerInk sticker={sticker}/></svg>;
}
export function StickerCover({stickers,title,eyebrow='TRAVEL STUDIES',compact=false,people=false,focusFirst=false}:{stickers:ArtSticker[];title:string;eyebrow?:string;compact?:boolean;people?:boolean;focusFirst?:boolean}){
 const main=focusFirst?stickers[0]:(people?stickers.find(s=>s.medium==='photo'):stickers.find(s=>s.kind==='scene'&&s.medium!=='photo'))??stickers.find(s=>s.kind==='scene')??stickers[0];
 if(!main)return null;
 const rest=stickers.filter(s=>s.id!==main.id);
 const drawn=rest.filter(s=>s.medium!=='photo');
 const seen=new Set([main.photoId]);
 const distinct=drawn.filter(s=>{if(seen.has(s.photoId))return false;seen.add(s.photoId);return true;});
 const others=[...distinct,...drawn.filter(s=>!distinct.includes(s)),...rest.filter(s=>s.medium==='photo')].slice(0,9);
 return <div className={styles.cover} data-compact={compact} data-composition="sticker-cover" data-elements={others.length+1}><header><small>{eyebrow}</small>{!compact&&<h2>{title}</h2>}<span>TRIP PRESS · A LITTLE COLLECTION</span></header><div className={styles.coverArt}><StickerArt sticker={main}/><div data-count={others.length}>{others.map(s=><StickerArt key={s.id} sticker={s}/>)}</div></div><footer><span>{others.length+1} 枚旅行收藏</span><b>旅印所</b></footer></div>;
}
export function ArtStickerSheet({stickers,exportable=false}:{stickers:ArtSticker[];exportable?:boolean}){
 const rows=Math.ceil(stickers.length/3);
 return <svg viewBox={`0 0 300 ${rows*160}`} role="img" aria-label="旅行插画贴纸纸张" data-sticker-export={exportable||undefined}>
  {stickers.map((s,i)=><svg key={s.id} x={i%3*100+5} y={Math.floor(i/3)*160+5} width="90" height="145" viewBox={stickerRegion(s)}><StickerInk sticker={s}/></svg>)}
 </svg>;
}

