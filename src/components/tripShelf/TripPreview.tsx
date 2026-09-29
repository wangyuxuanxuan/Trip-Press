import {editorialTrip,stickersForTrip} from '../../data/editorial';
import {StickerCover} from '../editorial/StickerArt';
import type {ShelfTrip} from '../../data/tripShelf';
import {MobileSheet,HandDrawnIcon} from '../mobile';
import {SafeImage} from '../mobile/SafeImage';
import {CoverSticker} from '../collage/CoverSticker';
import {albumThemeStyle,SampleLandscape} from './TravelBook';
import styles from './tripPreview.module.css';

export function TripPreview({trip,onClose,onOpen}:{trip:ShelfTrip|null;onClose:()=>void;onOpen:()=>void}){
 return <MobileSheet open={Boolean(trip)} title={trip?.name??'旅行预览'} onClose={onClose} className={styles.previewSheet} style={trip?albumThemeStyle(trip):undefined}>
  {trip&&<div className={styles.content}>
   {stickersForTrip(trip.id).length?<div className={styles.coverPreview}><StickerCover stickers={stickersForTrip(trip.id)} title={trip.name} eyebrow={trip.place}/></div>:<div className={styles.paper}>
    <div className={styles.paperHeading}><strong>{trip.place}</strong><span>{trip.date}</span></div>
    <div className={styles.photos} data-preview-art={trip.art}>
     {trip.art?<SampleLandscape kind={trip.art} contain/>:trip.photos.slice(0,2).map(photo=><SafeImage key={photo.src} src={photo.src} alt={photo.alt} draggable={false}/>)}
    </div>
    {!trip.id.startsWith('local-')&&<CoverSticker motif={trip.motifs[0]} className={styles.sticker}/>}
    <span className={styles.paperLabel}>{trip.art?'ILLUSTRATED MEMORIES':'LITTLE DAYS, WELL KEPT'}</span>
   </div>}
   <p className={styles.note}>{trip.note}。</p>
   <p className={styles.description}>{(trip.id==='osaka'||editorialTrip(trip.id)||trip.id.startsWith('local-'))?(editorialTrip(trip.id)?'一趟旅行，一本相册。实拍样片与对应贴纸已备好，打开后按不同视角查看。日期为演示行程，并非照片拍摄日期。':trip.id==='osaka'?'2026.04.12—2026.04.16 · 83 张照片。打开工作桌，看看这趟旅行里的完整故事。':'本次导入的照片，仅在当前浏览中保留。打开工作桌继续整理。'):`这是一只静态旅行样盒${trip.art?'，封面为插画示例':'，使用本地演示照片'}。完整整理与印刷可从「大阪散步日记」体验。`}</p>
   <button className={styles.action} data-album-action type="button" onClick={(trip.id==='osaka'||editorialTrip(trip.id)||trip.id.startsWith('local-'))?onOpen:onClose}><span>{(trip.id==='osaka'||editorialTrip(trip.id)||trip.id.startsWith('local-'))?'打开相册':'收好这只盒子'}</span><HandDrawnIcon name="arrow"/></button>
   {trip.photos.length>0&&!trip.id.startsWith('local-')&&<details className={styles.credits}><summary>照片来源与说明</summary><p>摄影样片与原始来源如下；贴纸为基于照片制作的预制插画。</p>{trip.photos.map(photo=><a key={photo.src} href={photo.source} target="_blank" rel="noreferrer">{photo.alt} · {photo.author}</a>)}<a href="./assets/editorial/attribution.html" target="_blank" rel="noreferrer">全部风景素材与许可</a></details>}
  </div>}
 </MobileSheet>;
}
