export type TravelStickerKind = 'suitcase' | 'osaka' | 'sea' | 'umbrella' | 'flower';
/** Original lightweight vector stickers; decorative, never substitutes for a photo. */
export function TravelSticker({kind,className=''}:{kind:TravelStickerKind;className?:string}) {
 return <svg className={className} viewBox="0 0 160 120" aria-hidden="true" focusable="false"><use href={`./assets/brand/travel-stickers.svg#${kind}`}/></svg>;
}
