'use strict'

const CommentModel = require('../models/Comment')
const TicketModel = require('../models/Ticket')
const UserModel = require('../models/User')

const ObjectId = require('mongoose').Types.ObjectId
const Parallel = require('async-parallel')

class Ticket {
  /**
   * Update or insert a ticket
   */
  async upsertTicket(request, h) {
    try {
      // create or update comments
      const comments = request.payload.ticket.comments
      if (comments && comments.length) {
        const result = await Parallel.map(
          comments,
          async comment => {
            const id = comment._id || null
            return await CommentModel.findOneAndUpdate(
              { _id: new ObjectId(id) },
              {
                $set: comment
              },
              {
                upsert: true,
                new: true,
                returnNewDocument: true
              }
            )
          },
          10
        )
        request.payload.ticket.comments = result
      }

      // create of update ticket
      const ticketId = request.params.ticketId || null
      let ticket = null

      if (!ticketId) {
        ticket = await TicketModel.create(request.payload.ticket)
        await ticket.populate('userId')
          .populate({
            path: 'comments',
            populate: {
              path: `userId`,
              model: 'User'
            }
          })
          .execPopulate()
      } else {
        ticket = await TicketModel.findOneAndUpdate(
          { _id: ObjectId(ticketId) },
          { $set: request.payload.ticket },
          {
            upsert: true,
            new: true,
            returnNewDocument: true
          })
          .populate('userId')
          .populate({
            path: 'comments',
            populate: {
              path: `userId`,
              model: 'User'
            }
          })
      }

      // add ticket to user if necessary
      await UserModel.findOneAndUpdate(
        { _id: new ObjectId(ticket.userId._id) },
        { $addToSet: { tickets: new ObjectId(ticket._id)}}
      )

      return { code: 20000, data: ticket }
    } catch(err) {
      console.error('error upsertTicket', err)
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

      // deleting comments
      const ticketToDelete = await TicketModel.findOne({ _id: new ObjectId(ticketId)})

      if (ticketToDelete.comments && ticketToDelete.comments.length) {
        await Parallel.map(
          ticketToDelete.comments,
          async comment => {
            return await CommentModel.deleteOne({ _id: new ObjectId(comment) })
          },
          10
        )
      }
      
      // remove ticket from user tickets
      await UserModel.findOneAndUpdate(
        { _id: new ObjectId(ticketToDelete.userId) },
        {
          $pull: { tickets: new ObjectId(ticketId) }
        }
      )

      // delete ticket
      await TicketModel.deleteOne({ _id: new ObjectId(ticketId) })
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
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: `userId`,
          model: 'User'
        }
      })
      .exec()

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
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: `userId`,
          model: 'User'
        }
      })
      .exec()
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
      const ticket = await TicketModel.findOne({ _id: ObjectId(ticketId) })
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: `userId`,
          model: 'User'
        }
      })
      .exec()
      return { code: 20000, data: ticket }
    } catch(err) {
      console.error('error getTicketDetails', err)
      return { code: 50000, data: null, error: err.message }
    }
  }
}

module.exports = new Ticket()
