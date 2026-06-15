import {app} from './app.js';
import { connectDb } from './config/database.js';
import { PORT } from './config/env.js';

async function startServer(){
    await connectDb();
    app.listen(PORT,()=>{
        console.log(`Server running on PORT ${PORT}`)
    })
}
startServer();
