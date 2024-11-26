import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { POWERSYNC_ENDPOINT } from "../config/_powersyncConfig";
import { AppSchema } from "../domain/data/schema/users_schema";
import { NoteUpdateRequest } from "../domain/data/models/OperationModels";
import { Note } from "../domain/data/models/Note";


async function updateNoteInApi(opData: NoteUpdateRequest) {
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


class Connector {
    private accessToken: string;
    constructor(accessToken: string) { 
        console.log("Auth0 access token in Connector: ", accessToken);
        this.accessToken = accessToken;
    }

    async fetchCredentials() {
        return {
            endpoint: POWERSYNC_ENDPOINT,
            token: this.accessToken
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
                const requestData: NoteUpdateRequest = {
                    noteId: operation.id,
                    content: opData.content
                };
                await await updateNoteInApi(requestData);
                await transaction.complete();
            }

        }
    }
}




export const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
        dbFilename: 'notes.db'
    },
    flags: {
        enableMultiTabs: true
    }
});

export const setupPowerSync = async (accessToken : string) => {
    const connector = new Connector(accessToken);
    db.connect(connector);
};

export const findNotes = async (): Promise<Note[]> => {
    const result = await db.getAll('SELECT * FROM notes');
    return result as Note[];
};

// Watch changes to lists
const abortController = new AbortController();

export const watchLists = async (onUpdate: (updates: Note[]) => void): Promise<void> => {
    for await (const { rows } of db.watch('SELECT * FROM notes', [], { signal: abortController.signal })) {
        const updates = rows?._array ?? [];
        if (updates.length > 0) {
            onUpdate(updates);
        }
    }
};


export const updateNote = async (content: string, id: string) => {
    console.log(`UPDATE notes SET content = ? WHERE id = ?`);
    await db.execute(
        `UPDATE notes SET content = ? WHERE id = ?`,
        [content, id]
    );
    console.log(`Note updated successfully for ID: ${id}`);
};






