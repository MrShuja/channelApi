import express from 'express';
import router from './routes/channelApi.js';

const app = express();

const PORT = 5000;
app.use(express.json());
app.use('/test', router);
app.use('/getallusers',router);
app.use('/channel', router);

app.listen(PORT,()=>{
    console.log(`The server is running on port :${PORT}`)
})