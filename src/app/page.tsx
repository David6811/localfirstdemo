"use client";

import dynamic from "next/dynamic";
// const PowerSyncComponent = dynamic(() => import("./components/PowerSyncComponent"), { ssr: false });
const NoteSync = dynamic(() => import("./components/NoteSync"), { ssr: false });

export default function Home() {
  
  return (
    <div>
      {/* <PowerSyncComponent /> */}
      <NoteSync />
    </div>
  );
}
