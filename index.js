'use strict'

const Hapi = require('hapi')
const mongoose = require('mongoose')

require('dotenv').config({ path: process.env.DOTENV || '.env' })

const server = Hapi.server({
	port: 8080,
	host: 'localhost',
	routes: {
		validate: {
			failAction: async (request, h, err) => {
				console.error('validate', err) // eslint-disable-line no-console
				throw err
			}
		}
	}
})

// Init the database
mongoose.connect(process.env.MONGO_URI)

// Catch error on connection
mongoose.connection.on('error', err => {
	console.error(`Error on connection to MongoDB: ${err}`) // eslint-disable-line no-console
})

mongoose.connection.on('reconnected', () => {
	console.info('MongoDB reconnected') // eslint-disable-line no-console
})

mongoose.connection.on('connected', () => {
	console.info(`MongoDB connected on ${process.env.MONGO_URI}`) // eslint-disable-line no-console
})

mongoose.connection.on('disconnected', () => {
	console.error('Connection to MongoDB interrupted') // eslint-disable-line no-console
})

const init = async () => {
	// Get routes
	await server.register([
		require('inert'), // Hapi module for static files
		require('blipp'), // hapi plugin to display the routes table to console at startup
		require('vision'), // to use templating system (for swagger)
		{
			plugin: require('hapi-swagger') // to display documentation
		},
		require('./routes/ticket'),
		require('./routes/user')
	])
	await server.start()
	console.info(`Server running at: ${server.info.uri}`) // eslint-disable-line no-console
}

process.on('unhandledRejection', (err) => {

	console.info(err) // eslint-disable-line no-console
	process.exit(1)
})

init()