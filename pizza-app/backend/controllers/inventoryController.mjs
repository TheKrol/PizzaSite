import InventoryModel from '../models/inventory.mjs';

//Add inventory function
//Inputs: json request and response
//Outputs: Creates a new item in the inventory db table and a message
const addInventory = async (req, res) => {
    try{
        const {name, type, quantity, unitType} = req.body;
        const invAdd = new InventoryModel({name, type, quantity: parseInt(quantity), unitType});
        await invAdd.save();
        res.status(201).json({message: 'Item added successfully!'});
    }
    catch (error){
        res.status(400).json({error: 'Item could not be added!'});
    }
}

//Delete inventory function
//Inputs: json request and response
//Outputs: Deletes an existing inventory item from the inventory db table
const deleteInventory = async (req, res) => {
    const itemName = req.params.id;
    try{
        const invDel = await InventoryModel.findByIdAndDelete(itemName);
        if (!invDel){
            return res.staus(404).json({error: 'Item not found!'});
        }
        res.status(204).end();
    }
    catch (err){
        res.status(400).json({ error: err.message });
    }
}

//Get inventory function
//Inputs: json request and response
//Outputs: The entire inventory db table list
const getInventory = async (req, res) => {
    try{
        const items = await InventoryModel.find();
        res.json(items);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
}

//Update inventory function
//Inputs: json request and response
//Outputs: Changes information for a particular item in the inventory db table
const updateInventory = async (req, res) => {
    const itemName = req.params.id;
    try{
        const invUpdate = await InventoryModel.findByIdAndUpdate(itemName, req.body, {new: true});
        if(!invUpdate){
            return res.status(404).json({error: 'Item not found!'});
        }
        res.json(invUpdate);
    }
    catch (err){
        res.status(400).json({ error: err.message });
    }
}

//Exports the above functions to be used in the routes file for inventory
export default {
    addInventory,
    deleteInventory,
    getInventory,
    updateInventory
}