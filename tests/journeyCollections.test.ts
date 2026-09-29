import {describe,it,expect} from 'vitest';
import {editorialPhotos,editorialGroups,editorialTrips,stickersForTrip} from '../src/data/editorial';
import {shelfTrips} from '../src/data/tripShelf';
import {groupsForMode} from '../src/data/mock';
import {initialState,reducer} from '../src/state/flow';
import {readCreations,newCreation} from '../src/state/creations';
describe('journey albums and selective grouping',()=>{
 it('keeps Japanese spring destinations and Italian destinations inside their respective journeys',()=>{
  expect(editorialPhotos.find(p=>p.id==='editorial-31418360')?.tripId).toBe('osaka-2026');
  expect(editorialPhotos.find(p=>p.id==='editorial-17815282')?.tripId).toBe(editorialPhotos.find(p=>p.id==='editorial-18118570')?.tripId);
  expect(shelfTrips.some(t=>['fuji-notes','alpine-notes','coastal-notes'].includes(t.id))).toBe(false);
  for(const t of shelfTrips)expect(t.name).toMatch(/^\d{4}\.\d{2} /);
 });
 it('does not fabricate people or force every photograph into each view',()=>{
  expect(groupsForMode('people').length).toBeGreaterThan(0);
  expect(groupsForMode('people').flatMap(g=>g.photoIds)).not.toContain('editorial-31239492');
  const moments=groupsForMode('recommended');
  expect(moments.every(g=>editorialGroups.includes(g))).toBe(true);
  expect(groupsForMode('theme').map(g=>g.id)).not.toEqual(moments.map(g=>g.id));
  expect(groupsForMode('color').map(g=>g.id)).not.toEqual(moments.map(g=>g.id));
  expect(moments.flatMap(g=>g.photoIds)).not.toContain('editorial-4336279');
 });
 it('all shelf journeys have source-linked art and working groups',()=>{
  for(const t of shelfTrips){
   expect(editorialTrips.some(e=>e.id===t.id)).toBe(true);
   expect(stickersForTrip(t.id).length).toBeGreaterThan(0);
   const groups=groupsForMode('recommended',t.id);expect(groups.length).toBeGreaterThan(0);
   for(const g of groups)for(const id of g.photoIds)expect(editorialPhotos.find(p=>p.id===id)?.tripId).toBe(t.id);
  }
 });
 it('migrates old destination links and saved artwork into their journey',()=>{
  expect(reducer(initialState,{type:'OPEN_TRIP',tripId:'fuji-notes'}).activeTripId).toBe('osaka-2026');
  const draft=newCreation('fuji-notes');
  expect(readCreations(JSON.stringify([{...draft,tripId:'fuji-notes'}]))[0]?.tripId).toBe('osaka-2026');
 });
});
