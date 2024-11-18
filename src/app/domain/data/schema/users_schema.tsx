import { column, Schema, Table } from '@powersync/web';
// OR: import { column, Schema, Table } from '@powersync/react-native';

const users = new Table(
  {
    // id column (text) is automatically included
    _id: column.text,
    age: column.integer,
    email: column.text,
    name: column.text
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  users
});

export type Database = (typeof AppSchema)['types'];
