'use strict'

const Hapi = require('hapi')
const mongoose = require('mongoose')

require('dotenv').config({ path: process.env.DOTENV || '.env' })

const server = Hapi.server({
    port: 8080,
    host: 'localhost'
})

// Init the database
mongoose.connect(process.env.MONGO_URI)

// Catch error on connection
mongoose.connection.on('error', err => {
    console.error(`Error on connection to MongoDB: ${err}`)
})

mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected')
})

mongoose.connection.on('connected', () => {
    console.info(`MongoDB connected on ${process.env.MONGO_URI}`)
})

mongoose.connection.on('disconnected', () => {
    console.error('Connection to MongoDB interrupted')
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
        require('./routes/ticket')
    ])
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
};

process.on('unhandledRejection', (err) => {

    console.log(err)
    process.exit(1)
});

init()