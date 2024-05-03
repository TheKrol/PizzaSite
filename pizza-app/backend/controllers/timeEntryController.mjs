import TimeEntry from '../models/timeEntry.mjs';

export async function createTimeEntry(req, res) {
    try {
        const { user_id, time_type, time } = req.body;
        const entry = new TimeEntry({ user_id, time_type, time });
        await entry.save();
        res.status(201).json({ message: 'Time entry saved successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Error saving time entry.' });
    }
}

export async function getTimeEntriesByUserId(req, res) {
    try {
        const { user_id } = req.params;
        const entries = await TimeEntry.find({ user_id });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching time entries.' });
    }
}

export async function updateTimeEntry(req, res) {
    try {
        const { entry_id } = req.params; // Get the entry ID from the request parameters
        const updateData = req.body; // Get the updated data from the request body

        // Use Mongoose or your preferred method to update the time entry by ID
        // Example using Mongoose:
        const updatedEntry = await TimeEntry.findByIdAndUpdate(entry_id, updateData, { new: true });

        if (!updatedEntry) {
            return res.status(404).json({ error: 'Time entry not found.' });
        }

        res.json(updatedEntry);
    } catch (error) {
        res.status(400).json({ error: 'Error updating time entry.' });
    }
}

export async function deleteTimeEntry(req, res) {
    try {
        const { id } = req.params;
        const deletedEntry = await TimeEntry.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({ error: 'Time entry not found.' });
        }
        res.json({ message: 'Time entry deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting time entry.' });
    }
}
export default {
    createTimeEntry,
    getTimeEntriesByUserId,
    updateTimeEntry,
    deleteTimeEntry
};