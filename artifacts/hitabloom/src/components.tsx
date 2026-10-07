import { Link, useLocation } from 'wouter';
import { Activity, Flower2, Flame, Heart, Leaf, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { type AvatarStyle, type CharacterGuide, useDemo } from './data';

export function Brand(){return <Link href="/" className="brand"><span className="brand-mark"><Flower2 size={18}/></span>HitaBloom</Link>}
export function Header(){const [loc]=useLocation();const {state,reset,update}=useDemo();return <header className="topbar"><Brand/><nav className="navlinks"><Link href="/world" className={loc==='/world'?'active':''}>My garden</Link><Link href="/journey" className={loc==='/journey'?'active':''}>My journey</Link><Link href="/cultural" className={loc==='/cultural'?'active':''}>Cultural wellness</Link><Link href="/progress" className={loc==='/progress'?'active':''}>Growth</Link><Link href="/doctor" className={loc==='/doctor'?'active':''}>Dr. Maya</Link></nav><div className="nav-actions"><select aria-label="Choose language" className="language-switcher" value={state.language} onChange={e=>update({language:e.target.value})}>{['English','Hindi','Telugu','Greek','Yoruba'].map(language=><option key={language}>{language}</option>)}</select><span className="pill"><Flame size={14} color="#d4774f"/>{state.streak} day streak</span><span className="pill"><Sparkles size={14} color="#b88c31"/>{state.xp} XP</span><span className="avatar-dot" title="Aarav">A</span><button className="btn secondary small" title="Reset demo" data-testid="button-reset-demo" onClick={reset}><RotateCcw size={14}/> Reset</button></div></header>}
export function Character({label='Lumi'}:{label?:string}){const skin=label==='Moss'?'#a9c69b':label==='Poppy'?'#e5a0b7':'#d8a9da';return <div className="character" style={{background:skin}} role="img" aria-label={`${label}, friendly illustrated health character`}><i className="leaf"/><i className="blush"/></div>}
export function PatientAvatar({style,label='Aarav'}:{style:AvatarStyle;label?:string}){
  return <div className={`patient-avatar expression-${style.expression}`} role="img" aria-label={`${label}'s personalized avatar`}>
    <span className={`avatar-hair hair-${style.hair}`} style={{background:style.hairColor}}/>
    <span className={`avatar-face face-${style.face}`} style={{background:style.skin}}>
      {style.accessory!=='none'&&<i className={`avatar-accessory accessory-${style.accessory}`}/>}
      <i className="avatar-eye left"/><i className="avatar-eye right"/>
      {style.glasses&&<i className="avatar-glasses"/>}
      <i className={`avatar-mouth mouth-${style.expression}`}/>
    </span>
    <span className={`avatar-body outfit-${style.outfit}`}/>
  </div>
}
export function DoctorAvatar({small=false}:{small?:boolean}){
  return <div className={`doctor-avatar ${small?'doctor-avatar-small':''}`} role="img" aria-label="Dr. Maya's avatar"><i className="doctor-hair"/><i className="doctor-face"><b/><b/><em/></i><i className="doctor-coat"><Activity size={13}/></i></div>
}
export function CharacterVideo({guide,playing}:{guide:CharacterGuide;playing:boolean}){if(guide.videoUrl)return <video src={guide.videoUrl} autoPlay={playing} loop muted playsInline style={{maxWidth:'100%',maxHeight:270,borderRadius:18}}/>;return <div className="floating" style={{zIndex:1,animationPlayState:playing?'running':'paused'}}><Character label={guide.name}/></div>}
export function Disclaimer(){return <p className="footer-note">HitaBloom is for learning and wellbeing support only — not diagnosis or treatment. It never prescribes or changes medication. Your named clinician remains the authority for care.</p>}
export function AppFrame({children}:{children:ReactNode}){const {state}=useDemo();return <div className="app-shell"><Header/>{state.notification&&<div role="status" className="notice notification-banner" style={{maxWidth:1110,margin:'12px auto 0',background:'#e6f0df',borderColor:'#6d9b62',color:'#446548'}}>{state.notification.startsWith('Dr. Maya')&&<DoctorAvatar small/>}{state.notification}</div>}{children}</div>}
export function ProgressBar({value}:{value:number}){return <div className="bar"><i style={{width:`${value}%`}}/></div>}
export function TinyGarden(){return <div className="garden-art" aria-label="Illustrated garden in bloom"><div className="hill"/><div className="hill right"/><span className="flower floating" style={{left:'17%',top:'30%'}}>✿</span><span className="flower" style={{left:'43%',top:'50%',fontSize:38}}>✿</span><span className="flower floating" style={{right:'17%',top:'26%',color:'#d77d72'}}>✿</span><span className="float-label" style={{left:'37%',top:'20%'}}>Your garden grows</span><div style={{position:'absolute',zIndex:3,bottom:20,left:'48%',transform:'translateX(-50%)'}}><Character/></div></div>}
export function Metric({icon='leaf',value,label}:{icon?:string;value:string|number;label:string}){let I=icon==='heart'?Heart:icon==='trophy'?Trophy:icon==='activity'?Activity:Leaf;return <div className="panel" style={{display:'flex',alignItems:'center',gap:13,padding:17}}><span className="loc-icon"><I size={20}/></span><div><strong style={{fontSize:20}}>{value}</strong><div className="muted" style={{fontSize:12}}>{label}</div></div></div>}
