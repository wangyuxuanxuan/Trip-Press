/** Lightweight vector postcards for the import illustration, not album photos. */
export function TravelPostcardArt({place}:{place:'osaka'|'qingdao'|'kyoto'}){
 return <svg viewBox="0 0 160 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <path fill={place==='kyoto'?'#DDF5E9':'#9ADEFA'} d="M0 0h160v190H0z"/>
  <circle cx="127" cy="26" r="13" fill="#FFE586"/>
  <path d="M9 25q4-13 13-6 11-11 18 6H9Zm65 20q5-13 14-6 12-9 18 6H74Z" fill="#fff" opacity=".92"/>
  {place==='osaka'?<>
   <path d="M0 63h35v127H0zM116 44h44v146h-44z" fill="#F7B59B"/><path d="M7 54h23v136H7z" fill="#FFF0CE"/>
   <path d="M35 99h27v91H35zM98 73h18v117H98z" fill="#51BDD5"/>
   <path d="m65 116 31-3 28 77H35Z" fill="#F8DFC4"/><path d="m80 129 4 61" stroke="#fff" strokeWidth="3" strokeDasharray="10 9"/>
   <path d="M10 65h13v47H10zM125 52h19v71h-19z" fill="#F86F5B"/><path d="M16 72v33m117-45v52" stroke="#FFEBC5" strokeWidth="3" strokeDasharray="4 4"/>
   <path d="m25 49 18 4-9-17 26 10L53 27l29 15 20-14-1 17 24-4-9 16 21-4-10 43H40Z" fill="#FFF9DD" stroke="#FF6C53" strokeWidth="5" strokeLinejoin="round"/>
   <path d="M44 53h76v20H44z" fill="#2F84B5"/><text x="82" y="67" fontFamily="sans-serif" fontWeight="700" fontSize="12" textAnchor="middle" fill="#fff">OSAKA</text>
   <path d="M48 78h66v17H48z" fill="#FF6F59"/><text x="81" y="90" fontFamily="sans-serif" fontWeight="700" fontSize="11" textAnchor="middle" fill="#fff">道 顿 堀</text>
   <path d="M0 126h36v21H0zM117 128h43v16h-43z" fill="#FFD666"/><path d="M0 151h33v8H0zm117-4h43v8h-43z" fill="#FF6C59"/>
   <path d="M7 164h20v26H7zM130 159h20v31h-20z" fill="#3D9C9C"/><path d="M51 118v38m57-46v34" stroke="#32586A" strokeWidth="3"/>
   <ellipse cx="51" cy="126" rx="7" ry="10" fill="#FF7158"/><ellipse cx="108" cy="116" rx="7" ry="10" fill="#FF7158"/>
   <path d="M46 123h10m-10 6h10m47-17h10m-10 6h10" stroke="#FFBE88" strokeWidth="2"/>
  </>:place==='qingdao'?<>
   <path fill="#40C3E5" d="M0 72h160v118H0z"/><path d="M0 86q40 8 80-1t80 0M5 111l27-3m67-4 37-4m-77 28 34-5" fill="none" stroke="#D5F8FF" strokeWidth="2"/>
   <path fill="#CFE8E5" d="M105 57h7v18h-7zm11-8h10v27h-10zm14 10h10v15h-10zm14-15h9v30h-9z"/>
   <path d="m0 142 48-30 74 9 38 43v26H0Z" fill="#7DBE78"/><path d="m0 172 41-30 77 24 42 22v2H0" fill="#B1D985"/>
   <path d="M23 119h98v58H23zM53 91h37v48H53z" fill="#FFF3D3"/><path d="m14 121 35-22 43 23 19-15 22 16-5 8H18ZM45 94l26-25 27 25Z" fill="#FF8268"/>
   <path d="M65 69q-1-17 7-17t7 17" fill="#FF8268"/><path d="M72 53V44" stroke="#3B6570" strokeWidth="2"/>
   <path d="M34 136h10v17H34zm20 0h10v17H54zm30 0h10v17H84zm21 0h9v17h-9zM64 103h13v17H64z" fill="#409BA7"/>
   <path d="M65 177v-15q8-14 17 0v15" fill="#3B8190"/><path d="M55 177h34" stroke="#F3C792" strokeWidth="4"/>
   <path d="M8 132v40m126-22v40" stroke="#508F62" strokeWidth="4"/><circle cx="8" cy="132" r="15" fill="#59AC71"/><circle cx="140" cy="148" r="18" fill="#64B47B"/>
  </>:<>
   <path d="M0 56q47 2 80-19t80 7v146H0Z" fill="#B8DD9B"/><path d="M0 122q68-30 160-8v76H0" fill="#91C682"/>
   <path d="m48 190 33-75 20 1 43 74" fill="#EADCB8"/><path d="m0 86 160-5v11L0 97Z" fill="#779989"/>
   <path d="M25 79v67m104-66v57" stroke="#F3EBD3" strokeWidth="8"/><path d="m12 67 21-9 95-2 24 10-10 13-118 2Z" fill="#4D7C70"/><path d="m20 67 118-3" stroke="#86AC8A" strokeWidth="4"/>
   <path d="M8 0q30 52 20 119M133 0q-31 45-15 76" fill="none" stroke="#668E65" strokeWidth="6"/>
   <path d="m25 51 35-24m-40 2L1 15m121 20 35-12" stroke="#668E65" strokeWidth="3"/>
   {[ [9,12],[33,20],[55,13],[69,30],[108,7],[131,11],[150,35],[10,55],[46,43] ].map(([x,y])=><ellipse key={`${x}-${y}`} cx={x} cy={y} rx="17" ry="10" fill={x%2?'#74B778':'#A2D880'} transform={`rotate(-25 ${x} ${y})`}/>)}
   <path d="M69 154h39v8H69zM81 160h15v28H81zM70 184h36v6H70zM74 116h30v35H74z" fill="#C7C5AF"/><path d="M83 125h12v16H83z" fill="#5D7565"/>
   <path d="m62 112 19-11 8-11 8 11 18 10-6 9H68Z" fill="#658A7B"/><path d="m70 111 19-10 17 10" fill="none" stroke="#A3BA96" strokeWidth="3"/>
   <path d="M3 176q20-35 31 7m82-4q14-33 36-18" stroke="#61A875" strokeWidth="9" fill="none"/>
  </>}
 </svg>;
}
