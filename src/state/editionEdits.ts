import type {CaptionTone,Edition,EditionLayout} from '../domain/types';
export type EditionEdit={type:'title'|'caption';value:string}|{type:'tone';value:CaptionTone}|{type:'layout';value:EditionLayout};
export function editEdition(edition:Edition,edit:EditionEdit):Edition{
 if(edit.type==='title'){const title=edit.value.trim();return !title||title.length>40||title===edition.title?edition:{...edition,title};}
 if(edit.type==='caption'){const caption=edit.value.trim();return !caption||caption.length>500||caption===edition.caption?edition:{...edition,caption,captions:{...edition.captions,[edition.captionTone]:caption}};}
 if(edit.type==='tone')return edit.value===edition.captionTone?edition:{...edition,captionTone:edit.value,caption:edition.captions[edit.value]};
 if(edit.type==='layout')return edit.value===edition.layout?edition:{...edition,layout:edit.value};
 return edition;
}
