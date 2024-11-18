"use client";
import styles from "./page.module.css";

import dynamic from "next/dynamic";
const PowerSyncComponent = dynamic(() => import("./components/PowerSyncComponent"), { ssr: false });

export default function Home() {
  
  return (
    <div className={styles.page}>
      <PowerSyncComponent />
    </div>
  );
}
