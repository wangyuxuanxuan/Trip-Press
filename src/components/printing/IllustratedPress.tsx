import { motion, useReducedMotion } from 'framer-motion';
import type { PrintStatus } from '../../state/flow';
import styles from './printing.module.css';
export function IllustratedPress({status,step}:{status:PrintStatus;step:number}){
 const reduce=useReducedMotion(),working=status==='running';
 return <motion.svg className={styles.machine} viewBox="0 0 340 260" role="img" aria-label="珊瑚红与湖水蓝的旅行印刷机"
  animate={{y:working&&!reduce?[0,-1.5,0,1,0]:0}} transition={{duration:.44,repeat:working&&!reduce?Infinity:0}}>
  <path d="M42 244h257" stroke="#D8B88D" strokeWidth="8" strokeLinecap="round" opacity=".45"/>
  <path d="m78 19 180 3 12 64H66Z" fill="#69CFEA" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
  <path d="m88 29 161 2 5 28H82Z" fill="#2599BE"/>
  <path d="M89 44h151" stroke="#3B5961" strokeWidth="8" strokeLinecap="round"/>
  <path d="M49 73Q46 61 64 62L279 66Q295 66 297 84l13 131q2 18-17 19L48 231Q30 230 33 213Z" fill="#FF7967" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
  <path d="m43 167 260 3 5 48q1 10-16 10L48 225q-12-1-10-12Z" fill="#F06454"/>
  <path d="M64 101q-1-12 10-12l143 2 2 45-153-2Z" fill="#F5FAFD"/>
  <text x="141" y="118" textAnchor="middle" fill="#AD4436" fontFamily="Georgia,serif" fontSize="21" fontWeight="800" letterSpacing="2">TRIP PRESS</text>
  <text x="141" y="130" textAnchor="middle" fill="#17394C" fontSize="6" letterSpacing="2.8">GOOD DAYS, ON PAPER</text>
  <circle cx="257" cy="108" r="17" fill="#FFE17D" stroke="#FFFFFF" strokeWidth="3"/>
  <motion.g animate={{rotate:working&&!reduce?[0,90,180,270,360]:0}} style={{transformOrigin:'257px 108px'}} transition={{duration:1.1,repeat:working&&!reduce?Infinity:0,ease:'linear'}}><path d="M257 97v22m-11-11h22" stroke="#FFB465" strokeWidth="4"/></motion.g>
  <circle cx="242" cy="143" r="5" fill={status==='failed'?'#F5FAFD':'#3BAF79'}/><circle cx="260" cy="143" r="5" fill={step>=2?'#FFE17D':'#FFB465'}/>
  <path d="m63 164 213 2-1 24-214-3Z" fill="#3B5961"/><path d="m65 165 208 2" stroke="#69CFEA" strokeWidth="6"/>
  <path d="m56 208 20 1m187 1 22 1" stroke="#FFB465" strokeWidth="4" strokeLinecap="round"/>
  <path d="M52 232v9h28v-9m178 1v9h29v-9" fill="#3BAF79"/>
  <path d="m292 83 4 65" stroke="#FFB465" strokeWidth="4" strokeLinecap="round" opacity=".7"/>
 </motion.svg>;
}
