import type {Photo,EditionLayout} from '../../domain/types';
import {stickersForPhoto} from '../../data/editorial';
import {SafeImage} from '../mobile/SafeImage';
import {StickerArt} from './StickerArt';
import styles from './publishPhoto.module.css';

/** The detail preview and share package deliberately use the same composition. */
export function PublishPhoto({photo,index=0,total=1,layout='journal'}:{photo:Photo;index?:number;total?:number;layout?:EditionLayout}){
 const matching=stickersForPhoto(photo.id);
 const illustrated=matching.filter(s=>s.medium!=='photo');
 const pieces=(illustrated.length?illustrated:matching).slice(0,3);
 const date=photo.takenAt.split('T')[0].split(' ')[0];
 const artwork=<div className={styles.pieces} data-count={pieces.length} aria-label="来自这张照片的贴纸">{pieces.map(s=><StickerArt key={s.id} sticker={s}/>)}</div>;
 if(layout==='journal')return <div className={`${styles.page} ${styles.journal}`} data-layout={layout} data-publish-photo={photo.id} data-composition="photo-and-sticker">
  <header className={styles.journalHeader}><span>旅途随记</span><small>{date} / {String(index+1).padStart(2,'0')}</small></header>
  <div className={styles.journalPhoto}><span className={styles.tape} aria-hidden="true"/><SafeImage src={photo.src} alt={photo.label} draggable={false}/><span className={styles.photoNote}>{photo.label}</span><span className={styles.blueTape} aria-hidden="true"/></div>
  <div className={styles.journalNotes}><div className={styles.memo}><small>记在这一天</small><strong>{photo.location}</strong><span>把这一刻贴进日记里。</span><svg viewBox="0 0 100 14" aria-hidden="true"><path d="M2 8 Q28 2 46 8 T97 5 M9 12 Q46 8 84 11" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>{artwork}</div>
  <footer className={styles.journalFooter}><span className={styles.ticket}>TRAVEL JOURNAL · {String(index+1).padStart(2,'0')} / {total}</span><span>旅印所</span></footer>
 </div>;
 if(layout==='postcard')return <div className={`${styles.page} ${styles.postcard}`} data-layout={layout} data-publish-photo={photo.id} data-composition="photo-and-sticker">
  <header className={styles.postcardHeader}><span>POSTCARD</span><small>寄一张风景</small></header>
  <div className={styles.postcardPhoto}><SafeImage src={photo.src} alt={photo.label} draggable={false}/></div>
  <div className={styles.postcardNote}><div className={styles.letter}><small>来自 · {photo.location}</small><strong>{photo.label}</strong><p>把路上的好风景，<br/>寄给想念的人。</p><span>{date}</span></div><div className={styles.mail}><div className={styles.stamp} aria-label="旅行纪念邮票">{pieces[0]?<StickerArt sticker={pieces[0]}/>:<span>旅</span>}<small>TRIP POST</small></div><span className={styles.postmark} aria-hidden="true">TRIP PRESS<br/>旅途留念</span><div className={styles.address}><span>TO / 收件人</span><i/><i/><i/></div></div></div>
  <footer className={styles.postcardFooter}>TRIP PRESS <span>A VIEW WORTH SENDING</span></footer>
 </div>;
 return <div className={styles.page} data-layout={layout} data-publish-photo={photo.id} data-composition="photo-and-sticker">
  <div className={styles.topline}><span>TRIP PRESS / TRAVEL NOTES</span><span>{String(index+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span></div>
  <div className={styles.picture}><SafeImage src={photo.src} alt={photo.label} draggable={false}/><span className={styles.paperCorner} aria-hidden="true"/></div>
  <div className={styles.annotation}><div className={styles.words}><strong>{photo.label}</strong><span>{photo.location}</span><i aria-hidden="true"/></div>
   {pieces.length>0&&<div className={styles.pieces} data-count={pieces.length} aria-label={illustrated.length?'来自这张照片的贴纸':'保留原片的摄影剪贴'}>{pieces.map(s=><StickerArt key={s.id} sticker={s}/>)}</div>}
  </div>
  <div className={styles.bottomline}><span>A LITTLE PIECE OF THE JOURNEY</span><span>旅印所</span></div>
 </div>;
}
