import {editorialPhotos} from '../../data/editorial';
import {SafeImage} from '../mobile/SafeImage';
import styles from './editorial.module.css';
export function SourceBank({tripId}:{tripId:string}){
 const photos=editorialPhotos.filter(p=>p.tripId===tripId);if(!photos.length)return null;
 return <details className={styles.sourceBank}><summary>摄影样片 · 素材与其他照片</summary><p>这些公开摄影作品组合成虚构行程，日期和分组为人工演示，不代表同一次真实出行。威尼斯蓝裙双人组来自同一摄影系列；其他人物不作身份关联。未采用的照片没有删除，可在照片组「调整本组」中替换使用。</p>{(['recommended','materials','other'] as const).map((kind,i)=>{const selected=photos.filter(p=>p.selection===kind);return selected.length>0&&<section key={kind}><h3>{['推荐照片','备用素材','其他照片'][i]} · {selected.length}</h3><div className={styles.bankPhotos}>{selected.map(p=><figure key={p.id}><SafeImage loading="lazy" src={p.src} alt={p.label}/><figcaption>{p.label}<small>{p.reason}</small><a href={p.source} target="_blank" rel="noreferrer">{p.author} · 来源</a></figcaption></figure>)}</div></section>;})}</details>;
}
