import { describe, expect, it } from 'vitest';
import { initialState, reducer } from '../src/state/flow';
import { groups, trip, photos } from '../src/data/mock';

describe('完整照片组流程', () => {
  const detail = () => reducer(reducer(initialState, { type: 'OPEN_TRIP' }), { type: 'SELECT_GROUP', groupId: groups[0].id });
  it('保留实际样片数量和有效的整组引用', () => {
    expect(photos).toHaveLength(trip.photoCount);
    expect(trip.photoCount).toBe(12);
    for (const group of groups) for (const id of group.photoIds) expect(photos.some(photo => photo.id === id)).toBe(true);
  });
  it('走通五场景并返回工作桌', () => {
    let state = detail();
    expect(state.scene).toBe('groupDetail');
    state = reducer(state, { type: 'START_PRINT' });
    expect(state.scene).toBe('printing');
    for (let i = 0; i < 4; i++) state = reducer(state, { type: 'ADVANCE_PRINT' });
    state = reducer(state, { type: 'OPEN_GALLERY' });
    expect(state.scene).toBe('gallery');
    expect(state.editions[0].groupId).toBe(groups[0].id);
    state = reducer(state, { type: 'RETURN_WORKSPACE' });
    expect(state.scene).toBe('workspace');
    expect(reducer(state, { type: 'BACK' }).scene).toBe('tripShelf');
  });
  it('每一步可返回；取消后不会继续生成', () => {
    const state = reducer(detail(), { type: 'START_PRINT' });
    const back = reducer(state, { type: 'BACK' });
    expect(back.scene).toBe('groupDetail');
    expect(reducer(back, { type: 'ADVANCE_PRINT' })).toEqual(back);
    expect(reducer(reducer(back, { type: 'BACK' }), { type: 'BACK' }).scene).toBe('tripShelf');
  });
  it('未确认、无效组、未完成生成均不能越过流程', () => {
    const unconfirmed = reducer(detail(), { type: 'SET_CONFIRMED', value: false });
    expect(reducer(unconfirmed, { type: 'START_PRINT' })).toEqual(unconfirmed);
    expect(reducer(initialState, { type: 'OPEN_GALLERY' })).toEqual(initialState);
    const workspace = reducer(initialState, { type: 'OPEN_TRIP' });
    expect(reducer(workspace, { type: 'SELECT_GROUP', groupId: 'missing' })).toEqual(workspace);
  });
  it('完成后返回不会重复生成；工作桌可以重访作品', () => {
    let state = reducer(detail(), { type: 'START_PRINT' });
    for (let i = 0; i < 4; i++) state = reducer(state, { type: 'ADVANCE_PRINT' });
    expect(state.editions).toHaveLength(1);
    state = reducer(state, { type: 'OPEN_GALLERY' });
    state = reducer(state, { type: 'BACK' });
    expect(state.scene).toBe('printing');
    expect(state.printStep).toBe(4);
    state = reducer(state, { type: 'RETURN_WORKSPACE' });
    expect(reducer(state, { type: 'OPEN_GALLERY' }).scene).toBe('gallery');
  });
});
