import {useState} from 'react';
import type {Edition} from '../../domain/types';
import {photoById} from '../../data/mock';
import {stickersForPhotos} from '../../data/editorial';
import {ArtStickerSheet} from '../editorial/StickerArt';
import {PublishPhoto} from '../editorial/PublishPhoto';
import {SafeImage} from '../mobile/SafeImage';
import styles from './shareComposer.module.css';

const platforms={wechat:'微信',weibo:'微博',redbook:'小红书',douyin:'抖音'} as const;
import {effects,readEffect,type ShareEffect} from './shareEffects';
type Platform=keyof typeof platforms;
type Effect=keyof typeof effects;
interface Selection {platform:Platform;effect:Effect;wechat:'friend'|'moments'}
function restore(key:string):Selection{
 try{const saved=JSON.parse(sessionStorage.getItem(key)??'null');if(saved&&saved.platform in platforms&&saved.effect in effects&&['friend','moments'].includes(saved.wechat))return saved;}catch{/* Storage is optional in private browsing. */}
 return {platform:'redbook',effect:'journal',wechat:'moments'};
}
export function ShareComposer({edition,onShare,effect:chosenEffect}:{edition:Edition;onShare:(message:string)=>void;effect?:ShareEffect}){
 const storageKey=`trip-press-share-${edition.id}`;
 const [selection,setSelection]=useState(()=>restore(storageKey));
 const [index,setIndex]=useState(0);
 const stickers=stickersForPhotos(edition.photoIds);
 const {platform,wechat}=selection;
 const effect=chosenEffect??readEffect(edition.groupId);
 const total=effect==='stickers'?Math.ceil(stickers.length/6):edition.photoIds.length;
 const current=Math.min(index,Math.max(0,total-1));
 const moments=platform==='wechat'&&wechat==='moments';
 const batch=Math.floor(current/9);
 const batchCount=Math.min(9,total-batch*9);
 const renderPage=(pageIndex:number)=>{
  const photo=photoById(edition.photoIds[pageIndex]??edition.photoIds[0]);
  return effect==='original'?<SafeImage src={photo.src} alt={photo.label}/>:effect==='stickers'?<div className={styles.stickerPage}><small>TRAVEL COLLECTION</small><h3>{edition.title}</h3>{stickers.length?<ArtStickerSheet stickers={stickers.slice(pageIndex*6,pageIndex*6+6)}/>:<p>这组照片还没有贴纸，请选择其他样式。</p>}</div>:<PublishPhoto photo={photo} index={pageIndex} total={total} layout={effect==='postcard'?'postcard':'journal'}/>;
 };
 const destination=platform==='wechat'?wechat==='moments'?'微信朋友圈':'微信好友':platforms[platform];
 const choose=(patch:Partial<Selection>)=>{
  const next={...selection,...patch};setSelection(next);setIndex(0);
  try{sessionStorage.setItem(storageKey,JSON.stringify(next));}catch{/* Keep the in-memory selection. */}
 };
 return <div className={styles.composer}>
  <div className={styles.options} role="group" aria-label="分享平台">{Object.entries(platforms).map(([value,label])=><button key={value} aria-pressed={platform===value} onClick={()=>choose({platform:value as Platform})}>{label}</button>)}</div>
  {platform==='wechat'&&<div className={styles.destinations} role="group" aria-label="微信分享位置"><button aria-pressed={wechat==='friend'} onClick={()=>choose({wechat:'friend'})}>发给好友</button><button aria-pressed={wechat==='moments'} onClick={()=>choose({wechat:'moments'})}>朋友圈</button></div>}
  <div className={styles.previewHeading}><span>{destination} · 排版示意</span><small>非平台实际界面</small></div>
  <section className={styles.preview} data-platform={platform} data-destination={wechat} data-effect={effect} aria-label={`${destination}发布效果示意`}>
   <div className={styles.author}><span className={styles.avatar} aria-hidden="true">旅</span><div><b>旅行记录</b><small>示例账号 · 发布预览</small></div></div>
   {(platform==='weibo'||platform==='wechat')&&<p className={styles.caption}>{edition.caption}</p>}
   {moments?<div className={styles.momentsGrid} data-moments-count={batchCount} data-columns={batchCount===1?1:batchCount===4?2:3} aria-label={`朋友圈图片排列，本条 ${batchCount} 张`}>
    {Array.from({length:Math.max(0,batchCount)},(_,i)=><div className={styles.momentTile} key={batch*9+i}><div className={styles.momentPage}>{renderPage(batch*9+i)}</div></div>)}
   </div>:<div className={styles.art}>{renderPage(current)}{platform==='douyin'&&<span className={styles.verticalLabel}>图文作品 · 左右翻看</span>}</div>}   {(platform==='redbook'||platform==='douyin')&&<div className={styles.postText}><h3>{edition.title}</h3><p>{edition.caption}</p></div>}
   <div className={styles.platformFooter} aria-hidden="true">{platform==='wechat'?(wechat==='moments'?'刚刚 · 赞 · 评论':'发送给好友的图片与文字'):platform==='weibo'?'转发　·　评论　·　赞':platform==='redbook'?'喜欢　·　收藏　·　评论':'喜欢　·　评论　·　收藏　·　分享'}</div>
  </section>
  {moments?<div className={styles.pager}><button aria-label="上一条朋友圈示意" disabled={batch===0} onClick={()=>setIndex((batch-1)*9)}>上一条</button><span aria-live="polite">{batchCount} 张图片{total>9?` · 第 ${batch+1}/${Math.ceil(total/9)} 条示意`:''}</span><button aria-label="下一条朋友圈示意" disabled={(batch+1)*9>=total} onClick={()=>setIndex((batch+1)*9)}>下一条</button></div>:<div className={styles.pager}><button aria-label="上一张分享图片" disabled={current===0} onClick={()=>setIndex(current-1)}>上一张</button><span aria-live="polite">{total?current+1:0} / {total}</span><button aria-label="下一张分享图片" disabled={current>=total-1} onClick={()=>setIndex(current+1)}>下一张</button></div>}
  {moments&&total>9&&<p className={styles.explanation}>本示意每条排列最多 9 张，已分为 {Math.ceil(total/9)} 条；确认时只模拟分享当前这一条。</p>}  <p className={styles.explanation}>{effect==='original'?'保留照片原貌，不附加贴纸或文字。':effect==='stickers'?'按整组照片整理贴纸，每页最多六枚。':effect==='journal'?'原图搭配对应贴纸、地点和手账留白。':'用留白、照片与对应贴纸组成一张旅行明信片。'}</p>
  <div className={styles.action}><button disabled={!total} onClick={()=>onShare(`已模拟准备分享至${destination}：${moments?batchCount:total} 张${effects[effect]}与配文。未发送或发布任何内容。`)}>分享至{destination} <span>模拟</span></button><small>预览为排版示意，实际展示以平台为准。</small></div>
 </div>;
}


