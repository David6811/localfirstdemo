import React, { useEffect, useState } from "react";
import "./index.css";
import { User } from "@/app/domain/data/models/User";
import { setupPowerSync, updateNote, watchLists } from "@/app/services/powersync";

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

    const handleUpdate = () => {
        if (data) {
            console.log("Updating notes:", data);
            data.forEach(({ id, note }) => {
                if (id && note) {
                    updateNote(note, id).catch((err) =>
                        console.error(`Error updating note for user ${id}:`, err)
                    );
                } else {
                    console.warn(`Missing id or note for update:`, { id, note });
                }
            });
        } else {
            console.warn("No data to update.");
        }
    };

    useEffect(() => {
        const initPowerSync = async () => {
            await setupPowerSync();
        };

        initPowerSync();

        watchLists((update) => {
            console.log("Received update:", update);
            setData(update);
        }).catch((err) => {
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
            <button onClick={handleUpdate} className="update-button">
                Update Notes
            </button>
        </div>
    );
}
