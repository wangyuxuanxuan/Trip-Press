import { describe, it, expect } from 'vitest';
import { initialState, reducer, resolveGroup } from '../src/state/flow';
import { candidatePhotoIds, photos } from '../src/data/mock';
const open = () => reducer(reducer(initialState,{type:'OPEN_TRIP'}),{type:'SELECT_GROUP',groupId:'osaka-spring'});
describe('optional whole-group edits',()=>{
 it('starts with a complete photo set and shares without selection',()=>{
  const state=open(); const group=resolveGroup(state,'osaka-spring')!;
  expect(group.photoIds).toHaveLength(9);
  expect(new Set(group.photoIds.map(id=>photos.find(p=>p.id===id)!.src)).size).toBe(9);
  expect(reducer(state,{type:'PREPARE_SHARE'}).scene).toBe('gallery');
 });
 it('removes, restores at the same position and undoes restoration',()=>{
  let state=open();const ids=resolveGroup(state,'osaka-spring')!.photoIds;const id=ids[1];
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'remove',photoId:id}});
  expect(resolveGroup(state,'osaka-spring')!.photoIds).toHaveLength(ids.length-1);
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'restore',photoId:id}});
  expect(resolveGroup(state,'osaka-spring')!.photoIds).toEqual(ids);
  state=reducer(state,{type:'UNDO_GROUP'});
  expect(resolveGroup(state,'osaka-spring')!.photoIds).not.toContain(id);
 });
 it('replacement never duplicates and the original can be restored',()=>{
  let state=open(); const ids=resolveGroup(state,'osaka-spring')!.photoIds;
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'replace',photoId:ids[0],candidateId:candidatePhotoIds[0]}});
  expect(resolveGroup(state,'osaka-spring')!.photoIds[0]).toBe(candidatePhotoIds[0]);
  const unchanged=reducer(state,{type:'EDIT_GROUP',edit:{type:'replace',photoId:ids[1],candidateId:candidatePhotoIds[0]}});
  expect(unchanged).toBe(state);
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'restore',photoId:ids[0]}});
  expect(new Set(resolveGroup(state,'osaka-spring')!.photoIds).size).toBe(ids.length+1);
 });
 it('reorders, renames and carries edits through return and printing',()=>{
  let state=open();const ids=resolveGroup(state,'osaka-spring')!.photoIds;
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'reorder',photoIds:[...ids].reverse()}});
  state=reducer(state,{type:'EDIT_GROUP',edit:{type:'rename',name:'  街角的红色  '}});
  state=reducer(state,{type:'BACK'});state=reducer(state,{type:'SELECT_GROUP',groupId:'osaka-spring'});
  expect(resolveGroup(state,'osaka-spring')!.photoIds).toEqual([...ids].reverse());
  state=reducer(state,{type:'START_PRINT'});
  for(let n=0;n<4;n++) state=reducer(state,{type:'ADVANCE_PRINT'});
  expect(state.editions[0].title).toBe('街角的红色');
 });
 it('rejects invalid edits, cannot print an empty group and can undo removal',()=>{
  let state=open();const ids=resolveGroup(state,'osaka-spring')!.photoIds;
  expect(reducer(state,{type:'EDIT_GROUP',edit:{type:'reorder',photoIds:[ids[0]]}})).toBe(state);
  expect(reducer(state,{type:'EDIT_GROUP',edit:{type:'rename',name:'  '}})).toBe(state);
  for(const id of ids) state=reducer(state,{type:'EDIT_GROUP',edit:{type:'remove',photoId:id}});
  expect(reducer(state,{type:'START_PRINT'}).scene).toBe('groupDetail');
  state=reducer(state,{type:'UNDO_GROUP'});
  expect(resolveGroup(state,'osaka-spring')!.photoIds).toHaveLength(1);
  expect(reducer(initialState,{type:'EDIT_GROUP',edit:{type:'rename',name:'Oops'}})).toBe(initialState);
 });
});
