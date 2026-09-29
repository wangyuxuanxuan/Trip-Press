import type {Photo,PhotoGroup,Trip} from '../domain/types';
import type {ShelfTrip} from './tripShelf';

export interface LocalTrip {trip:Trip;photos:Photo[];groups:PhotoGroup[];shelf:ShelfTrip;}
// Session-only local media. Blob URLs never leave the browser.
const entries=new Map<string,LocalTrip>();
export const localTrips=()=>Array.from(entries.values());
export const localTrip=(id:string)=>entries.get(id);
export const localPhoto=(id:string)=>localTrips().flatMap(entry=>entry.photos).find(photo=>photo.id===id);
export const localGroup=(id:string|null)=>localTrips().flatMap(entry=>entry.groups).find(group=>group.id===id);
export const registerLocalTrip=(entry:LocalTrip)=>entries.set(entry.trip.id,entry);
export function releaseLocalTrip(entry:LocalTrip){entry.photos.forEach(photo=>URL.revokeObjectURL(photo.src));entries.delete(entry.trip.id);}

async function preview(file:File):Promise<string>{
 const original=URL.createObjectURL(file);
 try{
  const image=new Image();image.src=original;await image.decode();
  const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const context=canvas.getContext('2d');if(!context)throw new Error('无法读取照片');
  context.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('无法读取照片')),'image/jpeg',.86));
  return URL.createObjectURL(blob);
 }finally{URL.revokeObjectURL(original);}
}
export async function prepareLocalTrip(files:File[],signal?:AbortSignal):Promise<LocalTrip>{
 if(!files.length)throw new Error('请选择旅行照片。');
 if(files.length>120||files.some(file=>file.size>20*1024*1024)||files.reduce((sum,file)=>sum+file.size,0)>200*1024*1024)throw new Error('本地体验一次支持 120 张、合计 200 MB，每张不超过 20 MB。');
 const id=`local-${crypto.randomUUID()}`,photos:Photo[]=[];
 try{
  for(const [index,file] of files.entries()){
   signal?.throwIfAborted();
   if(!/^image\//.test(file.type))throw new Error('请选择图片文件。');
   let src:string;try{src=await preview(file);}catch{throw new Error(`「${file.name}」无法读取，请转为 JPG、PNG 或 WebP 后重试。`);}
   photos.push({id:`${id}-${index}`,tripId:id,label:file.name.replace(/\.[^.]+$/,''),src,takenAt:'拍摄日期未读取',location:'地点未读取'});
   signal?.throwIfAborted();
  }
  const date=new Date().toLocaleDateString('zh-CN').replaceAll('/','.');
  const month=new Date().toISOString().slice(0,7).replace('-','.');
  const trip:Trip={id,name:month+' 地点待填写',date:'导入于 '+date,photoCount:photos.length};
  const groups:PhotoGroup[]=Array.from({length:Math.ceil(photos.length/8)},(_,index)=>({id:`${id}-group-${index}`,tripId:id,name:`旅行片段 ${String(index+1).padStart(2,'0')}`,category:'recommended',description:'按导入顺序收好的片段。',photoIds:photos.slice(index*8,index*8+8).map(photo=>photo.id),cover:photos[index*8].src}));
  const shelf:ShelfTrip={id,name:trip.name,place:'MY JOURNEY',note:'把这些瞬间，留给以后的自己',kind:'box',date,country:'LOCAL MEMORIES',photos:photos.slice(0,3).map(photo=>({src:photo.src,alt:photo.label,author:'本机选取',source:''})),theme:{primary:'#FF7967',paper:'#FFF0E9',ink:'#984334',onPrimary:'#17394C'},colors:{main:'#FFF0E9',secondary:'#FF7967',accent:'#41BDEA'},motifs:['ticket','sun']};
  return {trip,photos,groups,shelf};
 }catch(error){photos.forEach(photo=>URL.revokeObjectURL(photo.src));throw error;}
}
