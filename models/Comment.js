'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  attachments: [String]
})
CommentSchema.index({ ticketId: 1 })

module.exports = mongoose.model('comment', CommentSchema)
