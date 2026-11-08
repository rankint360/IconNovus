"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Submission={id:number;name:string;category:string;style:string;priceCents:number;formats:string;creatorEmail:string;originalFilename:string;status:string;createdAt:string};

export default function AdminReview(){
 const [rows,setRows]=useState<Submission[]>([]),[message,setMessage]=useState("Loading submissions…"),[busy,setBusy]=useState<number|null>(null);
 async function load(){
  setMessage("Loading submissions…");
  const response=await fetch("/api/admin/icons");
  const data=await response.json() as {icons?:Submission[];error?:string};
  if(!response.ok){setMessage(data.error||"Could not load submissions.");return}
  setRows(data.icons||[]);setMessage(data.icons?.length?"":"No submissions yet.");
 }
 useEffect(()=>{void load()},[]);
 async function review(id:number,status:"published"|"rejected"){
  setBusy(id);
  const response=await fetch("/api/admin/icons",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,status})});
  if(response.ok) setRows(r=>r.map(x=>x.id===id?{...x,status}:x));
  else setMessage("The review decision could not be saved.");
  setBusy(null);
 }
 return <main className="admin-shell">
  <header className="admin-header"><div><img className="admin-brand-logo" src="/iconnovus-logo.png" alt="IconNovus"/><div><b>Review desk</b><small>Catalogue administration</small></div></div><a href="/"><ArrowLeft/> Marketplace</a></header>
  <section className="admin-content"><div className="admin-title"><div><h1>Icon submissions</h1><p>Approve original work before it appears in the live catalogue.</p></div><Button variant="outline" onClick={load}><RefreshCw/> Refresh</Button></div>
   {message&&<div className="admin-message">{message}</div>}
   {rows.length>0&&<div className="review-table"><div className="review-head"><span>Icon</span><span>Creator</span><span>Details</span><span>Status</span><span>Review</span></div>{rows.map(row=><div className="review-row" key={row.id}><span><b>{row.name}</b><small>{row.originalFilename}</small></span><span>{row.creatorEmail}</span><span>{row.category} · {row.style}<small>{(row.priceCents/100).toFixed(2)} USD · {row.formats}</small></span><span><i className={row.status}>{row.status}</i></span><span>{row.status==="pending"?<><button disabled={busy===row.id} className="approve" onClick={()=>review(row.id,"published")}><Check/> Approve</button><button disabled={busy===row.id} className="reject" onClick={()=>review(row.id,"rejected")}><X/> Reject</button></>:<small>Reviewed</small>}</span></div>)}</div>}
  </section>
 </main>
}
