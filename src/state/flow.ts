import {editorialGroup,curatedTrip} from '../data/editorial';
import {localGroup,localTrip} from '../data/localTrips';
import { editEdition, type EditionEdit } from './editionEdits';
import { candidatesForGroup, createEdition, groups, groupsForMode, printSteps } from '../data/mock';
import { createDraft, editGroup, type GroupDraft, type GroupEdit } from './groupEdits';
import type { Edition, Scene, GroupCategory } from '../domain/types';
export type PrintStatus = 'idle' | 'running' | 'failed' | 'complete';
export type ShelfView = 'collection' | 'importing';
export interface FlowState { activeTripId:string; pendingImportId?:string; collectionScope:string; activePhotoIds:Record<string,string>; shelfView:ShelfView; importStep:number; printStatus:PrintStatus; printAutoEnter:boolean; drafts: Record<string,GroupDraft>; scene: Scene; workspaceMode: GroupCategory; history: Scene[]; selectedGroupId: string | null; confirmed: boolean; printStep: number; editions: Edition[]; activeEditionId: string | null; direction: 1 | -1; }
export type Action = {type:'PREPARE_SHARE'} | {type:'SET_COLLECTION_SCOPE';scope:string} | {type:'OPEN_PACKAGE';id:string} | {type:'OPEN_COLLECTION';scope:string} | {type:'START_IMPORT';tripId?:string} | {type:'OPEN_TRIP';tripId?:string} | {type:'SET_ACTIVE_PHOTO';photoId:string} | {type:'OPEN_IMPORT'|'ADVANCE_IMPORT'|'COMPLETE_IMPORT'} | {type:'EDIT_EDITION';edit:EditionEdit} | {type:'RETURN_GROUP'} | {type:'FAIL_PRINT'} | {type:'RETRY_PRINT'} | {type:'EDIT_GROUP';edit:GroupEdit} | {type:'UNDO_GROUP'} | { type: 'SET_WORKSPACE_MODE'; mode: GroupCategory } | { type: 'SELECT_GROUP'; groupId: string } | { type: 'SET_CONFIRMED'; value: boolean } | { type: 'START_PRINT' } | { type: 'ADVANCE_PRINT' } | { type: 'OPEN_GALLERY' } | { type: 'BACK' } | { type: 'RETURN_WORKSPACE' };
export const initialState: FlowState = { activeTripId:'osaka-2026', collectionScope:'all', activePhotoIds:{}, shelfView:'collection', importStep:0, printStatus:'idle', printAutoEnter:false, drafts: {}, scene: 'tripShelf', workspaceMode: 'recommended', history: [], selectedGroupId: null, confirmed: true, printStep: 0, editions: [], activeEditionId: null, direction: 1 };
export const resolveGroup = (state:FlowState,id:string|null) => { const original=localGroup(id)??editorialGroup(id)??groups.find(group=>group.id===id); if(!original)return undefined; const draft=state.drafts[original.id]; return draft ? {...original,name:draft.name,photoIds:draft.photoIds} : original; };
const go = (state: FlowState, scene: Scene): FlowState => ({ ...state, scene, history: [...state.history, state.scene], direction: 1 });
export function reducer(state: FlowState, action: Action): FlowState {
  switch (action.type) {
    case 'PREPARE_SHARE': {
      const group=resolveGroup(state,state.selectedGroupId);
      if(state.scene!=='groupDetail'||!state.confirmed||!group?.photoIds.length)return state;
      // Reopen the same prepared package, including its edited caption/layout.
      const signature=JSON.stringify([group.name,group.photoIds]);
      const existing=[...state.editions].reverse().find(e=>e.groupId===group.id&&(e.sourceSignature??JSON.stringify([e.title,e.photoIds]))===signature);
      const edition=existing??createEdition(group,state.editions.length+1);
      return {...go(state,'gallery'),activeEditionId:edition.id,editions:existing?state.editions:[...state.editions,edition],printAutoEnter:false};
    }
    case 'SET_ACTIVE_PHOTO': return state.scene==='groupDetail'&&state.selectedGroupId&&resolveGroup(state,state.selectedGroupId)?.photoIds.includes(action.photoId)?{...state,activePhotoIds:{...state.activePhotoIds,[state.selectedGroupId]:action.photoId}}:state;
    case 'OPEN_IMPORT': return state;
    case 'START_IMPORT': return state.scene==='tripShelf'&&state.shelfView==='collection'?{...state,pendingImportId:action.tripId??state.activeTripId,shelfView:'importing',importStep:0}:state;
    case 'ADVANCE_IMPORT': return state.scene==='tripShelf'&&state.shelfView==='importing'&&state.importStep<4?{...state,importStep:state.importStep+1}:state;
    case 'COMPLETE_IMPORT': return state.scene==='tripShelf'&&state.shelfView==='importing'&&state.importStep===4?{...go(state,'workspace'),activeTripId:state.pendingImportId??state.activeTripId,pendingImportId:undefined,shelfView:'collection',importStep:0,workspaceMode:'recommended'}:state;
    case 'EDIT_EDITION': {
      if(state.scene!=='gallery')return state;
      const current=state.editions.find(e=>e.id===state.activeEditionId);if(!current)return state;
      const next=editEdition(current,action.edit);return next===current?state:{...state,editions:state.editions.map(e=>e.id===next.id?next:e)};
    }
    case 'RETURN_GROUP': {
      const edition=state.editions.find(e=>e.id===state.activeEditionId);
      return state.scene==='gallery'&&edition?{...state,scene:'groupDetail',selectedGroupId:edition.groupId,history:['tripShelf','workspace'],direction:-1,confirmed:true}:state;
    }
    case 'EDIT_GROUP':
    case 'UNDO_GROUP': {
      if(state.scene!=='groupDetail'||!state.selectedGroupId)return state;
      const group=resolveGroup(state,state.selectedGroupId);if(!group)return state;
      const draft=state.drafts[group.id]??createDraft(group);
      let next=draft;
      if(action.type==='EDIT_GROUP')next=editGroup(draft,action.edit,candidatesForGroup(group));
      else {const previous=draft.undo.at(-1);if(previous)next={...previous,undo:draft.undo.slice(0,-1)};}
      return next===draft?state:{...state,drafts:{...state.drafts,[group.id]:next}};
    }
    case 'SET_WORKSPACE_MODE': return state.scene === 'workspace' ? { ...state, workspaceMode: action.mode } : state;
    case 'OPEN_TRIP': return state.scene === 'tripShelf' && state.shelfView==='collection' ? {...go(state, 'workspace'),activeTripId:curatedTrip(action.tripId??'osaka-2026'),workspaceMode:'recommended'} : state;
    case 'SELECT_GROUP':
      return state.scene === 'workspace' && groupsForMode(state.workspaceMode,state.activeTripId).some(group => group.id === action.groupId)
        ? { ...go(state, 'groupDetail'), selectedGroupId: action.groupId, confirmed: true, printStep: 0 } : state;
    case 'SET_CONFIRMED': return state.scene === 'groupDetail' ? { ...state, confirmed: action.value } : state;
    case 'START_PRINT': return state.scene === 'groupDetail' && state.confirmed && state.selectedGroupId && resolveGroup(state,state.selectedGroupId)!.photoIds.length>0
      ? { ...go(state, 'printing'), printStep: 0, printStatus:'running', printAutoEnter:true } : state;
    case 'FAIL_PRINT': return state.scene==='printing' && state.printStatus==='running' ? {...state,printStatus:'failed',printAutoEnter:false} : state;
    case 'RETRY_PRINT': return state.scene==='printing' && state.printStatus==='failed' ? {...state,printStep:0,printStatus:'running',printAutoEnter:true} : state;
    case 'ADVANCE_PRINT': {
      if (state.scene !== 'printing' || state.printStatus !== 'running' || state.printStep >= printSteps.length) return state;
      const printStep = state.printStep + 1;
      if (printStep < printSteps.length) return { ...state, printStep };
      const group = resolveGroup(state,state.selectedGroupId);
      if (!group) return state;
      const edition = createEdition(group, state.editions.length + 1);
      return { ...state, printStep, printStatus:'complete', editions: [...state.editions, edition], activeEditionId: edition.id };
    }
    case 'SET_COLLECTION_SCOPE': return state.scene==='stickerCollection'?{...state,collectionScope:action.scope}:state;
    case 'OPEN_PACKAGE': return state.scene==='stickerCollection'&&state.editions.some(edition=>edition.id===action.id)?{...go(state,'gallery'),activeEditionId:action.id,activeTripId:(resolveGroup(state,state.editions.find(edition=>edition.id===action.id)!.groupId)?.tripId??'osaka-2026')}:state;
    case 'OPEN_COLLECTION': return state.shelfView==='importing'?state:{...go(state,'stickerCollection'),collectionScope:action.scope};
    case 'OPEN_GALLERY': return (state.scene === 'workspace' || (state.activeEditionId && state.scene === 'printing' && state.printStatus === 'complete' && state.printStep === printSteps.length)) ? {...go(state, 'gallery'),printAutoEnter:false} : state;
    case 'BACK': {
      if(state.scene==='tripShelf'&&state.shelfView!=='collection')return {...state,pendingImportId:undefined,shelfView:'collection',importStep:0};
      const scene = state.history.at(-1);
      return scene ? { ...state, scene, history: state.history.slice(0, -1), direction: -1 } : state;
    }
    case 'RETURN_WORKSPACE': return state.scene !== 'tripShelf' ? { ...state, scene: 'workspace', history: ['tripShelf'], direction: -1 } : state;
  }
}
