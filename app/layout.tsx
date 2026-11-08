import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"IconNovus — Find the icon. Finish the idea.",description:"A curated marketplace for beautiful, production-ready icons by independent creators.",other:{"codex-preview":"development"},icons:{icon:"/iconnovus-favicon.png",shortcut:"/iconnovus-favicon.png",apple:"/iconnovus-favicon.png"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
