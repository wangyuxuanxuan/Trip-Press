import {stickersForTrip} from '../../data/editorial';
import {StickerArt} from '../editorial/StickerArt';
import type {CSSProperties} from 'react';
import type {ShelfTrip} from '../../data/tripShelf';
import {SafeImage} from '../mobile/SafeImage';
import {CoverSticker} from '../collage/CoverSticker';
import styles from './shelfLayout.module.css';

/** Illustrated placeholders for journeys which still have no imported photos. */
export function SampleLandscape({kind,contain=false}:{kind:'qingdao'|'yunnan';contain?:boolean}){
 return <svg viewBox="0 0 160 190" preserveAspectRatio={contain?'xMidYMid meet':'xMidYMid slice'} aria-hidden="true">
  <path fill="#8DDEFA" d="M0 0h160v190H0z"/><path fill="#fff" d="M14 25q5-14 14-6 13-12 18 6H14ZM87 40q7-17 18-6 12-19 24 6H87Z"/>
  {kind==='qingdao'?<><path fill="#26BCE0" d="M0 67h160v123H0z"/><path fill="#C8F4FD" d="m0 113 160-27v5L0 120Z"/><path fill="#71C592" d="m0 127 83-21 77 45v39H0"/><path fill="#FFF2D0" d="M20 117h90v61H20zM47 90h35v39H47z"/><path fill="#FF7963" d="m12 120 48-27 59 27ZM42 95l23-24 23 24Z"/><path fill="#358C9D" d="M36 133h12v17H36zm24 0h12v17H60zm23 0h12v17H83zM58 159h17v31H58z"/><path fill="#E6EFF0" d="M117 54h8v19h-8zm12-9h10v26h-10zm14 7h12v16h-12z"/></>:<><path fill="#93C9DF" d="m0 86 37-34 41 34 29-28 53 29v45H0Z"/><path fill="#5DAD82" d="m0 127 68-38 92 24v77H0Z"/><path fill="#A0D787" d="m0 148 66-20 94 13v49H0Z"/>{[18,43,75,106,138].map((x,i)=><g key={x} transform={`translate(${x} ${151+i%2*17})`}><path d="M0 0v40" stroke="#3E925F" strokeWidth="3"/><path d="M0 4C-28 5-15-22-3-11 4-28 24-16 12-4 34 3 13 20 4 10-10 31-25 11-10 5Z" fill={i%2?'#FFCA7D':'#FF88B2'}/><circle r="5" fill="#FFE879"/></g>)}</>}
 </svg>;
}

export const albumThemeStyle=(trip:ShelfTrip)=>({'--album-primary':trip.theme.primary,'--album-paper':trip.theme.paper,'--album-ink':trip.theme.ink,'--album-on-primary':trip.theme.onPrimary,'--book-color':trip.theme.primary}) as CSSProperties;
export function TravelBook({trip,onOpen}:{trip:ShelfTrip;onOpen:()=>void}){
 return <button className={styles.travelBook} data-trip-box={trip.id} data-kind={trip.kind} aria-label={`预览${trip.name}`} onClick={onOpen} style={albumThemeStyle(trip)}>
  <span className={styles.bookCover} aria-hidden="true">
   <span className={styles.bookSpine}/><span className={styles.bookPlace}>{trip.place}<small>{trip.country}</small></span>
   <span className={styles.bookPhoto}>{stickersForTrip(trip.id).length?<StickerArt sticker={stickersForTrip(trip.id)[0]}/>:trip.art?<SampleLandscape kind={trip.art}/>:<SafeImage src={trip.photos[0].src} alt="" draggable={false} loading="lazy"/>}</span>
   {!trip.id.startsWith('local-')&&(stickersForTrip(trip.id).length?<StickerArt sticker={stickersForTrip(trip.id)[1]} className={styles.bookSticker}/>:<CoverSticker motif={trip.motifs[0]} className={styles.bookSticker}/>)}
   {!trip.id.startsWith('local-')&&(!stickersForTrip(trip.id).length&&<CoverSticker motif={trip.motifs[1]} className={styles.bookStickerSmall}/>)}
  </span>
  <span className={styles.bookTitle}>{trip.name.replace(/^\d{4}\.\d{2} /,'')}</span><span className={styles.bookDate}>{trip.date}</span>
 </button>;
}
