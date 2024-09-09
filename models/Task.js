const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    date_time: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', TaskSchema);
