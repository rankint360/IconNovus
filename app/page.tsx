"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine, BadgeCheck, Bell, Box, BriefcaseBusiness, Check, ChevronDown,
  CircleUserRound, CloudUpload, Code2, Coffee, Copy, CreditCard, Download,
  Gamepad2, Grid2X2, Heart, Layers3, Menu, Moon, Palette, Search, Settings2,
  ShoppingBag, Sparkles, Sun, Upload, WandSparkles, X, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

type IconItem={id:number;name:string;category:string;style:string;price:number;formats:string;artist:string;Icon:LucideIcon;new?:boolean};
const items:IconItem[]=[
 {id:1,name:"Magic Spark",category:"Interface",style:"Outline",price:1,formats:"SVG · PNG · WebP · React",artist:"Mira Studio",Icon:WandSparkles,new:true},
 {id:2,name:"Smart Search",category:"Interface",style:"Outline",price:1,formats:"SVG · PNG · WebP · Figma",artist:"Pixel North",Icon:Search},
 {id:3,name:"Creator Badge",category:"Business",style:"Duotone",price:2,formats:"SVG · PNG · WebP · AI",artist:"Mira Studio",Icon:BadgeCheck,new:true},
 {id:4,name:"Cloud Delivery",category:"Technology",style:"Outline",price:1,formats:"SVG · PNG · WebP · React",artist:"Core Icons",Icon:CloudUpload},
 {id:5,name:"Game Controller",category:"Gaming",style:"Rounded",price:2,formats:"SVG · PNG · WebP · EPS",artist:"Shape Dept.",Icon:Gamepad2},
 {id:6,name:"Color Palette",category:"Creative",style:"Rounded",price:1,formats:"SVG · PNG · WebP · Figma",artist:"Mira Studio",Icon:Palette,new:true},
 {id:7,name:"Clean Code",category:"Technology",style:"Outline",price:1,formats:"SVG · PNG · WebP · React",artist:"Dev Shapes",Icon:Code2},
 {id:8,name:"Project Case",category:"Business",style:"Solid",price:2,formats:"SVG · PNG · WebP · AI",artist:"Pixel North",Icon:BriefcaseBusiness},
 {id:9,name:"Settings Flow",category:"Interface",style:"Duotone",price:1,formats:"SVG · PNG · WebP · React",artist:"Core Icons",Icon:Settings2,new:true},
 {id:10,name:"Layer Stack",category:"Creative",style:"Solid",price:2,formats:"SVG · PNG · WebP · EPS",artist:"Shape Dept.",Icon:Layers3},
 {id:11,name:"Idea Box",category:"Business",style:"Rounded",price:1,formats:"SVG · PNG · WebP · Figma",artist:"Mira Studio",Icon:Box},
 {id:12,name:"Coffee Break",category:"Lifestyle",style:"Outline",price:1,formats:"SVG · PNG · WebP · EPS",artist:"Soft Corner",Icon:Coffee},
 {id:13,name:"Quick Upload",category:"Interface",style:"Rounded",price:1,formats:"SVG · PNG · WebP · React",artist:"Core Icons",Icon:Upload,new:true},
 {id:14,name:"Notifications",category:"Interface",style:"Outline",price:1,formats:"SVG · PNG · WebP · Figma",artist:"Pixel North",Icon:Bell},
 {id:15,name:"App Grid",category:"Technology",style:"Duotone",price:2,formats:"SVG · PNG · WebP · React",artist:"Dev Shapes",Icon:Grid2X2},
];
const categories=["All","Interface","Technology","Business","Creative","Gaming","Lifestyle"];
const styles=["All styles","Outline","Rounded","Duotone","Solid"];
const money=(n:number)=>`$${n.toFixed(2)}`;

function Logo(){return <span className="brand"><img className="brand-logo" src="/iconnovus-logo.png" alt="IconNovus"/></span>}
function ItemGlyph({item,size=56,stroke=1.8,color="#11152A"}:{item:IconItem;size?:number;stroke?:number;color?:string}){return <item.Icon size={size} strokeWidth={stroke} color={color}/>}
function MovingIconGrid(){
 const stream=[...items,...items];
 return <div className="moving-grid" aria-hidden="true">
  {[0,1,2].map(row=><div className={`moving-row row-${row+1}`} key={row}><div className="moving-track">{stream.map((item,index)=><span className="moving-tile" key={`${row}-${index}`}><item.Icon/><i>{item.name}</i></span>)}</div></div>)}
 </div>
}

export default function Home(){
 const [query,setQuery]=useState(""),[category,setCategory]=useState("All"),[style,setStyle]=useState("All styles");
 const [selected,setSelected]=useState<IconItem|null>(null),[cart,setCart]=useState<IconItem[]>([]),[paid,setPaid]=useState<IconItem[]>([]);
 const [cartOpen,setCartOpen]=useState(false),[accountOpen,setAccountOpen]=useState(false),[uploadOpen,setUploadOpen]=useState(false),[checkout,setCheckout]=useState(false);
 const [tip,setTip]=useState(2),[size,setSize]=useState(64),[stroke,setStroke]=useState(1.8),[color,setColor]=useState("#11152A"),[dark,setDark]=useState(false),[mobile,setMobile]=useState(false),[copied,setCopied]=useState<number|null>(null);
 const [uploadStatus,setUploadStatus]=useState("");
 const shown=useMemo(()=>items.filter(i=>(i.name+" "+i.category+" "+i.artist).toLowerCase().includes(query.toLowerCase())&&(category==="All"||i.category===category)&&(style==="All styles"||i.style===style)),[query,category,style]);
 const total=cart.reduce((s,i)=>s+i.price,0)+tip;
 function add(i:IconItem){setCart(c=>c.some(x=>x.id===i.id)?c:[...c,i]);setCartOpen(true)}
 function copy(i:IconItem){navigator.clipboard.writeText(`<${i.name.replaceAll(" ","")} size={24} />`);setCopied(i.id);setTimeout(()=>setCopied(null),1200)}
 function download(i:IconItem){setSelected(i);setTimeout(()=>{const svg=document.querySelector("#download-source svg")?.cloneNode(true) as SVGElement|undefined;if(!svg)return;svg.setAttribute("xmlns","http://www.w3.org/2000/svg");svg.setAttribute("width",String(size));svg.setAttribute("height",String(size));svg.setAttribute("stroke",color);svg.setAttribute("stroke-width",String(stroke));const u=URL.createObjectURL(new Blob([svg.outerHTML],{type:"image/svg+xml"}));const a=document.createElement("a");a.href=u;a.download=i.name.toLowerCase().replaceAll(" ","-")+".svg";a.click();URL.revokeObjectURL(u)},120)}
 function finish(e:React.FormEvent){e.preventDefault();setPaid(cart);setCart([]);setCheckout(false);setCartOpen(false);setAccountOpen(true)}
 async function submitIcon(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setUploadStatus("Uploading securely…");
  const response=await fetch("/api/submissions",{method:"POST",body:new FormData(e.currentTarget)});
  const data=await response.json() as {error?:string};
  if(!response.ok){setUploadStatus(data.error||"Upload failed. Please try again.");return}
  setUploadStatus("Submitted successfully. Your icon is waiting for review.");
  e.currentTarget.reset();
 }
 return <main className={dark?"dark-ui":""}>
  <header className="topbar">
   <a href="#"><Logo/></a>
   <nav className={mobile?"open":""}><a href="/" className="active">Home</a><a href="/icons">Icons</a><a href="/brand-logos">Brand Logos</a><a href="/illustrations">Illustrations</a><a href="#sell">Creators</a></nav>
   <div className="top-actions">
    <button className="plain-icon" onClick={()=>setDark(!dark)} aria-label="Toggle theme">{dark?<Sun/>:<Moon/>}</button>
    <button className="plain-icon" onClick={()=>setAccountOpen(true)} aria-label="Your downloads"><CircleUserRound/></button>
    <button className="cart" onClick={()=>setCartOpen(true)}><ShoppingBag/><span>Cart</span>{cart.length>0&&<b>{cart.length}</b>}</button>
    <button className="plain-icon mobile-menu" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
   </div>
  </header>

  <section className="home-hero">
   <MovingIconGrid/>
   <div className="hero-shade"/>
   <div className="hero-content">
    <span className="hero-pill"><Sparkles/> CURATED ICON MARKETPLACE</span>
    <h1>Your next idea starts<br/>with the <em>right icon.</em></h1>
    <p>Explore original, production-ready icons created for interfaces, products and brands.</p>
    <div className="hero-search">
     <Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(window.location.href=`/icons?q=${encodeURIComponent(query)}`)} placeholder="Search 3,000+ icons and collections…"/><kbd>/</kbd>
     <button onClick={()=>window.location.href=`/icons?q=${encodeURIComponent(query)}`}>Find icons</button>
    </div>
    <div className="hero-actions"><a className="primary-action" href="/icons">Browse icons <ArrowDownToLine/></a><button className="secondary-action" onClick={()=>setUploadOpen(true)}><Upload/> Submit an icon</button></div>
    <div className="hero-proof"><span><BadgeCheck/> Commercial licensing</span><span><Download/> Instant formats</span><span><Sparkles/> Independent creators</span></div>
   </div>
  </section>

  <section className="home-recent" id="collections">
   <div className="library-intro"><div><span className="overline">RECENTLY ADDED</span><h2>Fresh from our creators</h2></div><p>Newly approved icons, ready for your next project.</p></div>
   <div className="recent-grid">{items.slice(0,12).map(i=><article className="icon-card" key={i.id}>
      <a className="visual" href={`/icons/${i.name.toLowerCase().replaceAll(" ","-")}`} aria-label={`Open ${i.name}`}><ItemGlyph item={i}/>{i.new&&<span>NEW</span>}</a>
      <div className="card-name"><div><b>{i.name}</b><small>{i.artist}</small></div><strong>{money(i.price)}</strong></div>
      <div className="card-actions"><button onClick={()=>copy(i)}>{copied===i.id?<Check/>:<Copy/>}<span>{copied===i.id?"Copied":"Copy"}</span></button><a href={`/icons/${i.name.toLowerCase().replaceAll(" ","-")}`}><ArrowDownToLine/><span>Get icon</span></a></div>
    </article>)}</div>
   <a className="view-all" href="/icons">View all icons <ArrowDownToLine/></a>
  </section>

  <section className="creator-strip" id="sell"><div><span className="overline">ICONNOVUS FOR CREATORS</span><h2>Original work should keep earning.</h2><p>Upload your icon sets, pass a straightforward review, and receive 75% from each sale.</p></div><button onClick={()=>setUploadOpen(true)}>Start selling <ArrowDownToLine/></button></section>
  <footer id="license"><Logo/><p>Thoughtful assets for people who make things.</p><nav><a href="/icons">Icons</a><a href="/brand-logos">Brand Logos</a><a href="/illustrations">Illustrations</a></nav><small>© 2026 IconNovus</small></footer>

  <Sheet open={!!selected} onOpenChange={o=>!o&&setSelected(null)}><SheetContent className="detail-sheet">{selected&&<>
   <SheetHeader><SheetTitle>{selected.name}</SheetTitle><SheetDescription>by {selected.artist} · {selected.category}</SheetDescription></SheetHeader>
   <div className="detail-body">
    <div className="detail-preview" id="download-source"><ItemGlyph item={selected} size={size} stroke={stroke} color={color}/></div>
    <div className="format-row"><button className="active">SVG</button><button>PNG</button><button>WebP</button><button>React</button></div>
    <div className="control"><label><span>Size</span><b>{size}px</b></label><Slider min={24} max={160} step={8} value={[size]} onValueChange={v=>setSize(v[0])}/></div>
    <div className="control"><label><span>Stroke</span><b>{stroke.toFixed(1)}px</b></label><Slider min={1} max={3} step={.1} value={[stroke]} onValueChange={v=>setStroke(v[0])}/></div>
    <div className="color-control"><span>Color</span><div>{["#11152A","#5B5FEF","#24D6A1","#F05252"].map(c=><button key={c} className={color===c?"selected":""} style={{background:c}} onClick={()=>setColor(c)}/>)}<input type="color" value={color} onChange={e=>setColor(e.target.value)}/></div></div>
    <div className="license-note"><BadgeCheck/><div><b>Commercial license included</b><span>Personal and commercial projects.</span></div></div>
    <div className="creator-credit"><span>MS</span><div><b>{selected.artist}</b><small>Verified IconNovus creator</small></div><BadgeCheck/></div>
   </div>
   <div className="sheet-actions"><Button variant="outline" onClick={()=>copy(selected)}><Copy/> Copy React</Button><Button onClick={()=>add(selected)}><ShoppingBag/> Add to cart · {money(selected.price)}</Button></div>
  </>}</SheetContent></Sheet>

  <Dialog open={cartOpen} onOpenChange={setCartOpen}><DialogContent className="cart-modal"><DialogHeader><DialogTitle>Your cart</DialogTitle><DialogDescription>Instant downloads with a commercial license.</DialogDescription></DialogHeader>{cart.length?<><div className="cart-list">{cart.map(i=><div key={i.id}><span><ItemGlyph item={i} size={25}/></span><div><b>{i.name}</b><small>{i.formats}</small></div><strong>{money(i.price)}</strong><button onClick={()=>setCart(c=>c.filter(x=>x.id!==i.id))}><X/></button></div>)}</div><div className="tip-box"><div><Heart/><span><b>Tip the creators</b><small>Optional and shared with the artists</small></span></div><div>{[0,2,5].map(n=><button className={tip===n?"active":""} onClick={()=>setTip(n)} key={n}>{n?`$${n}`:"No tip"}</button>)}</div></div><div className="cart-total"><span>Total</span><b>${total.toFixed(2)}</b></div><Button size="lg" onClick={()=>setCheckout(true)}>Continue to checkout</Button><small className="test-note">Test checkout — no real payment is collected.</small></>:<div className="empty small"><ShoppingBag/><h3>Your cart is empty</h3><p>Select “Get icon” to see details and add an icon.</p></div>}</DialogContent></Dialog>

  <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent><DialogHeader><DialogTitle>Test checkout</DialogTitle><DialogDescription>Validate the purchase journey without charging a card.</DialogDescription></DialogHeader><form className="form" onSubmit={finish}><label>Email<input type="email" required placeholder="you@example.com"/></label><label>Card number<div><CreditCard/><input required placeholder="4242 4242 4242 4242" pattern="[0-9 ]{15,19}"/></div></label><div className="two"><label>Expiry<input required placeholder="12/29"/></label><label>CVC<input required placeholder="123"/></label></div><Button size="lg">Complete test purchase · ${total.toFixed(2)}</Button><small><BadgeCheck/> No card data is stored.</small></form></DialogContent></Dialog>

  <Dialog open={accountOpen} onOpenChange={setAccountOpen}><DialogContent><DialogHeader><DialogTitle>Your downloads</DialogTitle><DialogDescription>Purchased icons stay available during this preview session.</DialogDescription></DialogHeader>{paid.length?<div className="download-list">{paid.map(i=><div key={i.id}><span><ItemGlyph item={i} size={26}/></span><div><b>{i.name}</b><small>SVG · PNG · WebP · Commercial license</small></div><Button variant="outline" onClick={()=>download(i)}><Download/> Download</Button></div>)}</div>:<div className="empty small"><Download/><h3>No downloads yet</h3><p>Purchased icons will appear here.</p></div>}</DialogContent></Dialog>

  <Dialog open={uploadOpen} onOpenChange={o=>{setUploadOpen(o);if(!o)setUploadStatus("")}}><DialogContent><DialogHeader><DialogTitle>Submit an icon</DialogTitle><DialogDescription>Upload original work for marketplace review.</DialogDescription></DialogHeader><form className="form" onSubmit={submitIcon}><label>Icon name<input name="name" required placeholder="Example: Analytics dashboard"/></label><div className="two"><label>Category<select name="category" required>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Style<select name="style" required>{styles.slice(1).map(s=><option key={s}>{s}</option>)}</select></label></div><div className="two"><label>Price<select name="priceCents" defaultValue="100"><option value="0">Free</option><option value="100">$1.00</option><option value="200">$2.00</option><option value="500">$5.00</option></select></label><label>Portfolio URL<input name="portfolioUrl" type="url" placeholder="https://"/></label></div><label className="dropzone"><Upload/><b>Choose icon files</b><small>SVG, PNG, WEBP or ZIP · up to 10 MB</small><input name="file" type="file" accept=".svg,.png,.webp,.zip" required/></label><label>Notes for the reviewer<textarea name="description" placeholder="Mention the icon set, license ownership or variations."/></label>{uploadStatus&&<p className="form-status">{uploadStatus}</p>}<Button size="lg">Submit for review</Button></form></DialogContent></Dialog>
 </main>
}
