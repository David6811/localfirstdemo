"use client";
import React, { useEffect, useState } from "react";
import "./index.css";
import { setupPowerSync, watchLists } from "../services/powersync";
import { User } from "../domain/data/models/User";
import ProfileClient from "./Profile/ProfileClient";

const App: React.FC = () => {
  const [data, setData] = useState<User[] | null>(null);

  const handleUpdate = (update: User[]) => {
    console.log('Received update:', update);
    setData(update);
  };
  

  useEffect(() => {
    const initPowerSync = async () => {
      await setupPowerSync();
      // const users = await findUsers();
      // console.log("Users:", users);
      // setData(users);
    };

    initPowerSync();

    watchLists(handleUpdate).catch((err) => {
      console.error('Error watching lists:', err);
    });


  }, []);
  return (
    <div>
      <ProfileClient />
      <div className="customer-list">
        {data && data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item.id} className="list-item">
                <span className="item-name">{item.id}</span>
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
      <div>
        <a href="/api/auth/login">Login</a>
      </div>
      <div>
        <a href="/api/auth/logout">Logout</a>
      </div>
    </div>
  );
}

export default App;
