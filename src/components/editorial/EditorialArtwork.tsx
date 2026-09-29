import type {Artwork,Edition} from '../../domain/types';
import {photoById} from '../../data/mock';
import {editorialGroup,stickersForPhoto,stickersForPhotos,stickersForCover} from '../../data/editorial';
import {SafeImage} from '../mobile/SafeImage';
import {StickerArt,StickerCover,ArtStickerSheet} from './StickerArt';
import styles from './editorial.module.css';
import {PublishPhoto} from './PublishPhoto';
export function EditorialArtwork({art,edition,exportable=false}:{art:Artwork;edition:Edition;exportable?:boolean}){
 const photo=photoById(edition.photoIds[(art.slideIndex??0)%edition.photoIds.length]);
 const stickers=stickersForPhotos(edition.photoIds),matching=stickersForPhoto(photo.id);
 const overlay=matching.find(s=>s.kind==='object')??matching[0];
 if(art.kind==='carousel')return <div className={styles.coverHolder} data-testid={`art-content-${art.id}`}><PublishPhoto photo={photo} index={art.slideIndex??0} total={edition.photoIds.length} layout={edition.layout}/></div>;
 if(art.kind==='cover'&&stickers.length)return <div className={styles.coverHolder} data-testid={`art-content-${art.id}`}><StickerCover stickers={stickersForCover(edition.photoIds,edition.groupId)} title={edition.title} people={editorialGroup(edition.groupId)?.category==='people'} focusFirst={editorialGroup(edition.groupId)?.category==='theme'} eyebrow={photo.location.toUpperCase()}/></div>;
 return <div className={styles.content} data-layout={edition.layout} data-testid={`art-content-${art.id}`} data-composition={art.kind}>
  <header><small>{art.kind==='stickers'?'PEEL · KEEP · CREATE':art.description}</small><h3>{art.kind==='stickers'?'从照片里，带走一点风景':edition.title}</h3></header>
  {art.kind==='cover'&&<div className={styles.photo} data-photo-id={photo.id}><SafeImage src={photo.src} alt={photo.label}/>{overlay&&<svg viewBox="0 0 100 150" style={{left:`${Math.min(82,Math.max(18,overlay.anchor[0]))}%`,top:`${Math.min(80,Math.max(20,overlay.anchor[1]))}%`}} aria-label={`对应元素贴纸：${overlay.title}`}><StickerArt sticker={overlay}/></svg>}</div>}
  {art.kind==='stickers'&&<div className={styles.sheet}><ArtStickerSheet stickers={stickers} exportable={exportable}/></div>}
  {art.kind==='collage'&&<div className={styles.collageArt}><SafeImage src={photo.src} alt={photo.label}/><div>{matching.slice(0,3).map(s=><StickerArt key={s.id} sticker={s}/>)}</div></div>}
  <footer><span>{photo.location}</span><span>{`${stickers.length} 枚旅行贴纸`}</span></footer>
 </div>;
}
