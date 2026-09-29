import {describe,it,expect} from 'vitest';
import {initialState,reducer,resolveGroup} from '../src/state/flow';
import {printSteps} from '../src/data/mock';
const start=()=>reducer(reducer(reducer(initialState,{type:'OPEN_TRIP'}),{type:'SELECT_GROUP',groupId:'osaka-spring'}),{type:'START_PRINT'});
describe('printing lifecycle',()=>{
 it('has four stages and creates one edition only after completion',()=>{
  expect(printSteps).toEqual(['整理照片顺序','提取旅行元素','制作贴纸与拼贴','生成社交配文']);
  let state=start();for(let i=0;i<3;i++)state=reducer(state,{type:'ADVANCE_PRINT'});
  expect(state.editions).toHaveLength(0);
  state=reducer(state,{type:'ADVANCE_PRINT'});expect(state.printStatus).toBe('complete');expect(state.editions).toHaveLength(1);
  expect(reducer(state,{type:'ADVANCE_PRINT'})).toBe(state);
 });
 it('failure stops progress and retry preserves edits, clears failure and creates no duplicate',()=>{
  let state=reducer(start(),{type:'BACK'});state=reducer(state,{type:'EDIT_GROUP',edit:{type:'rename',name:'红色收藏'}});
  state=reducer(state,{type:'START_PRINT'});state=reducer(state,{type:'ADVANCE_PRINT'});state=reducer(state,{type:'FAIL_PRINT'});
  expect(state.printStatus).toBe('failed');expect(state.editions).toHaveLength(0);expect(reducer(state,{type:'ADVANCE_PRINT'})).toBe(state);
  expect(reducer(state,{type:'OPEN_GALLERY'})).toBe(state);
  state=reducer(state,{type:'RETRY_PRINT'});expect(state.printStep).toBe(0);expect(state.printStatus).toBe('running');expect(resolveGroup(state,state.selectedGroupId)!.name).toBe('红色收藏');
  for(let i=0;i<4;i++)state=reducer(state,{type:'ADVANCE_PRINT'});
  state=reducer(state,{type:'OPEN_GALLERY'});expect(state.scene).toBe('gallery');expect(state.editions).toHaveLength(1);
  state=reducer(state,{type:'BACK'});expect(state.scene).toBe('printing');expect(state.printAutoEnter).toBe(false);
  expect(reducer(state,{type:'RETRY_PRINT'})).toBe(state);
 });
 it('cancelling prevents delayed progress or failures, fresh print restarts',()=>{
  let state=reducer(start(),{type:'ADVANCE_PRINT'});state=reducer(state,{type:'BACK'});
  expect(reducer(state,{type:'ADVANCE_PRINT'})).toBe(state);expect(reducer(state,{type:'FAIL_PRINT'})).toBe(state);
  state=reducer(state,{type:'START_PRINT'});expect(state.printStep).toBe(0);expect(state.printStatus).toBe('running');expect(state.printAutoEnter).toBe(true);
 });
});
