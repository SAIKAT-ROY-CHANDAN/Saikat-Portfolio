import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'portfolio',
    });
    isConnected = true;
    console.log('MONGODB IS CONNECTED');
  } catch (error) {
    console.log('FAILED TO CONNECT TO MONGODB', error);
    throw error;
  }
};
