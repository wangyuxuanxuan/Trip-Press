import {SafeImage} from '../components/mobile/SafeImage';
import { useEffect, useRef, useState } from 'react';
import type { PhotoGroup } from '../domain/types';
import type { GroupDraft, GroupEdit } from '../state/groupEdits';
import { photoById,createEdition } from '../data/mock';
import {ShareComposer} from '../components/gallery/ShareComposer';
import shareStyles from '../components/gallery/shareComposer.module.css';
import {effects,readEffect,saveEffect,type ShareEffect} from '../components/gallery/shareEffects';
import {PublishPhoto} from '../components/editorial/PublishPhoto';
import {ArtStickerSheet} from '../components/editorial/StickerArt';
import {stickersForPhotos} from '../data/editorial';
import { MobileSheet, StampButton, HandDrawnIcon } from '../components/mobile';
import { PhotoBrowser } from '../components/groupDetail/PhotoBrowser';
import { ThumbnailRail } from '../components/groupDetail/ThumbnailRail';
import { PhotoZoom } from '../components/groupDetail/PhotoZoom';
import { GroupAdjustments } from '../components/groupDetail/GroupAdjustments';
import styles from '../components/groupDetail/groupDetail.module.css';
type Sheet='share'|'adjust'|'rename'|'info'|'zoom'|null;
interface Props {activePhotoId?:string;onActivePhoto:(id:string)=>void;group:PhotoGroup;draft?:GroupDraft;onEdit:(edit:GroupEdit)=>void;onUndo:()=>void;onShare:()=>void;onBack:()=>void;onModalChange:(open:boolean)=>void;}
export function GroupDetail({activePhotoId,onActivePhoto,group,draft,onEdit,onUndo,onBack,onModalChange}:Props){
 const activeId=activePhotoId??group.photoIds[0];
 const setActiveId=(id:string|undefined)=>{if(id)onActivePhoto(id);};
 const [effect,setEffect]=useState<ShareEffect>(()=>readEffect(group.id));
 const [stickerIndex,setStickerIndex]=useState(0);
 const stickers=stickersForPhotos(group.photoIds);
 const stickerPages=Math.ceil(stickers.length/6);
 const stickerPage=Math.min(stickerIndex,Math.max(0,stickerPages-1));
 const [sheet,setSheet]=useState<Sheet>(null);
 const [name,setName]=useState(group.name);
 const [message,setMessage]=useState('');
 const input=useRef<HTMLInputElement>(null);
 const photos=group.photoIds.map(photoById);
 const index=Math.max(0,group.photoIds.indexOf(activeId));
 const current=photos[index];
 useEffect(()=>{onModalChange(sheet!==null);return()=>onModalChange(false);},[sheet,onModalChange]);
 useEffect(()=>{if(sheet==='rename')requestAnimationFrame(()=>{input.current?.focus();input.current?.select();});},[sheet]);
 const edit=(action:GroupEdit)=>{
  onEdit(action);
  if(action.type==='remove'){const next=photos[index+1]??photos[index-1];setActiveId(next?.id);}
  if(action.type==='replace')setActiveId(action.candidateId);
  if(action.type==='restore')setActiveId(action.photoId);
  setMessage(({rename:'组名已更新',remove:'照片已收起，可撤销或恢复',replace:'已替换，原照片可恢复',restore:'照片已恢复',reorder:'照片顺序已更新'})[action.type]);
 };
 const undo=()=>{onUndo();setMessage('已撤销上一步');};
 const rename=()=>{setName(group.name);setSheet('rename');};
 const titles={share:'分享这一组',adjust:'调整本组',rename:'修改组名',info:'拍摄信息',zoom:'照片细节'};
 return <div className={styles.detail}>
  <header className={styles.header}><button className={styles.back} aria-label="← 返回照片工作桌" onClick={onBack}><HandDrawnIcon name="back"/><span>工作桌</span></button><h1 tabIndex={-1} data-scene-heading>{group.name}</h1><button className={styles.more} aria-label="更多操作" onClick={()=>setSheet('adjust')}>更多<span aria-hidden="true">•••</span></button></header>
  <div className={styles.story}><span>这一组，可以直接分享</span><p>选择喜欢的样式，再看看发布后的样子。</p></div>
  <div className={styles.effectOptions} role="group" aria-label="作品样式">{Object.entries(effects).map(([value,label])=><button key={value} aria-pressed={effect===value} disabled={value==='stickers'&&!stickers.length} onClick={()=>{setEffect(value as ShareEffect);saveEffect(group.id,value as ShareEffect);setStickerIndex(0);}}>{label}</button>)}</div>
  <div className={styles.photoArea} data-selected-effect={effect}>{effect==='stickers'?<><div className={styles.stickerPreview}><small>TRAVEL COLLECTION</small><h2>{group.name}</h2><ArtStickerSheet stickers={stickers.slice(stickerPage*6,stickerPage*6+6)}/></div><div className={styles.stickerControls}><button aria-label="上一页贴纸" disabled={!stickerPage} onClick={()=>setStickerIndex(stickerPage-1)}>上一页</button><span>{stickerPage+1} / {stickerPages}</span><button aria-label="下一页贴纸" disabled={stickerPage>=stickerPages-1} onClick={()=>setStickerIndex(stickerPage+1)}>下一页</button></div></>:<PhotoBrowser photos={photos} index={index} onIndex={i=>setActiveId(photos[i]?.id)} onZoom={()=>setSheet('zoom')} onInfo={()=>setSheet('info')} content={current&&(effect==='original'?<SafeImage src={current.src} alt={current.label}/>:<PublishPhoto photo={current} index={index} total={photos.length} layout={effect==='postcard'?'postcard':'journal'}/>)}/>}</div>  <div className={styles.railArea}>{effect!=='stickers'&&<ThumbnailRail photos={photos} activeId={current?.id} onSelect={i=>setActiveId(photos[i].id)} onReorder={photoIds=>edit({type:'reorder',photoIds})}/>}
   <p className={styles.gestureHint}>{effect==='stickers'?'整组贴纸已排版 · 每页最多六枚':'滑动预览成品 · 点按看原图 · 调整里可更换与排序'}</p>
   <div className={styles.editStatus}><span role="status" aria-live="polite">{message||'喜欢这一版，就带着整组图片去分享。'}</span><button disabled={!draft?.undo.length} onClick={undo}>撤销</button></div>
  </div>
  <footer className={styles.footer}><button className={styles.adjustButton} onClick={()=>setSheet('adjust')}>调整本组<small>{photos.length} 张 · 可选</small></button><StampButton disabled={!photos.length} onClick={()=>setSheet('share')}>分享这一组</StampButton></footer>
  <MobileSheet className={sheet==='share'?shareStyles.shareDialog:undefined} open={sheet!==null} title={titles[sheet??'adjust']} onClose={()=>setSheet(null)}>
   {sheet==='share'&&<ShareComposer edition={createEdition(group,1)} effect={effect} onShare={text=>{setSheet(null);setMessage(text);}}/>}
   {sheet==='adjust'&&<GroupAdjustments group={group} draft={draft} activeId={current?.id} onEdit={edit} onUndo={undo} onRename={rename} onInfo={()=>setSheet('info')}/>}
   {sheet==='rename'&&<form className={styles.rename} onSubmit={e=>{e.preventDefault();if(!name.trim())return;edit({type:'rename',name});input.current?.blur();setSheet(null);}}>
    <label htmlFor="group-name">给这段旅途起个名字</label><input ref={input} id="group-name" value={name} maxLength={40} enterKeyHint="done" autoComplete="off" onChange={e=>setName(e.target.value)}/><p className={styles.hint}>{name.length}/40 · 只修改当前照片组</p>
    <div className={styles.actionRow}><button type="button" onClick={()=>{input.current?.blur();setSheet(null);}}>取消</button><button className={styles.save} type="submit" disabled={!name.trim()}>完成</button></div>
   </form>}
   {sheet==='info'&&current&&<div className={styles.metadata}><SafeImage src={current.src} alt=""/><h3>{current.label}</h3><dl><dt>拍摄日期</dt><dd>{current.takenAt}</dd><dt>拍摄地点</dt><dd>{current.location}</dd></dl><p className={styles.hint}>{group.tripId.startsWith('local-')?'本机导入照片，尚未读取 EXIF 日期与地点。':'演示拍摄信息，非素材原始 EXIF。'}</p>{!group.tripId.startsWith('local-')&&<a href="./assets/editorial/attribution.html" target="_blank" rel="noreferrer">查看示例照片来源与许可</a>}</div>}
   {sheet==='zoom'&&current&&<PhotoZoom key={current.id} photo={current}/>}
  </MobileSheet>
 </div>
}


