import {allEditorialShelf,artStickers,stickersForTrip,editorialPhoto,type ArtSticker} from '../data/editorial';
import {newCreation,type Creation} from '../state/creations';
import {CreationEditor,CreationCanvas} from '../components/editorial/CreationEditor';
import {StickerArt} from '../components/editorial/StickerArt';
import creatorStyles from '../components/editorial/creator.module.css';
import {useEffect,useRef,useState} from 'react';
import type {Edition} from '../domain/types';
import {shelfTrips} from '../data/tripShelf';
import {localTrips} from '../data/localTrips';
import {photoById} from '../data/mock';
import {CoverSticker,type CoverMotif} from '../components/collage/CoverSticker';
import {TravelElement,travelElements,elementLabels,type TravelElementKind} from '../components/printing/TravelElement';
import {HandDrawnIcon,MobileSheet} from '../components/mobile';
import {SafeImage} from '../components/mobile/SafeImage';
import {exportStickers} from '../components/gallery/exportStickers';
import styles from '../components/collection/collection.module.css';
const motifNames:Record<CoverMotif,string>={sign:'街角招牌',lantern:'红色灯笼',octopus:'章鱼小店',noodles:'热汤面',leaf:'沿途绿叶',shrine:'石灯笼',wave:'一朵浪花',flower:'夏天的花',house:'海边小屋',ticket:'旅行票根',dunes:'沙丘曲线',sun:'明媚阳光',hill:'远处的山'};
interface Item{art?:ArtSticker;key:string;name:string;motif?:CoverMotif;element?:TravelElementKind;source?:string;tripName:string;}
export function StickerCollection({scope,creations,onSaveCreation,editions,onBack,onPackage,onModalChange,onScope}:{creations:Creation[];onSaveCreation:(value:Creation)=>boolean;scope:string;onScope:(value:string)=>void;editions:Edition[];onBack:()=>void;onPackage:(id:string)=>void;onModalChange:(value:boolean)=>void}){
 const [creation,setCreation]=useState<Creation|null>(null);
 const [creationNotice,setCreationNotice]=useState('');
 const filter=scope,setFilter=onScope;
 const [selected,setSelected]=useState<Item|null>(null),[notice,setNotice]=useState(''),[exporting,setExporting]=useState(false);
 const asset=useRef<HTMLDivElement>(null);
 const archived=allEditorialShelf.filter(t=>!shelfTrips.some(s=>s.id===t.id)&&(scope===t.id||creations.some(c=>c.tripId===t.id)||editions.some(e=>photoById(e.photoIds[0])?.tripId===t.id)));
 const trips=[...localTrips().map(entry=>entry.shelf),...shelfTrips,...archived];
 const visible=filter==='all'?trips:trips.filter(trip=>trip.id===filter);
 useEffect(()=>{onModalChange(Boolean(selected||creation));return()=>onModalChange(false);},[selected,creation,onModalChange]);
 const render=(item:Item)=>item.art?<StickerArt sticker={item.art}/>:item.element?<TravelElement kind={item.element}/>:<CoverSticker motif={item.motif!}/>;
 const download=async()=>{const svg=asset.current?.querySelector('svg');if(!svg)return;setExporting(true);try{await exportStickers(svg,`trip-press-${selected?.key}.png`);setNotice('透明 PNG 已生成，下载已开始。');}catch{setNotice('导出未成功，请再试一次。');}finally{setExporting(false);}};
 return <div className={styles.collection}>
  <header className={styles.header}><button onClick={onBack} aria-label="返回上一页"><HandDrawnIcon name="back"/>返回</button><span>TRIP PRESS / COLLECTION</span></header>
  <div className={styles.intro}><span>沿途的小收藏</span><h1 tabIndex={-1} data-scene-heading>旅行贴纸册</h1><p>把一片风景，收进下一页回忆。</p></div>
  <div className={styles.filters} role="group" aria-label="贴纸所属旅行"><button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>全部旅行</button>{trips.map(trip=><button key={trip.id} aria-pressed={filter===trip.id} onClick={()=>setFilter(trip.id)}>{trip.name}</button>)}</div>
  <p className={styles.explainer}>贴纸按旅行收好；发帖用的图片与配文留在各自的发布包里。</p>
  {visible.map(trip=>{
   const tripId=trip.id==='osaka'?'osaka-2026':trip.id;
   const packages=editions.filter(edition=>photoById(edition.photoIds[0])?.tripId===tripId);
   const local=trip.id.startsWith('local-');
   const assets=stickersForTrip(trip.id);
   const saved=creations.filter(c=>c.tripId===tripId);
   const items:Item[]=assets.length?assets.map(art=>({key:art.id,name:art.title,art,source:editorialPhoto(art.photoId)?.src,tripName:trip.name})):local?[]:trip.id==='osaka'?travelElements.map(kind=>({key:`osaka-${kind}`,name:elementLabels[kind],element:kind,source:kind==='person'?'./assets/photos/companion.jpg':trip.photos[0]?.src,tripName:trip.name})):trip.motifs.map(motif=>({key:`${trip.id}-${motif}`,name:motifNames[motif],motif,source:trip.photos[0]?.src,tripName:trip.name}));
   return <section key={trip.id} className={styles.chapter} style={{'--chapter-color':trip.theme.primary,'--chapter-paper':trip.theme.paper} as React.CSSProperties}>
    <div className={styles.chapterTitle}><div><small>{trip.place} / {trip.date}</small><h2>{trip.name}</h2></div><span>{items.length} 枚</span></div>
    {items.length?<div className={styles.stickerPage}>{items.map((item,index)=><button key={item.key} className={styles.sticker} style={{'--tilt':`${index%2?6:-5}deg`} as React.CSSProperties} onClick={()=>{setNotice('');setSelected(item);}} aria-label={`查看贴纸：${item.name}`}>{render(item)}<span>{item.name}</span></button>)}</div>:<div className={styles.empty}><HandDrawnIcon name="photo"/><h3>这趟旅行，留待收集。</h3><p>照片已经收好。接入元素提取后，这里会出现属于这趟旅行的贴纸。</p></div>}
    <p className={styles.sourceNote}>{assets.length?'对应摄影样片 · 插画贴纸与真实摄影纸片':local?'照片保留原样，尚未生成元素贴纸。':'主题设计示例 · 非自动识别结果'}</p>
    {assets.length>0&&<button className={creatorStyles.createButton} onClick={()=>setCreation(newCreation(tripId))}>用这些贴纸创作</button>}
    {saved.length>0&&<div><h3>我的创作</h3><div className={creatorStyles.saved}>{saved.map(draft=><button key={draft.id} onClick={()=>setCreation(draft)} aria-label={'继续编辑：'+draft.title}><CreationCanvas draft={draft}/><span>{draft.title} · 继续编辑</span></button>)}</div></div>}
    {packages.length>0&&<div className={styles.packages}><h3>这趟旅行的发布包</h3>{packages.map((edition,index)=><button key={edition.id} onClick={()=>onPackage(edition.id)}><span><small>第 {index+1} 版</small>{edition.title}</span><HandDrawnIcon name="arrow"/></button>)}</div>}
   </section>;
  })}
  <footer className={styles.footnote}>创作草稿保存在此浏览器 · 贴纸提取服务尚未接入</footer>
  <p className={creatorStyles.note} role="status">{creationNotice}</p>
  <MobileSheet open={Boolean(creation)} title="用贴纸创作" onClose={()=>setCreation(null)}>{creation&&<CreationEditor key={creation.id} initial={creation} onSave={draft=>{const persisted=onSaveCreation(draft);setCreationNotice(persisted?'创作已保存，可继续编辑。':'创作已留在当前浏览中；浏览器未允许持久保存。');setCreation(null);}} onClose={()=>setCreation(null)}/>}</MobileSheet>
  <MobileSheet open={Boolean(selected)} title={selected?.name??'贴纸详情'} onClose={()=>setSelected(null)}>
   {selected&&<div className={styles.detail}><div ref={asset} className={styles.largeSticker}>{render(selected)}</div><p>{selected.tripName}</p>{selected.source&&<div className={styles.sourcePhoto}><SafeImage src={selected.source} alt={`${selected.tripName}主题参考照片`}/><span>{selected.art?(selected.art.medium==='photo'?'来源照片 · 保留原始人物与场景':'这枚贴纸的来源照片 · 插画化演绎'):selected.element==='person'?'原始摄影素材，保留真实面孔':'旅行主题参考 · 贴纸为手绘示例'}</span></div>}{selected.art&&<button onClick={()=>{setCreation({...newCreation(selected.art!.tripId),mainId:selected.art!.id,photoId:selected.art!.photoId});setSelected(null);}}>用这枚贴纸创作</button>}<button disabled={exporting} onClick={()=>void download()}>{exporting?'正在导出…':'导出这枚透明贴纸 PNG'}</button><p role="status">{notice}</p></div>}
  </MobileSheet>
 </div>;
}
