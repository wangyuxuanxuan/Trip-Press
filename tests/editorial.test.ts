import {describe,it,expect} from 'vitest';
import {editorialPhotos,editorialGroups,stickersForPhoto} from '../src/data/editorial';
import {initialState,reducer,resolveGroup} from '../src/state/flow';
import {createEdition,photoById} from '../src/data/mock';
describe('source-connected editorial editions',()=>{
 it('every recommended photograph has at least one matching sticker and a real source',()=>{
  for(const photo of editorialPhotos.filter(p=>p.selection==='recommended')){
   expect(stickersForPhoto(photo.id).length).toBeGreaterThan(0);
   expect(photo.source).toMatch(/^https:\/\/www.pexels.com\/photo\//);
   expect(photoById(photo.id)?.id).toBe(photo.id);
  }
 });
 it('opens a curated album, prints only its actual pages, and returns to the same trip',()=>{
  let state=reducer(initialState,{type:'OPEN_TRIP',tripId:'fuji-notes'});
  state=reducer(state,{type:'SELECT_GROUP',groupId:'osaka-spring'});
  expect(resolveGroup(state,state.selectedGroupId)?.name).toContain('海岸');
  state=reducer(state,{type:'START_PRINT'});
  for(let i=0;i<4;i++)state=reducer(state,{type:'ADVANCE_PRINT'});
  expect(state.editions[0]?.artworks.filter(a=>a.kind==='carousel')).toHaveLength(9);
  state=reducer(state,{type:'OPEN_COLLECTION',scope:'fuji-notes'});
  state=reducer(state,{type:'OPEN_PACKAGE',id:state.editions[0].id});
  expect(state.activeTripId).toBe('osaka-2026');
 });
 it('does not silently insert unused photos into a publication',()=>{
  const edition=createEdition(editorialGroups.find(g=>g.id==='alpine-lake')!,1);
  expect(edition.photoIds).toEqual(editorialGroups.find(g=>g.id==='alpine-lake')!.photoIds);
  expect(edition.photoIds).not.toContain('editorial-29735715');
  expect(edition.artworks.some(a=>a.kind==='stickers')).toBe(true);
 });
});
