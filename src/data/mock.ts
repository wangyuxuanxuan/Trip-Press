import {editorialGroups,editorialGroupsForMode,editorialTrips,editorialPhotos,editorialPhoto,editorialGroup,stickersForPhotos} from './editorial';
import {localPhoto,localTrip} from './localTrips';
import { makeArtworks } from './gallery';
import type { Edition, GroupCategory, Photo, PhotoGroup, Trip } from '../domain/types';
export const trip: Trip = editorialTrips[0];
export const photos:Photo[]=editorialPhotos.filter(p=>p.tripId===trip.id);
export const groups:PhotoGroup[]=editorialGroups.filter(g=>g.tripId===trip.id);
export const candidatePhotoIds=photos.filter(p=>!groups[0].photoIds.includes(p.id)).map(p=>p.id);
export const photoById=(id:string)=>(localPhoto(id)??editorialPhoto(id))!;
export const categoryLabels:Record<GroupCategory,string>={recommended:'这一刻',color:'同一种感觉',people:'我们',theme:'一路发现'};
export const modeGroupIds=Object.fromEntries((Object.keys(categoryLabels) as GroupCategory[]).map(mode=>[mode,editorialGroupsForMode(mode,trip.id).map(g=>g.id)])) as Record<GroupCategory,string[]>;
export const groupsForMode = (mode: GroupCategory, tripId=trip.id): PhotoGroup[] => localTrip(tripId)?(mode==='recommended'?localTrip(tripId)!.groups:[]):editorialGroupsForMode(mode,tripId);
export const candidatesForGroup=(group:PhotoGroup)=>localTrip(group.tripId)?.photos.map(p=>p.id)??(editorialGroup(group.id)?editorialPhotos.filter(p=>p.tripId===group.tripId).map(p=>p.id):candidatePhotoIds);
export const printSteps = ['整理照片顺序', '提取旅行元素', '制作贴纸与拼贴', '生成社交配文'];
export function createEdition(group: PhotoGroup, number: number): Edition {

  const presets={natural:'整理照片时，又想起了那天的风景。',fun:'照片拍了，喜欢的小细节也一起收好了。',mood:'把沿途看见的，留在这一页。'};
  const artworks=makeArtworks().filter(a=>a.kind!=='carousel'&&(a.kind!=='stickers'||stickersForPhotos(group.photoIds).length>0));
  artworks.splice(1,0,...group.photoIds.map((id,i)=>({id:'slide-'+(i+1),kind:'carousel' as const,title:photoById(id).label,description:String(i+1).padStart(2,'0')+' / '+String(group.photoIds.length).padStart(2,'0'),slideIndex:i})));
  return {id:'edition-'+number,groupId:group.id,sourceSignature:JSON.stringify([group.name,group.photoIds]),title:group.name,photoIds:[...group.photoIds],layout:'journal',captionTone:'natural',captions:presets,caption:presets.natural,artworks};
 }
