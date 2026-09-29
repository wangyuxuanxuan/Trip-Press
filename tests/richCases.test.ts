import {describe,it,expect} from 'vitest';
import {editorialPhotos,editorialGroups,editorialGroupsForMode,stickersForPhotos} from '../src/data/editorial';
import {shelfTrips} from '../src/data/tripShelf';
describe('rich journey cases',()=>{
 it('prioritizes three journeys with substantial primary cases',()=>{
  expect(shelfTrips).toHaveLength(3);
  expect(editorialPhotos.filter(p=>p.tripId==='italy-2026').length).toBeGreaterThanOrEqual(16);
  expect(editorialPhotos.filter(p=>p.tripId==='osaka-2026').length).toBeGreaterThanOrEqual(10);
 });
 it('demonstrates four different perspectives on the same Italy collection',()=>{
  const memberships=(['recommended','people','theme','color'] as const).map(mode=>editorialGroupsForMode(mode,'italy-2026'));
  for(const groups of memberships){expect(groups.length).toBeGreaterThanOrEqual(1);expect(groups.every(g=>g.photoIds.length>=2)).toBe(true);}
  const sets=memberships.map(gs=>new Set(gs.flatMap(g=>g.photoIds)));
  expect(sets[0].has('editorial-29735737')).toBe(true);
  expect(sets[1].has('editorial-29735737')).toBe(true);
  expect(sets[1].has('editorial-17815282')).toBe(false);
  expect(sets[2].has('editorial-17815282')).toBe(true);
  expect(sets[3].has('editorial-17815282')).toBe(true);
 });
 it('rich covers have unique elements connected to their source photos',()=>{
  for(const id of ['alpine-lake','italy-boats','italy-facades','italy-together']){
   const g=editorialGroups.find(g=>g.id===id)!;expect(g).toBeDefined();const assets=stickersForPhotos(g.photoIds);
   expect(assets.length).toBeGreaterThanOrEqual(5);expect(new Set(assets.map(s=>s.id)).size).toBe(assets.length);
   expect(assets.every(s=>s.tripId===g.tripId)).toBe(true);
  }
 });
});
