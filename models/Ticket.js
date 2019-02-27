'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  deadline: Date,
  description: String,
  attachments: [
    {
      type: String
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  priority: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3
  },
  status: {
    type: String,
    enum: ['pending', 'done', 'open', 'closed', 'test'],
    default: 'new'
  },
  tags: [String],
  assignees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  commits: [String]
})
TicketSchema.index({ title: 1, priority: 1, status: 1 })

module.exports = mongoose.model('ticket', TicketSchema)
