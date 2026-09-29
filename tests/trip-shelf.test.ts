import {describe,it,expect} from 'vitest';
import {initialState,reducer} from '../src/state/flow';
describe('旅行导入',()=>{
 it('按顺序导入整组并进入推荐工作桌',()=>{
  let s=reducer(initialState,{type:'OPEN_IMPORT'});expect(s.shelfView).toBe('collection');expect(s.scene).toBe('tripShelf');
  s=reducer(s,{type:'START_IMPORT'});expect(s.shelfView).toBe('importing');expect(s.importStep).toBe(0);
  expect(reducer(s,{type:'COMPLETE_IMPORT'})).toBe(s);
  for(let i=0;i<4;i++)s=reducer(s,{type:'ADVANCE_IMPORT'});
  expect(s.importStep).toBe(4);s=reducer(s,{type:'COMPLETE_IMPORT'});expect(s.scene).toBe('workspace');expect(s.workspaceMode).toBe('recommended');expect(s.history).toEqual(['tripShelf']);
  expect(reducer(s,{type:'BACK'}).shelfView).toBe('collection');
 });
 it('返回取消导入，晚到回调不能跳转，重新导入从头开始',()=>{
  let s=reducer(reducer(initialState,{type:'OPEN_IMPORT'}),{type:'START_IMPORT'});s=reducer(s,{type:'ADVANCE_IMPORT'});s=reducer(s,{type:'BACK'});
  expect(s.shelfView).toBe('collection');expect(reducer(s,{type:'ADVANCE_IMPORT'})).toBe(s);expect(reducer(s,{type:'COMPLETE_IMPORT'})).toBe(s);
  expect(reducer(s,{type:'START_IMPORT'}).importStep).toBe(0);expect(reducer(s,{type:'BACK'}).shelfView).toBe('collection');
 });
 it('导入不覆盖已有照片组调整和作品',()=>{
  let s=reducer(reducer(initialState,{type:'OPEN_TRIP'}),{type:'SELECT_GROUP',groupId:'osaka-red'});
  s=reducer(s,{type:'EDIT_GROUP',edit:{type:'rename',name:'旅行中的红色'}});
  s=reducer(s,{type:'START_PRINT'});for(let i=0;i<4;i++)s=reducer(s,{type:'ADVANCE_PRINT'});
  const editions=s.editions,drafts=s.drafts;s=reducer(reducer(s,{type:'RETURN_WORKSPACE'}),{type:'BACK'});
  s=reducer(reducer(s,{type:'OPEN_IMPORT'}),{type:'START_IMPORT'});for(let i=0;i<4;i++)s=reducer(s,{type:'ADVANCE_IMPORT'});s=reducer(s,{type:'COMPLETE_IMPORT'});
  expect(s.editions).toBe(editions);expect(s.drafts).toBe(drafts);
 });
});
