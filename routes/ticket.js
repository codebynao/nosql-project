'use strict'

const Joi = require('joi')
const configDefault = require('../config/default')
const TicketController = require('../controllers/ticket')
const { ticketSchema, headerSchema } = require('../config/schemas')


module.exports = {
	name: 'Ticket',
	version: '1.0.0',
	register: async function(server) {
		server.route([
			{
				method: 'POST',
				path: '/ticket/{ticketId?}',
				config: {
					validate: {
						params: {
							ticketId: Joi.string()
								.regex(configDefault.REGEX_OBJECTID)
								.optional()
						},
						payload: {
							ticket: ticketSchema
						},
						headers: headerSchema
					},
					handler: async (request, h) => {
						return TicketController.upsertTicket(request, h)
					},
					description: 'Insert or update a ticket',
					tags: ['api', 'ticket', 'upsert']
				}
			},
			{
				method: 'DELETE',
				path: '/ticket/{ticketId}',
				config: {
					validate: {
						params: {
							ticketId: Joi.string()
								.regex(configDefault.REGEX_OBJECTID)
								.required()
						},
						headers: headerSchema
					},
					handler: async (request, h) => {
						return TicketController.deleteTicket(request, h)
					},
					description: 'Delete a ticket',
					tags: ['api', 'ticket', 'delete']
				}
			},
			{
				method: 'GET',
				path: '/tickets',
				config: {
					validate: {
						headers: headerSchema
					},
					handler: async (request, h) => {
						return TicketController.getAllTickets(request, h)
					},
					description: 'Get all tickets',
					tags: ['api', 'tickets', 'get']
				}
			},
			{
				method: 'GET',
				path: '/tickets/{userId}',
				config: {
					validate: {
						params: {
							userId: Joi.string().regex(configDefault.REGEX_OBJECTID).required()
						},
						headers: headerSchema
					},
					handler: async (request, h) => {
						return TicketController.getUserTickets(request, h)
					},
					description: 'Get all tickets for a user',
					tags: ['api', 'tickets', 'get', 'user']
				}
			},
			{
				method: 'GET',
				path: '/ticket/{ticketId}',
				config: {
					validate: {
						params: {
							ticketId: Joi.string().regex(configDefault.REGEX_OBJECTID).required()
						},
						headers: headerSchema
					},
					handler: async (request, h) => {
						return TicketController.getTicketDetails(request, h)
					},
					description: 'Get a specific ticket',
					tags: ['api', 'ticket', 'get']
				}
			}
		])
	}
}
