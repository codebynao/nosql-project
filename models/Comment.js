'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
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

CommentSchema.index({ userId: 1 })

module.exports = mongoose.model('Comment', CommentSchema)
