import {describe,it,expect} from 'vitest';
import {editorialGroupsForMode,editorialPhotos,curatedTrip,stickersForTrip} from '../src/data/editorial';
import {shelfTrips} from '../src/data/tripShelf';
import {initialState,reducer} from '../src/state/flow';
describe('share-ready journeys',()=>{
 it('has one substantial recommended set and no tiny visible groups',()=>{
  expect(shelfTrips).toHaveLength(3);
  for(const trip of shelfTrips){
   expect(editorialGroupsForMode('recommended',trip.id)).toHaveLength(1);
   for(const mode of ['recommended','people','theme','color'] as const)for(const g of editorialGroupsForMode(mode,trip.id))expect(new Set(g.photoIds).size).toBeGreaterThanOrEqual(4);
  }
 });
 it('reuses the coast, wave, flower and railway sources with their stickers',()=>{
  for(const id of ['13193404','18546565','19137460','16660722','4321815']){
   const p=editorialPhotos.find(p=>p.id===`editorial-${id}`)!;
   expect(shelfTrips.some(t=>t.id===p.tripId)).toBe(true);
   expect(editorialGroupsForMode('recommended',p.tripId).some(g=>g.photoIds.includes(p.id))).toBe(true);
  }
  expect(stickersForTrip(curatedTrip('japan-coast')).some(s=>s.id==='blue-train')).toBe(true);
 });
 it('opens sharing without printing, preserves order and reuses an unchanged package',()=>{
  let s=reducer(initialState,{type:'OPEN_TRIP'});
  const g=editorialGroupsForMode('recommended',s.activeTripId)[0];
  s=reducer(s,{type:'SELECT_GROUP',groupId:g.id});
  s=reducer(s,{type:'PREPARE_SHARE'});
  expect(s.scene).toBe('gallery');expect(s.editions[0].photoIds).toEqual(g.photoIds);
  const id=s.activeEditionId;s=reducer(s,{type:'BACK'});expect(s.scene).toBe('groupDetail');
  s=reducer(s,{type:'PREPARE_SHARE'});expect(s.activeEditionId).toBe(id);expect(s.editions).toHaveLength(1);
  s=reducer(s,{type:'EDIT_EDITION',edit:{type:'title',value:'我自己的标题'}});
  s=reducer(s,{type:'EDIT_EDITION',edit:{type:'caption',value:'想分享的那一天。'}});
  s=reducer(s,{type:'BACK'});s=reducer(s,{type:'PREPARE_SHARE'});
  expect(s.editions).toHaveLength(1);expect(s.editions[0].title).toBe('我自己的标题');expect(s.editions[0].caption).toBe('想分享的那一天。');
  s=reducer(s,{type:'BACK'});s=reducer(s,{type:'EDIT_GROUP',edit:{type:'reorder',photoIds:[...g.photoIds].reverse()}});s=reducer(s,{type:'PREPARE_SHARE'});
  expect(s.editions).toHaveLength(2);expect(s.editions[1].photoIds).toEqual([...g.photoIds].reverse());
  expect(reducer(initialState,{type:'PREPARE_SHARE'})).toEqual(initialState);
 });
});
