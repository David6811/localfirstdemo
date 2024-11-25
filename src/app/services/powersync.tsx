import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { AppSchema } from "../domain/data/schema/users_schema";
import { User } from "../domain/data/models/User";


class Connector {
    constructor() { }

    async fetchCredentials() {
        return {
            endpoint: POWERSYNC_ENDPOINT,
            token: POWERSYNC_TOKEN
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase) {
        console.log("Trying to upload data to server...", database);
        const transaction = await database.getNextCrudTransaction();
        if (!transaction) {
            console.log("No transactions!");
            return;
        }

        for (const operation of transaction.crud) {
            const { op: opType, table } = operation;
            console.log("op", { op: opType, table });
            
            const opData = operation.opData ? operation.opData : {}
            console.log("opData: ", opData);
            if (opType == "PUT") {
                await transaction.complete();
            }

            else if (opType == "PATCH") {
                //saveNoteToMongo(powersyncNote);
              await await callPutApi({ "userId": operation.id , "note": opData.note } );
              await transaction.complete();
            }

        }
    }
}

async function callPutApi(opData: any) {
    try {
        // Assuming your API is at '/api/put-endpoint' (adjust the URL as needed)
        const response = await fetch('/api/crud', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opData),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("PUT API response: ", result);
        return result;
    } catch (error) {
        console.error("Error calling PUT API:", error);
        throw error;
    }
}



export const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
        dbFilename: 'users.db'
    },
    flags: {
        enableMultiTabs: true
    }
});

export const setupPowerSync = async () => {
    const connector = new Connector();
    db.connect(connector);
};

export const findUsers = async (): Promise<User[]> => {
    const result = await db.getAll('SELECT * FROM users');
    return result as User[];
};

// Watch changes to lists
const abortController = new AbortController();

export const watchLists = async (onUpdate: (updates: User[]) => void): Promise<void> => {
    for await (const { rows } of db.watch('SELECT * FROM users', [], { signal: abortController.signal })) {
        const updates = rows?._array ?? [];
        if (updates.length > 0) {
            onUpdate(updates);
        }
    }
};


export const updateNote = async (note: string, id: string) => {
    console.log(`UPDATE users SET note = ? WHERE id = ?`);
    await db.execute(
        `UPDATE users SET note = ? WHERE id = ?`,
        [note, id]
    );
    console.log(`Note updated successfully for ID: ${id}`);
};






