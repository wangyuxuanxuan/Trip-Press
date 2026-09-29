import {artStickers,stickersForTrip,curatedTrip} from '../data/editorial';
export interface Creation {id:string;tripId:string;title:string;template:'cover'|'photo'|'postcard';mainId:string;photoId:string;x:number;y:number;scale:number;rotation:number;paper:'white'|'blue'|'cream';}
export const newCreation=(tripId:string):Creation=>{const main=stickersForTrip(tripId)[0];return {id:crypto.randomUUID(),tripId:curatedTrip(tripId),title:'旅途里的小收藏',template:'cover',mainId:main.id,photoId:main.photoId,x:0,y:0,scale:1,rotation:0,paper:'white'};};
const clamp=(n:number,min:number,max:number)=>Number.isFinite(n)?Math.min(max,Math.max(min,n)):0;
export function updateCreation(draft:Creation,patch:Partial<Creation>):Creation{
 const next={...draft,...patch,id:draft.id,tripId:draft.tripId};
 const main=artStickers.find(s=>s.id===next.mainId&&s.tripId===draft.tripId);
 if(!main)return draft;
 return {...next,photoId:main.photoId,title:next.title.slice(0,24),x:clamp(next.x,-30,30),y:clamp(next.y,-30,30),scale:clamp(next.scale,.7,1.3),rotation:clamp(next.rotation,-20,20)};
}
export function readCreations(raw:string|null):Creation[]{
 try{const parsed:unknown=JSON.parse(raw??'[]');if(!Array.isArray(parsed))return [];
  return parsed.map(x=>x&&typeof x==='object'?{...x,tripId:artStickers.find(s=>s.id===x.mainId)?.tripId??curatedTrip(x.tripId)}:x).filter((x):x is Creation=>Boolean(x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.title==='string'&&['cover','photo','postcard'].includes(x.template)&&['white','blue','cream'].includes(x.paper)&&artStickers.some(s=>s.id===x.mainId&&s.tripId===x.tripId&&s.photoId===x.photoId)&&['x','y','scale','rotation'].every(k=>typeof x[k]==='number'&&Number.isFinite(x[k])))).slice(0,50).map(x=>updateCreation(x,{}));
 }catch{return [];}
}
export const creationStorageKey='trip-press-creations-v1';
