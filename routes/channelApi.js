import express, { query } from 'express';
import conn from '../config/db.js';
import validator from 'validator'
const router = express.Router();

//Add a new Channel
router.post('/', async (req, res)=>{

    const {id, channelName, ip, format, dvrKar, dvrLhr, rack, port, satellite, group} = req.body;

    // Validation
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID must be a unique number and not null.' });
    }
    if (!channelName || !validator.isAlphanumeric(channelName.replace(/\s/g, ''))) {
        return res.status(400).json({ message: 'Channel name must be unique and not null.' });
    }
    if (!ip || !ip.startsWith('172.168.150.')) {
        return res.status(400).json({ message: 'IP must start with 172.168.150.*' });
    }
    if (!['mp4', 'avi'].includes(format.toLowerCase())) {
        return res.status(400).json({ message: 'Format must be either mp4 or avi.' });
    }
    if (!dvrKar || !dvrLhr) {
        return res.status(400).json({ message: 'dvrKar and dvrLhr must not be null.' });
    }
    if (!rack || !port || !satellite) {
        return res.status(400).json({ message: 'Rack, port, and satellite are required fields.' });
    }

    try {
        // Check for unique constraints
        const [existingId] = await conn.promise().query("SELECT * FROM channelApi WHERE id = ?", [id]);
        if (existingId.length) {
            return res.status(409).json({ message: 'ID already exists.' });
        }

        const [existingChannel] = await conn.promise().query("SELECT * FROM channelApi WHERE channelName = ?", [channelName]);
        if (existingChannel.length) {
            return res.status(409).json({ message: 'Channel name already exists.' });
        }

        const [existingDvrKar] = await conn.promise().query("SELECT * FROM channelApi WHERE dvrKar = ?", [dvrKar]);
        if (existingDvrKar.length) {
            return res.status(409).json({ message: 'dvrKar already exists.' });
        }

        const [existingDvrLhr] = await conn.promise().query("SELECT * FROM channelApi WHERE dvrLhr = ?", [dvrLhr]);
        if (existingDvrLhr.length) {
            return res.status(409).json({ message: 'dvrLhr already exists.' });
        }

        const [existingPort] = await conn.promise().query("SELECT * FROM channelApi WHERE ip = ? AND port = ?", [ip, port]);
        if (existingPort.length) {
            return res.status(409).json({ message: 'The port must be unique for the same IP address.' });
        }

        const [result] = await conn.promise().query("INSERT INTO channelApi SET ?", {
            id, channelName, ip, format, dvrKar, dvrLhr, rack, port, satellite, group
        });

        res.status(201).json({ message: 'Data saved successfully.', data: result });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.', error });
    }
});

// Get all channel
// Route to fetch all channel data
router.get('/', async (req, res) => {
    try {
        const [result] = await conn.promise().query("SELECT * FROM channelApi");
        res.status(200).json({ message: 'Data retrieved successfully.', data: result });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'An error occurred while retrieving data.', error });
    }
});

//route to fetch single data
router.get('/:id', async (req, res)=>{
    const [id] = req.params.id;
    try{
        const [result] = await conn.promise().query("SELECT * FROM channelApi WHERE id = ?", id);
        res.status(201).json({message:"the channel is retrieved", data:result})
        console.log(result)
    }catch(err){
        res.status(500).json("error occur while get the channel")
    }
})


export default router;