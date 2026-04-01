const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  bugName: {
    type: String,
    required: [true, 'Bug name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  importanceLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'solving', 'solved'],
    default: 'pending'
  },
  screenshot: {
    type: String,   // image URL or file path
    default: ''
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Bug', BugSchema);
