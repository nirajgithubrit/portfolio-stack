import mongoose from 'mongoose';

export async function connectDb(uri: string): Promise<void> {
  mongoose.set('strictQuery', true);
  try{
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  }catch(error){
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}
