import { config } from "dotenv";
config();

import mongoose from "mongoose";

const options:any = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    
}

const connectToDb = async () => {
    try {
        let url = process.env.NODE_ENV === 'production'? process.env.PROD_DATABASE_URL:process.env.DEV_DATABASE_URL
        await mongoose.connect(url as string, options );
        console.log(url)
    } catch (error) {
        console.log(error)
        console.error("Failed to connect to the database ... ");
        console.log(process.env.DB_URL)
        process.exit(1);
    }
};

connectToDb().then();
