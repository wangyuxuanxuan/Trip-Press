const readDataUrl=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('照片读取失败'));reader.readAsDataURL(blob);});
/** Keep the backing canvas clear; only the eight cut-out assets have pixels. */
export async function exportStickers(source:SVGSVGElement,filename="trip-press-osaka-stickers.png"):Promise<void>{
 const svg=source.cloneNode(true) as SVGSVGElement;
 const box=source.viewBox.baseVal;const width=1140,height=Math.round(width*(box.height||1320)/(box.width||1140));
 svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width',String(width));svg.setAttribute('height',String(height));
 await Promise.all(Array.from(svg.querySelectorAll('image')).map(async image=>{
  const href=image.getAttribute('href');if(!href)return;
  const response=await fetch(href);if(!response.ok)throw new Error('照片读取失败');
  image.setAttribute('href',await readDataUrl(await response.blob()));
 }));
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'}));
 let png:Blob;
 try{
  const image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('贴纸绘制失败'));image.src=url;});
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d');if(!context)throw new Error('浏览器暂不支持导出');
  context.drawImage(image,0,0,canvas.width,canvas.height);
  png=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG生成失败')),'image/png'));
 }finally{URL.revokeObjectURL(url);}
 const downloadUrl=URL.createObjectURL(png);const a=document.createElement('a');a.href=downloadUrl;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(downloadUrl),1000);
}
export async function copyCaption(text:string):Promise<boolean>{
 try{await navigator.clipboard.writeText(text);return true;}catch{
  const previous=document.activeElement as HTMLElement|null;
  const input=document.createElement('textarea');input.value=text;input.style.cssText='position:fixed;left:-9999px;top:0;font-size:16px';document.body.append(input);input.select();
  try{return document.execCommand('copy');}catch{return false;}finally{input.remove();previous?.focus({preventScroll:true});}
 }
}
