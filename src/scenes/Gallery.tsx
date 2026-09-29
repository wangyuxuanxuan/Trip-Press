import {useCallback,useEffect,useRef,useState} from 'react';
import type {CaptionTone,Edition,EditionLayout} from '../domain/types';
import type {EditionEdit} from '../state/editionEdits';
import {layoutLabels,toneLabels} from '../data/gallery';
import {HandDrawnIcon,MobileSheet,StampButton,Tape} from '../components/mobile';
import {ArtworkContent} from '../components/gallery/ArtworkContent';
import {ArtworkPreview} from '../components/gallery/ArtworkPreview';
import {copyCaption,exportStickers} from '../components/gallery/exportStickers';
import styles from '../components/gallery/gallery.module.css';
import {ShareComposer} from '../components/gallery/ShareComposer';
import shareStyles from '../components/gallery/shareComposer.module.css';
interface Props {onCollection:()=>void;edition?:Edition;onWorkspace:()=>void;onGroup:()=>void;onBack:()=>void;backLabel:string;onEdit:(edit:EditionEdit)=>void;onModalChange:(open:boolean)=>void;}
export function Gallery({edition,onWorkspace,onGroup,onBack,backLabel,onEdit,onModalChange,onCollection}:Props){
 const [active,setActive]=useState<{id:string;origin:DOMRect}|null>(null);
 const [sheet,setSheet]=useState<'title'|'caption'|'share'|null>(null);const [draft,setDraft]=useState('');const [notice,setNotice]=useState('');const [exporting,setExporting]=useState(false);
 const timeout=useRef<ReturnType<typeof setTimeout>|null>(null),input=useRef<HTMLInputElement>(null),textarea=useRef<HTMLTextAreaElement>(null);
 const notify=useCallback((message:string)=>{if(timeout.current)clearTimeout(timeout.current);setNotice(message);timeout.current=setTimeout(()=>setNotice(''),3600);},[]);
 useEffect(()=>()=>{if(timeout.current)clearTimeout(timeout.current);},[]);
 useEffect(()=>{onModalChange(Boolean(active||sheet));return()=>onModalChange(false);},[active,sheet,onModalChange]);
 useEffect(()=>{if(sheet)requestAnimationFrame(()=>{const field=sheet==='title'?input.current:textarea.current;field?.focus();field?.select();});},[sheet]);
 const doExport=async()=>{
  const svg=document.querySelector<SVGSVGElement>('[data-sticker-export="true"]');
  if(!svg){notify('贴纸尚未准备好，请重试。');return;}
  setExporting(true);
  try{await exportStickers(svg);notify('透明贴纸 PNG 已生成，下载已开始。');}catch{notify('PNG 导出未成功，请再试一次。');}finally{setExporting(false);}
 };
 const showEdit=(type:'title'|'caption')=>{if(!edition)return;setDraft(type==='title'?edition.title:edition.caption);setSheet(type);};
 const open=(id:string,button:HTMLButtonElement)=>setActive({id,origin:button.getBoundingClientRect()});
 const art=edition?.artworks.find(item=>item.id===active?.id);
 const piece=(id:string,decoration:'tape'|'pin'|'clip'='tape')=>{
  const item=edition!.artworks.find(a=>a.id===id)!;
  return <article className={styles.wallPiece} data-wall-piece={id}>
   <button className={styles.artButton} data-artwork-id={id} aria-label={`查看作品：${item.title}`} onClick={e=>open(id,e.currentTarget)}>
    <ArtworkContent art={item} edition={edition!} exportable={id==='stickers'}/>
    {decoration==='tape'?<Tape className={styles.hangingTape} tone={id==='collage'?'blue':'yellow'}/>:<span className={decoration==='pin'?styles.pin:styles.clip} aria-hidden="true"/>}
   </button>
   <p className={styles.wallLabel}><span>{item.description}</span><b>{item.title}</b></p>
  </article>;
 };
 return <div className={styles.gallery}>
  <header className={styles.header}><button onClick={onBack} aria-label={backLabel}><HandDrawnIcon name="back"/><span>返回</span></button><span>旅印所 · 发布包</span><button className={styles.shelfLink} onClick={onWorkspace}>工作桌</button></header>
  {!edition?<div className={styles.empty}><h1 tabIndex={-1} data-scene-heading>还没有发布包。</h1><p>回到工作桌，选一整组故事开始。</p><StampButton onClick={onWorkspace}>返回工作桌</StampButton></div>:<>
   <div className={styles.intro}><span>READY TO SHARE</span><h1 tabIndex={-1} data-scene-heading>{edition.title}</h1><p>1 张封面 + {edition.photoIds.length} 张排版图片，配文也准备好了。</p><button className={styles.editTitle} onClick={()=>showEdit('title')}>修改标题 <span aria-hidden="true">↗</span></button></div>
   <section className={styles.shareReady} aria-label="分享与发布">
    <div className={styles.shareButtons}><StampButton onClick={()=>setSheet('share')}>去分享</StampButton><button onClick={()=>notify(`已模拟保存封面和 ${edition.photoIds.length} 张发布图片，未写入相册。`)}>保存发布图片</button></div>
    <p className={styles.readyCaption}>{edition.caption}</p>
    <div className={styles.layouts} role="group" aria-label="快捷配文语气">{Object.entries(toneLabels).map(([value,label])=><button key={value} aria-pressed={edition.captionTone===value} onClick={()=>onEdit({type:'tone',value:value as CaptionTone})}>{label}</button>)}</div>
    <div className={styles.captionActions}><button onClick={()=>showEdit('caption')}>修改配文</button><button onClick={async()=>notify(await copyCaption(edition.caption)?'配文已复制。':'复制未成功，请打开配文长按选中文字。')}>复制配文</button></div>
   </section>
   <button className={styles.collectionLink} onClick={onCollection}><span>旅行贴纸册<small>小物件按旅行收藏，发布包留在这里</small></span><HandDrawnIcon name="arrow"/></button>
   <div className={styles.layoutBar}><span>这一版的样子</span><div className={styles.layouts} role="group" aria-label="整套排版">{Object.entries(layoutLabels).map(([value,label])=><button key={value} aria-pressed={edition.layout===value} onClick={()=>onEdit({type:'layout',value:value as EditionLayout})}>{label}</button>)}</div></div>
   <div className={styles.wall} data-layout={edition.layout} aria-label="本次旅行发布包">
    <section className={styles.coverMount} aria-label="封面展位">{piece('cover','clip')}<span className={styles.wallScribble}>第一眼，就想留下。</span></section>
    <section className={styles.carouselMount} aria-label="照片内容页"><div className={styles.sectionNote}><b>照片与对应贴纸</b><span>{String(edition.photoIds.length).padStart(2,'0')} PAGES / PHOTO STORIES</span></div><div className={styles.hangingLine} aria-hidden="true"/><div className={styles.carouselPapers}>{edition.artworks.filter(a=>a.kind==='carousel').map(a=><div key={a.id} className={styles.slideMount}>{piece(a.id,'pin')}</div>)}</div></section>
    {edition.artworks.some(art=>art.kind==='stickers')&&<section className={styles.stickerMount} aria-label="贴纸展位"><span className={styles.sectionTag}>小东西，也有大记忆。</span>{piece('stickers','tape')}<button className={styles.exportLink} disabled={exporting} onClick={()=>void doExport()}>{exporting?'正在生成 PNG…':'导出透明贴纸 PNG'}<HandDrawnIcon name="arrow"/></button></section>}
    <section className={styles.posterMount} aria-label="拼贴海报展位"><div className={styles.sectionNote}><b>实拍与插画，一一对应。</b><span>THE SAME LITTLE CORNER</span></div>{piece('collage','tape')}</section>
    <section className={styles.captionMount} aria-label="配文展位"><div className={styles.typewriterMouth} aria-hidden="true"><span>WORDS FROM THE TRIP</span><i/></div>{piece('caption','pin')}
     <div className={styles.captionTools}><div className={styles.layouts} role="group" aria-label="配文语气">{Object.entries(toneLabels).map(([value,label])=><button key={value} aria-pressed={edition.captionTone===value} onClick={()=>onEdit({type:'tone',value:value as CaptionTone})}>{label}</button>)}</div>
     <div className={styles.captionActions}><button onClick={()=>showEdit('caption')}>修改文字</button><button onClick={async()=>notify(await copyCaption(edition.caption)?'配文已复制。':'复制未成功，请打开配文长按选中文字。')}>复制配文</button><button onClick={()=>notify('已模拟分享配文，未发布到社交平台。')}>模拟分享</button></div></div>
    </section>
   </div>
   <footer className={styles.footer}><StampButton onClick={()=>notify(`已模拟保存整套 ${edition.artworks.length} 件作品，未写入相册。`)}>保存整套 · {edition.artworks.length} 件</StampButton><div className={styles.returnActions}><button onClick={onGroup}>返回照片组</button><button onClick={onWorkspace}>返回工作桌</button></div><p>保存、分享均为模拟体验 · 本次浏览中保留</p>{!edition.groupId.startsWith('local-')&&<a href="./assets/editorial/attribution.html" target="_blank" rel="noreferrer">照片来源与许可</a>}</footer>
  </>}
  {art&&edition&&active&&<ArtworkPreview notice={notice} art={art} edition={edition} origin={active.origin} onClose={()=>setActive(null)} onLayout={value=>onEdit({type:'layout',value})} onSave={()=>notify('已模拟保存这张作品，未写入相册。')} onShare={()=>notify('已模拟分享这张作品，未发布到社交平台。')} onExport={doExport}/>}
  <MobileSheet className={sheet==='share'?shareStyles.shareDialog:undefined} open={Boolean(sheet)} title={sheet==='share'?'分享这一组':sheet==='title'?'修改作品标题':'修改社交配文'} onClose={()=>setSheet(null)}>
   {sheet==='share'&&edition?<ShareComposer key={edition.id} edition={edition} onShare={message=>{setSheet(null);notify(message);}}/>:<form className={styles.editForm} onSubmit={e=>{e.preventDefault();if(!draft.trim()||!sheet)return;onEdit({type:sheet==='title'?'title':'caption',value:draft});setSheet(null);notify(sheet==='title'?'作品标题已更新。':'这一种语气的配文已更新。');}}>
    <label htmlFor="edition-input">{sheet==='title'?'给这套发布包起个名字':`写下你的旅途 · ${edition?toneLabels[edition.captionTone]:''}`}</label>
    {sheet==='title'?<input ref={input} id="edition-input" value={draft} maxLength={40} enterKeyHint="done" onChange={e=>setDraft(e.target.value)}/>:<textarea ref={textarea} id="edition-input" value={draft} maxLength={500} rows={5} onChange={e=>setDraft(e.target.value)}/>}
    <p>{draft.length}/{sheet==='title'?40:500}</p><div><button type="button" onClick={()=>setSheet(null)}>取消</button><button type="submit" disabled={!draft.trim()}>完成</button></div>
   </form>}
  </MobileSheet>
  <div className={styles.toast} role="status" aria-live="polite" data-visible={Boolean(notice)}>{notice}</div>
 </div>;
}



