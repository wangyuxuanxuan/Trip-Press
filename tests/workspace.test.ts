import { describe, it, expect } from 'vitest';
import { groupsForMode, groups, photos } from '../src/data/mock';
import { initialState, reducer } from '../src/state/flow';
describe('工作桌分类', () => {
  it('只收有依据的组，不强求覆盖全部照片',()=>{
    expect(groupsForMode('recommended').map(g=>[g.name,g.photoIds.length])).toEqual([['从樱花到海岸',9]]);
    expect(groupsForMode('people').map(g=>g.id)).toEqual(['japan-company']);
    expect(groupsForMode('theme').map(g=>g.id)).toEqual(['japan-roofs','japan-streets']);
    expect(groupsForMode('color').map(g=>g.id)).toEqual(['japan-pink','japan-vermillion']);
    expect(new Set(groups.map(g=>g.id)).size).toBe(groups.length);
    for(const g of groups)for(const id of g.photoIds)expect(photos.some(p=>p.id===id)).toBe(true);
  });
  it('模式默认推荐，切换后进入整组并返回时保留模式', () => {
    let state = reducer(initialState,{type:'OPEN_TRIP'});
    expect(state.workspaceMode).toBe('recommended');
    state = reducer(state,{type:'SET_WORKSPACE_MODE',mode:'color'});
    state = reducer(state,{type:'SELECT_GROUP',groupId:groupsForMode('color')[0].id});
    expect(state.scene).toBe('groupDetail');
    state = reducer(state,{type:'BACK'});
    expect(state.workspaceMode).toBe('color');
    expect(state.scene).toBe('workspace');
  });
  it('作品墙入口在没有作品时仍可访问并返回', () => {
    let state = reducer(initialState,{type:'OPEN_TRIP'});
    state = reducer(state,{type:'OPEN_GALLERY'});
    expect(state.scene).toBe('gallery');
    expect(state.editions).toHaveLength(0);
    expect(reducer(state,{type:'BACK'}).scene).toBe('workspace');
  });
});
