"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { IllustrationArt, illustrationSlugify, illustrations } from "../page";
import { MarketplaceProductPage } from "@/components/marketplace-product-page";

export default function IllustrationDetailPage(){
 const params=useParams<{slug:string}>(),slug=String(params?.slug||"team-planning");
 const item=illustrations.find(x=>illustrationSlugify(x.name)===slug)||illustrations[0];
 const related=useMemo(()=>[...illustrations.filter(x=>x.category===item.category&&x.id!==item.id),...illustrations.filter(x=>x.category!==item.category)].slice(0,8).map(x=>({href:`/illustrations/${illustrationSlugify(x.name)}`,name:x.name,category:x.category,art:<IllustrationArt item={x}/>})),[item]);
 return <MarketplaceProductPage kind="Illustration" item={item} backHref="/illustrations" formats={["SVG","PNG","WEBP","FIGMA"]} details={{SVG:"Editable vector source",PNG:"2400 × 1650 transparent",WEBP:"Optimized for web",FIGMA:"Layered design file"}} art={()=> <IllustrationArt item={item} large/>} related={related}/>;
}
