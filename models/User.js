'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String, // add regex
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [
    {
      type: String,
      enum: [] // to define
    }
  ],
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastConnection: {
    type: Date,
    default: Date.now
  },
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  ],
  isActive: Boolean
})
UserSchema.index({ username: 1, email: 1 })

module.exports = mongoose.model('user', UserSchema)
