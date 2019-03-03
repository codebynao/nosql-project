'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	groups: [String],
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
	isActive: {
		type: Boolean,
		default: true
	}
})
UserSchema.index({ username: 1, email: 1 })

// On Save Hook, encrypt password
// Before saving a model, run this function
UserSchema.pre('save', function(next) {
	// get access to the user model
	const user = this

	// generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err)
		}

		// hash (encrypt) our password using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {
				return next(err)
			}

			// overwrite plain text password with encrypted password
			user.password = hash
			next()
		})
	})
})

UserSchema.options.toJSON = {
	getters: true,
	transform: function(doc, ret) {
		delete ret.password
		delete ret.isActive
		delete ret.createdAt
		delete ret.lastConnection
		delete ret.__v
		return ret
	}
}

module.exports = mongoose.model('User', UserSchema)
