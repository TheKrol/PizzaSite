import InvTrackingModel from '../models/invTracking.mjs';

//Create inventory tracking record
//Inputs: json request and response
//Outputs: Creates a new item in the tracking db table
const addTracking = async (req, res) => {
    try{
        const {date, shift, name, quantity, status} = req.body;
        const trackingAdd = new InvTrackingModel({ date, shift, name, quantity: parseInt(quantity), status });
        await trackingAdd.save();
        res.status(201).json({message: 'Record added successfully!'});
    }
    catch (error){
        res.status(400).json({error: 'Record could not be added!'});
    }
}

//Delete inventory tracking record
//Inputs: json request and response
//Outputs: Deletes an record from the tracking db table
const deleteTracking = async (req, res) => {
    const itemName = req.params.id;
    try{
        const trackingDel = await InvTrackingModel.findByIdAndDelete(itemName);
        if (!trackingDel){
            return res.status(404).json({error: 'Record not found!'});
        }
        res.status(204).end();
    }
    catch (err){
        res.status(400).json({ error: err.message });
    }
}

//Get inventory tracking records
//Inputs: json request and response
//Outputs: The entire tracking db table list
const getTracking = async (req, res) => {
    try{
        const items = await InvTrackingModel.find();
        res.json(items);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
}

//Update inventory tracking table
//Inputs: json request and response
//Outputs: Changes information for a particular item in the tracking db table
const updateTracking = async (req, res) => {
    const itemName = req.params.id;
    try{
        const trackingUpdate = await InvTrackingModel.findByIdAndUpdate(itemName, req.body, {new: true});
        if(!trackingUpdate){
            return res.status(404).json({error: 'Record not found!'});
        }
        res.json(trackingUpdate);
    }
    catch (err){
        res.status(400).json({ error: err.message });
    }
}

//Exports the above functions to be used in the routes file for inventory
export default {
    addTracking,
    deleteTracking,
    getTracking,
    updateTracking
}