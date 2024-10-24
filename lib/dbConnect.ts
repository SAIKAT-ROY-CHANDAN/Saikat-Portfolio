import * as mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  // mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    console.log("Missing MONGODB_URI");
    return;
  }

  if (isConnected) {
    return;
  }

  console.log(process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'portfolio',
    });
    isConnected = true;
    console.log("MONGODB IS CONNECTED");
  } catch (error) {
    console.log('FAILED TO CONNECT TO MONGODB', error);
  }
};
