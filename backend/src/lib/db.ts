import mongose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB:', conn.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};