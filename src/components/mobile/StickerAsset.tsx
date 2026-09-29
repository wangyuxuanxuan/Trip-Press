import styles from './mobile.module.css';
export type StickerMotif = 'sun' | 'leaf' | 'house';
/** Small supporting motifs with a white cut-out edge; never a photo substitute. */
export function StickerAsset({ motif, label, className = '' }: { motif: StickerMotif; label?: string; className?: string }) {
  return <svg className={`${styles.sticker} ${className}`} viewBox="0 0 80 80" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    {motif === 'sun' && <><path d="m40 5 8 13 15-4-1 16 13 10-13 8 1 16-16-2-8 13-8-13-16 2 2-17L5 39l13-8-3-16 16 3Z" fill="#EFDEA9" stroke="white" strokeWidth="5" strokeLinejoin="round" /><circle cx="40" cy="40" r="15" fill="#DDB792" /><path d="m31 40 4 2m9-1 5-2" fill="none" stroke="#F6F7EF" strokeWidth="2" /></>}
    {motif === 'leaf' && <><path d="M40 70c-3-11-3-22 0-33C22 38 12 26 17 12c16-1 24 8 25 19C42 14 55 8 69 12c3 19-8 30-26 29-3 11-3 19 0 29Z" fill="#577E69" stroke="white" strokeWidth="6" strokeLinejoin="round" /><path d="M26 21 40 36m18-14L43 38" stroke="#EFDEA9" fill="none" strokeWidth="2" /></>}
    {motif === 'house' && <><path d="M14 70V32H8L39 9l32 21h-8v40Z" fill="#DDB792" stroke="white" strokeWidth="6" strokeLinejoin="round" /><path d="M11 32 39 12l29 19" fill="none" stroke="#D19081" strokeWidth="8" /><path d="M34 69V49h12v20M23 36h10v9H23m24-9h9v9h-9" fill="#527C8B" /></>}
  </svg>;
}
