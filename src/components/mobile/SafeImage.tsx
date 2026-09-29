import {useState,type ImgHTMLAttributes} from 'react';
const unavailable='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><rect width="480" height="360" fill="#F6F7EF"/><path d="M178 100h124v94H178Z" fill="none" stroke="#D5B993" stroke-width="4"/><path d="m184 186 35-36 27 21 23-32 26 47" fill="none" stroke="#D5B993" stroke-width="4"/><text x="240" y="240" text-anchor="middle" font-size="21" fill="#6F7E73" font-family="sans-serif">照片暂时无法加载</text></svg>');
/** Keep the original paper geometry and never retry a broken URL in a loop. */
export function SafeImage({src,alt='',onError,decoding='async',style,...props}:ImgHTMLAttributes<HTMLImageElement>){
 const [failedSource,setFailedSource]=useState<string>();const failed=Boolean(src&&failedSource===src);
 return <img {...props} style={failed?{...style,objectFit:'contain',background:'#F6F7EF'}:style} src={failed?unavailable:src} alt={failed&&alt?`${alt}（照片暂时无法加载）`:alt} decoding={decoding} data-image-failed={failed?'true':undefined} onError={e=>{if(!failed)setFailedSource(src);onError?.(e);}}/>;
}
