import {describe,it,expect} from 'vitest';
import {initialState,reducer} from '../src/state/flow';
describe('首页与收藏职责',()=>{
 it('直接在首页整理，取消后没有中转页',()=>{
  const running=reducer(initialState,{type:'START_IMPORT'});
  expect(running.shelfView).toBe('importing');expect(running.scene).toBe('tripShelf');
  const back=reducer(running,{type:'BACK'});expect(back.shelfView).toBe('collection');
  expect(reducer(back,{type:'COMPLETE_IMPORT'})).toBe(back);
 });
 it('全局贴纸册返回首页，旅程贴纸册返回工作桌',()=>{
  const global=reducer(initialState,{type:'OPEN_COLLECTION',scope:'all'});
  expect(global.scene).toBe('stickerCollection');expect(reducer(global,{type:'BACK'}).scene).toBe('tripShelf');
  const desk=reducer(initialState,{type:'OPEN_TRIP'});
  const scoped=reducer(desk,{type:'OPEN_COLLECTION',scope:'osaka'});
  expect(scoped.collectionScope).toBe('osaka');expect(reducer(scoped,{type:'BACK'}).scene).toBe('workspace');
 });
});
