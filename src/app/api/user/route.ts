import { MongoClient, Db, Collection } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
//import bcrypt from 'bcryptjs';

// const MONGO_URI = "mongodb://xuwei19850423:xuwei6811@clusterpowersyncdemo-shard-00-02.9dax1.mongodb.net/powersync?ssl=true&authSource=admin";
// const DB_NAME = "db_anycopy_dev"; // Replace with the actual database name

const MONGO_URI = "mongodb://localfirst:MqtBvsKOWybMCrra@localfirstcluster-shard-00-02.udxax.mongodb.net/localfirst?ssl=true&authSource=admin";
const DB_NAME = "localfirst"; // Replace with the actual database name

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (client && db) {
    return db;
  }

  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

interface User {
  _id: string;
  email: string;
  name: string;
  password: string
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Validate the presence of email and password
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    // Connect to MongoDB (reuse existing connection if possible)
    const db = await connectToDatabase();
    const usersCollection: Collection<User> = db.collection('users');

    // Find the user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 401 });
    }

    // Compare the provided password with the hashed password
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password ===user.password;
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Mock user response
    const responseUser = {
      user_id: JSON.stringify(user._id).replace(/\s+/g, ''), // Remove all spaces
      nickname: user.name,
      email: user.email,
    };

    return NextResponse.json(responseUser);
  } catch (error) {
    console.error('Error authenticating user:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
