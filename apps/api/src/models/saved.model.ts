import mongoose from 'mongoose';

const savedSchema = new mongoose.Schema({
	id: { type: Number, index: { unique: true } },
});

export default mongoose.model('saved', savedSchema);
