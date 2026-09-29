export type Scene = 'tripShelf' | 'workspace' | 'groupDetail' | 'printing' | 'gallery' | 'stickerCollection';
export type GroupCategory = 'recommended' | 'color' | 'people' | 'theme';
export interface Photo { id: string; tripId: string; label: string; src: string; takenAt: string; location: string; }
export interface Trip { id: string; name: string; date: string; photoCount: number; }
export interface PhotoGroup { id: string; tripId: string; name: string; category: GroupCategory; description: string; photoIds: string[]; cover?: string; }
export type CaptionTone='natural'|'fun'|'mood';
export type EditionLayout='journal'|'poster'|'postcard';
export interface Artwork { id: string; kind: 'cover' | 'carousel' | 'stickers' | 'collage' | 'caption'; title: string; description: string; slideIndex?:number; }
export interface Edition { sourceSignature?:string;photoIds:string[];layout:EditionLayout;captionTone:CaptionTone;captions:Record<CaptionTone,string>; id: string; groupId: string; title: string; artworks: Artwork[]; caption: string; }
