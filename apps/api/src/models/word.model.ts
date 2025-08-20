import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
	id: { type: Number, index: { unique: true } },
	content: String,
	position: String,
	trans: String,
	en_sentence: String,
	vi_sentence: String,
});

export default mongoose.model('words', wordSchema);
