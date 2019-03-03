'use strict'

const UserModel = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

class User {
  /**
   * Update or insert a user
   */
  async upsertUser(request, h) {
    try {
      const userId = request.params.userId || null
      let user = null
      if (!userId) {
        user = await UserModel.create(request.payload.user)
      } else {
        user = await UserModel.findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $set: request.payload.user },
          {
            new: true,
            returnNewDocument: true
          })
      }

      return { code: 20000, data: user }
    } catch(err) {
      console.error('error upsertUser', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Delete (deactivate) a user
   */
  async deactivateUser(request, h) {
    try {
      const userId = request.params.userId
      if (!userId) {
        throw new Error('No user id in request')
      }
      const deactivatedUser = await UserModel.findOneAndUpdate(
        { _id: ObjectId(userId) },
        { $set: { isActive: false }},
        {
          upsert: true,
          new: true,
          returnNewDocument: true
        })
      return { code: 20000, data: deactivatedUser }
    } catch(err) {
      console.error('error deactivateUser', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(request, h) {
    try {
      const users = await UserModel.find({})
      return { code: 20000, data: users }
    } catch(err) {
      console.error('error getAllUsers', err)
      return { code: 50000, data: null, error: err.message }
    }
  }

  /**
   * Get a specific user
   */
  async getUserDetails(request, h) {
    try {
      const userId = request.params.userId
      if (!userId) {
        throw new Error('No user id in request')
      }
      const user = await UserModel.findOne({ _id: ObjectId(userId) })
      return { code: 20000, data: user }
    } catch(err) {
      console.error('error getUserDetails', err)
      return { code: 50000, data: null, error: err.message }
    }
  }
}

module.exports = new User()
