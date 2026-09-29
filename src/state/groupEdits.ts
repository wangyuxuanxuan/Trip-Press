import type { PhotoGroup } from '../domain/types';
import { candidatePhotoIds } from '../data/mock';
export interface RemovedPhoto { photoId: string; index: number; }
export interface GroupSnapshot { name: string; photoIds: string[]; removed: RemovedPhoto[]; }
export interface GroupDraft extends GroupSnapshot { undo: GroupSnapshot[]; }
export type GroupEdit =
 | {type:'rename';name:string}
 | {type:'remove'|'restore';photoId:string}
 | {type:'replace';photoId:string;candidateId:string}
 | {type:'reorder';photoIds:string[]};
export const createDraft=(group:PhotoGroup):GroupDraft=>({name:group.name,photoIds:[...group.photoIds],removed:[],undo:[]});
export function editGroup(draft:GroupDraft,edit:GroupEdit,allowedCandidates=candidatePhotoIds):GroupDraft {
 const {name,photoIds,removed}=draft;
 let next:GroupSnapshot={name,photoIds,removed};
 switch(edit.type){
  case 'rename': {
   const value=edit.name.trim();if(!value||value.length>40||value===name)return draft;
   next={...next,name:value};break;
  }
  case 'remove': {
   const index=photoIds.indexOf(edit.photoId);if(index<0)return draft;
   next={...next,photoIds:photoIds.filter(id=>id!==edit.photoId),removed:[...removed,{photoId:edit.photoId,index}]};break;
  }
  case 'restore': {
   const item=removed.find(item=>item.photoId===edit.photoId);if(!item||photoIds.includes(item.photoId))return draft;
   const ids=[...photoIds];ids.splice(Math.min(item.index,ids.length),0,item.photoId);
   next={...next,photoIds:ids,removed:removed.filter(item=>item.photoId!==edit.photoId)};break;
  }
  case 'replace': {
   const index=photoIds.indexOf(edit.photoId);
   if(index<0||photoIds.includes(edit.candidateId)||!allowedCandidates.includes(edit.candidateId))return draft;
   next={...next,photoIds:photoIds.map(id=>id===edit.photoId?edit.candidateId:id),
     removed:[...removed.filter(item=>item.photoId!==edit.candidateId),{photoId:edit.photoId,index}]};break;
  }
  case 'reorder': {
   if(edit.photoIds.length!==photoIds.length||new Set(edit.photoIds).size!==photoIds.length||edit.photoIds.some(id=>!photoIds.includes(id))||edit.photoIds.every((id,i)=>photoIds[i]===id))return draft;
   next={...next,photoIds:[...edit.photoIds]};break;
  }
 }
 return {...next,undo:[...draft.undo.slice(-29),{name,photoIds,removed}]};
}
