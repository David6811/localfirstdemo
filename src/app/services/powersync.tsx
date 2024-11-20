import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { AppSchema } from "../domain/data/schema/users_schema";
import { User } from "../domain/data/models/User";


class Connector {
    constructor() {}

    async fetchCredentials() {
        return {
            endpoint: POWERSYNC_ENDPOINT,
            token: POWERSYNC_TOKEN
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase) {
        console.log("Trying to upload data to server...", database);
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





