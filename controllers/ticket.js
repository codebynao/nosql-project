'use strict'

const TicketModel = require('../models/Ticket')
const ObjectId = require('mongoose').Types.ObjectId

class Ticket {
  /**
   * Update or insert a ticket
   */
  async upsertTicket(request, h) {
    try {
      const ticketId = request.params.ticketId || ''

      const ticket = await TicketModel.findOneAndUpdate(
        { _id: ObjectId(ticketId) },
        { $set: request.payload.ticket },
        {
          upsert: true,
          new: true,
          returnNewDocument: true
        })
      return { code: 20000, data: ticket }
    } catch(err) {
      console.error('error upsertUser', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Delete a ticket
   */
  async deleteTicket(request, h) {
    try {
      const ticketId = request.params.ticketId
      if (!ticketId) {
        throw new Error('No ticket id in request')
      }
      await TicketModel.deleteOne({ _id: ObjectId(ticketId) })
      return { code: 20000, data: {} }
    } catch(err) {
      console.error('error getTicketDetails', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Get all tickets
   */
  async getAllTickets(request, h) {
    try {
      const tickets = await TicketModel.find({})
      return { code: 20000, data: tickets }
    } catch(err) {
      console.error('error getAllTickets', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Get all tickets for a user
   */
  async getUserTickets(request, h) {
    try {
      const userId = request.params.userId
      if (!userId) {
        throw new Error('No user id in request')
      }
      const userTickets = await TicketModel.find({ userId: ObjectId(userId) })
      return { code: 20000, data: userTickets }
    } catch(err) {
      console.error('error getUserTickets', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Get a specific ticket
   */
  async getTicketDetails(request, h) {
    try {
      const ticketId = request.params.ticketId
      if (!ticketId) {
        throw new Error('No ticket id in request')
      }
      const ticket = await TicketModel.find({ _id: ObjectId(ticketId) })
      return { code: 20000, data: ticket }
    } catch(err) {
      console.error('error getTicketDetails', err)
      return { code: 50000, data: null, error: err.message }
    }
  }
}

module.exports = new Ticket()
