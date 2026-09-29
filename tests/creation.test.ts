import {it,expect} from 'vitest';
import {newCreation,updateCreation,readCreations} from '../src/state/creations';
it('switching the main sticker updates its source photo and clamps controls',()=>{
 const draft=newCreation('osaka');
 const next=updateCreation(draft,{mainId:'blossom',x:500,scale:10,title:'  春天  '});
 expect(next.photoId).toBe('editorial-4058521');
 expect(next.x).toBeLessThanOrEqual(30);
 expect(next.scale).toBeLessThanOrEqual(1.3);
 expect(updateCreation(draft,{mainId:'boats'}).mainId).toBe(draft.mainId);
});
it('saved work survives serialization; corrupt or unknown assets are rejected',()=>{
 const draft=newCreation('fuji-notes');
 expect(readCreations(JSON.stringify([draft]))).toEqual([draft]);
 expect(readCreations('broken')).toEqual([]);
 expect(readCreations(JSON.stringify([{...draft,mainId:'unknown'}]))).toEqual([]);
});
