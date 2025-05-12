import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const res = await mongoose.connect('mongodb+srv://manishyadavy007:Manish12@cluster0.ynvvka5.mongodb.net/ipopdatabase?retryWrites=true&w=majority&appName=Cluster0');
        if (res) {
            console.log("MongoDB connected successfully");
        }else {
            console.log("MongoDB connection failed");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;