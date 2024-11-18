"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import "./index.css";
import { User } from "./domain/data/models/User";
import { findUsers, setupPowerSync } from "./services/powersync";

export default function Home() {
  const [data, setData] = useState<User[] | null>(null);

  useEffect(() => {
    const initPowerSync = async () => {
      await setupPowerSync();
      const users = await findUsers();
      console.log("Users:", users);
      setData(users);
    };

    initPowerSync();
  }, []);
  return (
    <div className={styles.page}>
      <div className="customer-list">
        {data && data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item._id} className="list-item">
                <span className="item-name">{item.name}</span>
                <span className="item-email">{item.email}</span>
                <span className="item-id">{item.age}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span>No data available</span>
        )}
      </div>
    </div>
  );
}
