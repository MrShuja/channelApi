import express from 'express';
import conn from '../config/db.js';
const router = express.Router();

router.post('/', (req, res)=>{
    // console.log("The received data is :" , req.body)
    // res.status(201).json({message:"Data is accessing"})

    const {id, channelName, ip, format, dvrKar, dvrLhr, rack, port, satellite} = req.body;

    if(!id || !channelName || !ip || !format || !dvrKar ||  !dvrLhr || !rack || !port || !satellite){
        return res.status(422).json({message:"Please fill all data"})
        
    }
    res.status(201).json({message:"data send successfully"})
    console.log(req.body);
})

export default router;