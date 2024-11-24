import React, { useEffect, useState } from "react";
import "./index.css";
import { User } from "@/app/domain/data/models/User";
import { setupPowerSync, watchLists } from "@/app/services/powersync";

export default function NoteSync() {
    const [data, setData] = useState<User[] | null>(null);

    // Function to handle updates when the note is edited
    const handleNoteChange = (id: string, newNote: string) => {
        console.log(`Note changed for user ${id}:`, newNote); // Log the change
        setData((prevData) => {
            if (prevData) {
                return prevData.map((user) =>
                    user.id === id ? { ...user, note: newNote } : user
                );
            }
            return prevData;
        });
    };

    const handleUpdate = (update: User[]) => {
        console.log("Received update:", update);
        setData(update);
    };

    useEffect(() => {
        const initPowerSync = async () => {
            await setupPowerSync();
        };

        initPowerSync();

        watchLists(handleUpdate).catch((err) => {
            console.error("Error watching lists:", err);
        });
    }, []);

    return (
        <div>
            <div className="customer-list">
                {data && data.length > 0 ? (
                    <ul>
                        {data.map((item) => (
                            <li key={item.id} className="list-item">
                                <div className="info-card">
                                    <div className="info-item">
                                        <strong>ID:</strong> {item.id}
                                    </div>
                                    <div className="info-item">
                                        <strong>Name:</strong> {item.name}
                                    </div>
                                    <div className="info-item">
                                        <strong>Email:</strong> {item.email}
                                    </div>
                                </div>
                                <textarea
                                    className="item-note"
                                    value={item.note || ""}
                                    onChange={(e) =>
                                        handleNoteChange(item.id, e.target.value)
                                    }
                                    placeholder="Write a note..."
                                />
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
