import {editorialGroup,stickersForPhotos} from '../../data/editorial';
import {EditorialArtwork} from '../editorial/EditorialArtwork';
import {PublishPhoto} from '../editorial/PublishPhoto';
import {SafeImage} from '../mobile/SafeImage';
import type {Artwork,Edition} from '../../domain/types';
import {photoById} from '../../data/mock';
import {TravelElement} from '../printing/TravelElement';
import {StickerSheet} from './StickerSheet';
import {SceneIllustration} from './SceneIllustration';
import styles from './gallery.module.css';
export function ArtworkContent({art,edition,exportable=false}:{art:Artwork;edition:Edition;exportable?:boolean}){
 if(art.kind==='carousel')return <div style={{aspectRatio:'3 / 4'}} data-testid={`art-content-${art.id}`}><PublishPhoto photo={photoById(edition.photoIds[(art.slideIndex??0)%edition.photoIds.length])} index={art.slideIndex??0} total={edition.photoIds.length} layout={edition.layout}/></div>;
 if(editorialGroup(edition.groupId)&&art.kind!=='caption')return <EditorialArtwork art={art} edition={edition} exportable={exportable}/>;
 const photo=photoById(edition.photoIds[(art.slideIndex??0)%edition.photoIds.length]);
 if(photo.tripId.startsWith('local-'))return <div className={styles.artPaper} data-kind={art.kind} data-layout={edition.layout} data-testid={`art-content-${art.id}`}>
  <div className={styles.coverHead}><small>MY TRAVEL NOTES</small><strong>{edition.title}</strong><span>{art.kind==='caption'?'A NOTE TO KEEP':'KEEP THE LITTLE MOMENTS'}</span></div>
  {art.kind==='caption'?<p className={styles.localCaption}>{edition.caption}</p>:<div className={styles.localComposition} data-collage={art.kind==='collage'}>{(art.kind==='collage'?edition.photoIds.slice(0,3):[photo.id]).map(id=><SafeImage key={id} src={photoById(id).src} alt={photoById(id).label}/>)}</div>}
  <div className={styles.printFooter}><b>旅印所</b><span>YOUR PHOTOS · YOUR MEMORIES</span></div>
 </div>;
 const pair=<><div className={styles.realPhoto}><SafeImage loading={art.kind==='cover'?'eager':'lazy'} src={photo.src} alt={photo.label} draggable={false}/><span>01 / PHOTO</span></div><div className={styles.drawnPhoto}><SceneIllustration source={photo.src}/><span>02 / DRAWING</span></div><div className={styles.sideStickers}><TravelElement kind="lantern" decorative/><TravelElement kind="sign" decorative/><TravelElement kind="ticket" decorative/></div></>;
 return <div className={styles.artPaper} data-kind={art.kind} data-layout={edition.layout} data-testid={`art-content-${art.id}`}>
  {art.kind==='cover'&&<><div className={styles.coverHead}><small>OSAKA WALKING NOTES</small><strong>{edition.title}</strong><span>APRIL 12—16, 2026</span></div><div className={styles.pairComposition}>{pair}</div><div className={styles.printFooter}><b>旅印所</b><span>COLLECT THE LITTLE RED THINGS.</span></div></>}
  {art.kind==='collage'&&<><div className={styles.posterHeading}><small>A SMALL COLLECTION OF RED</small><strong>{edition.title}</strong><p>同一个街角，两种记录。</p></div><div className={styles.pairComposition}>{pair}<span className={styles.correspondence}>实拍 ↓ 街景插画</span></div><div className={styles.posterBottom}><TravelElement kind="umbrella" decorative/><TravelElement kind="drink" decorative/><TravelElement kind="shirt" decorative/><TravelElement kind="road" decorative/><span>OSAKA<br/>12—16 APR.</span></div></>}
  {art.kind==='stickers'&&<><div className={styles.stickerHeading}><span>PEEL & KEEP</span><strong>沿路捡到的红色</strong><small>8 LITTLE SOUVENIRS</small></div><StickerSheet exportable={exportable}/><div className={styles.stickerFooter}>招牌、衣角和笑脸，都值得收藏。<br/><small>TRIP PRESS · OSAKA 2026</small></div></>}
  {art.kind==='caption'&&<><div className={styles.typewriterStamp}>TRIP PRESS / A NOTE FOR YOU</div><span className={styles.quoteMark}>“</span><p className={styles.captionWords}>{edition.caption}</p><div className={styles.captionSignature}>{edition.title}<br/><small>APRIL, 2026</small></div></>}
 </div>;
}
