'use strict'

const Joi = require('joi')
const configDefault = require('../config/default')
const UserController = require('../controllers/user')
const { userSchema, headerSchema } = require('../config/schemas')

module.exports = {
  name: 'User',
  version: '1.0.0',
  register: async function(server, options) {
    server.route([
      {
        method: 'POST',
        path: '/user/{userId?}',
        config: {
          validate: {
            params: {
              userId: Joi.string()
                .regex(configDefault.REGEX_OBJECTID)
                .optional()
            },
            payload: {
              user: userSchema
            },
            headers: headerSchema
          },
          handler: async (request, h) => {
            return UserController.upsertUser(request, h)
          },
          description: 'Insert or update a user',
          tags: ['api', 'user', 'upsert']
        }
      },
      {
        method: 'POST',
        path: '/user/deactivate/{userId}',
        config: {
          validate: {
            params: {
              userId: Joi.string()
                .regex(configDefault.REGEX_OBJECTID)
                .required()
            },
            headers: headerSchema
          },
          handler: async (request, h) => {
            return UserController.deactivateUser(request, h)
          },
          description: 'Deactivate a user',
          tags: ['api', 'user', 'deactivate', 'delete']
        }
      },
      {
        method: 'GET',
        path: '/users',
        config: {
          validate: {
            headers: headerSchema
          },
          handler: async (request, h) => {
            return UserController.getAllUsers(request, h)
          },
          description: 'Get all users',
          tags: ['api', 'users', 'get']
        }
      },
      {
        method: 'GET',
        path: '/user/{userId}',
        config: {
          validate: {
            params: {
              userId: Joi.string().regex(configDefault.REGEX_OBJECTID).required()
            },
            headers: headerSchema
          },
          handler: async (request, h) => {
            return UserController.getUserDetails(request, h)
          },
          description: 'Get a specific user',
          tags: ['api', 'user', 'get']
        }
      }
    ])
  }
}
