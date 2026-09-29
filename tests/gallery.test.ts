import {describe,it,expect} from 'vitest';
import {initialState,reducer} from '../src/state/flow';
const gallery=()=>{
 let s=reducer(reducer(reducer(initialState,{type:'OPEN_TRIP'}),{type:'SELECT_GROUP',groupId:'osaka-spring'}),{type:'START_PRINT'});
 for(let i=0;i<4;i++)s=reducer(s,{type:'ADVANCE_PRINT'});
 return reducer(s,{type:'OPEN_GALLERY'});
};
describe('edition wall',()=>{
 it('creates only actual photo pages and freezes the generated group order',()=>{
  let s=gallery();const e=s.editions[0];expect(e.artworks).toHaveLength(e.photoIds.length+4);expect(e.artworks.filter(a=>a.kind==='carousel')).toHaveLength(e.photoIds.length);
  expect(e.photoIds).toHaveLength(9);const first=e.photoIds[0];
  s=reducer(s,{type:'RETURN_GROUP'});expect(s.scene).toBe('groupDetail');expect(s.selectedGroupId).toBe(e.groupId);
  s=reducer(s,{type:'EDIT_GROUP',edit:{type:'remove',photoId:first}});
  expect(s.editions[0].photoIds).toContain(first);
  expect(reducer(s,{type:'BACK'}).scene).toBe('workspace');
 });
 it('preserves title, layout and separately edited captions on returning',()=>{
  let s=gallery();s=reducer(s,{type:'EDIT_EDITION',edit:{type:'title',value:'红色散步'}});s=reducer(s,{type:'EDIT_EDITION',edit:{type:'layout',value:'poster'}});
  s=reducer(s,{type:'EDIT_EDITION',edit:{type:'caption',value:'今天的红色。'}});
  s=reducer(s,{type:'EDIT_EDITION',edit:{type:'tone',value:'fun'}});
  expect(s.editions[0].caption).toBe(s.editions[0].captions.fun);
  s=reducer(s,{type:'EDIT_EDITION',edit:{type:'tone',value:'natural'}});
  expect(s.editions[0].caption).toBe('今天的红色。');
  s=reducer(s,{type:'RETURN_WORKSPACE'});s=reducer(s,{type:'OPEN_GALLERY'});
  expect(s.editions[0].title).toBe('红色散步');expect(s.editions[0].layout).toBe('poster');expect(s.editions[0].caption).toBe('今天的红色。');
 });
 it('rejects invalid edits and editing outside the wall',()=>{
  const s=gallery();expect(reducer(s,{type:'EDIT_EDITION',edit:{type:'title',value:'  '}})).toBe(s);
  expect(reducer(s,{type:'EDIT_EDITION',edit:{type:'caption',value:'x'.repeat(501)}})).toBe(s);
  expect(reducer(initialState,{type:'EDIT_EDITION',edit:{type:'title',value:'wrong'}})).toBe(initialState);
  expect(reducer(initialState,{type:'RETURN_GROUP'})).toBe(initialState);
 });
});
