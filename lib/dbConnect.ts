// import mongoose from 'mongoose';

// let isConnected: boolean = false;

// export const connectToDatabase = async () => {
//   mongoose.set('strictQuery', true);
//   console.log('Mongoose connection status:', mongoose.connection.readyState);

//   if (!process.env.MONGODB_URI) {
//     console.log("Missing MONGODB_URI");
//     return;
//   }

//   if (isConnected) {
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI as string, {
//       dbName: 'portfolio',
//     });
//     isConnected = true;
//     console.log("MONGODB IS CONNECTED");
//   } catch (error) {
//     console.log('FAILED TO CONNECT TO MONGODB', error);
//   }
// };
