import {editorialShelf} from './editorial';
import type {CoverMotif} from '../components/collage/CoverSticker';
import type {LandscapePhoto} from './landscapes';
export interface AlbumTheme {primary:string;paper:string;ink:string;onPrimary:string;}
export interface ShelfTrip {
 id:string;name:string;place:string;note:string;kind:'box'|'film'|'envelope'|'summer';
 colors:{main:string;secondary:string;accent:string;leaf?:string};
 theme:AlbumTheme;date:string;country:string;photos:LandscapePhoto[];motifs:[CoverMotif,CoverMotif];art?:'qingdao'|'yunnan';
}
export const shelfTrips:ShelfTrip[]=editorialShelf;
export const importStages=['把照片倒在桌面上','让旅途的小事散开','相似的照片正在靠近','一叠叠故事，整理好了','分类罗盘已就位'];
export const importTimings=[850,1700,2650,3550,4450];
