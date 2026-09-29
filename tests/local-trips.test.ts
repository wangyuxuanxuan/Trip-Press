import {describe,it,expect,afterEach} from 'vitest';
import {localTrips,registerLocalTrip,releaseLocalTrip,type LocalTrip} from '../src/data/localTrips';
import {shelfTrips} from '../src/data/tripShelf';
import {initialState,reducer,resolveGroup} from '../src/state/flow';
import {createEdition,groupsForMode,photoById} from '../src/data/mock';
const entry:LocalTrip={trip:{id:'local-test',name:'我的海边',date:'2026.09',photoCount:2},shelf:{...shelfTrips[0],id:'local-test'},photos:[0,1].map(index=>({id:`local-photo-${index}`,tripId:'local-test',src:`blob:test-${index}`,label:'我的照片',takenAt:'未读取',location:'未读取'})),groups:[{id:'local-group',tripId:'local-test',name:'海边的片段',description:'本机导入',category:'recommended',photoIds:['local-photo-0']}]};
afterEach(()=>{localTrips().forEach(releaseLocalTrip);});
describe('本机旅行数据隔离',()=>{
 it('实际选入的照片进入自己的工作桌，发布包不会混入大阪内容',()=>{
  registerLocalTrip(entry);let state=reducer(initialState,{type:'START_IMPORT',tripId:entry.trip.id});
  for(let i=0;i<4;i++)state=reducer(state,{type:'ADVANCE_IMPORT'});
  state=reducer(state,{type:'COMPLETE_IMPORT'});expect(state.activeTripId).toBe('local-test');
  expect(groupsForMode('recommended',state.activeTripId)).toEqual(entry.groups);
  state=reducer(state,{type:'SELECT_GROUP',groupId:'osaka-red'});expect(state.scene).toBe('workspace');
  state=reducer(state,{type:'SELECT_GROUP',groupId:'local-group'});const group=resolveGroup(state,state.selectedGroupId)!;
  expect(photoById(group.photoIds[0]).src).toBe('blob:test-0');
  const edition=createEdition(group,1);expect(edition.caption).not.toContain('大阪');expect(edition.artworks.some(art=>art.kind==='stickers')).toBe(false);
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'replace',photoId:'local-photo-0',candidateId:'local-photo-1'}});expect(resolveGroup(state,'local-group')?.photoIds).toEqual(['local-photo-1']);
  const before=state;state=reducer(state,{type:'EDIT_GROUP',edit:{type:'replace',photoId:'local-photo-1',candidateId:'osaka-photo-9'}});expect(state).toBe(before);
 });
 it('取消导入不会改变原旅程，收藏筛选返回后保留',()=>{
  const state=reducer(reducer(initialState,{type:'START_IMPORT',tripId:'local-test'}),{type:'BACK'});expect(state.activeTripId).toBe('osaka-2026');expect(state.pendingImportId).toBeUndefined();
  const collection=reducer(reducer(initialState,{type:'OPEN_COLLECTION',scope:'all'}),{type:'SET_COLLECTION_SCOPE',scope:'kyoto'});expect(collection.collectionScope).toBe('kyoto');
 });
});
