import { app } from "./app.js";
import { connectDB } from "./db/connect.js";
import { config } from 'dotenv';

config({
    path: '.env'
})
const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Sever is running on port ${port}...`);
        });
    } catch (error) {
        console.log(error.message);
    }
}
start();