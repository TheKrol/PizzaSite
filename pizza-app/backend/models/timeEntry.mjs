import { Schema, model } from 'mongoose';

const timeEntrySchema = new Schema({
  user_id: { type: String, required: true },
  time_type: { type: String, required: true },
  time: { type: String, required: true }
});

export default model('TimeEntry', timeEntrySchema);