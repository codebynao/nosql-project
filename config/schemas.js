const Joi = require('joi')
const configDefault = require('../config/default')

const userSchema = {
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  username: Joi.string().required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().optional(),
  groups: Joi.array().items(Joi.string()).default([]),
  avatar: Joi.string().optional(),
  tickets: Joi.array().items(Joi.string()).optional()
}

const commentSchema = Joi.object({
  userId: userSchema,
  ticketId: Joi.string().regex(configDefault.REGEX_OBJECTID).required(),
  text: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()).optional()
})

const ticketSchema = Joi.object({
  userId: Joi.string().regex(configDefault.REGEX_OBJECTID).required(),
  title: Joi.string().required(),
  deadline: Joi.date().optional(),
  description: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  comments: Joi.array().items(commentSchema).optional(),
  priority: Joi.number().valid([1, 2, 3, 4, 5]).default(3),
  status: Joi.string().valid(['pending', 'done', 'open', 'closed', 'test']).default('new'),
  tags: Joi.array().items(Joi.string()).optional(),
  assignees: Joi.array().items(Joi.string()).optional(),
  subscribers: Joi.array().items(Joi.string()),
  commits: Joi.array().items(Joi.string())
}).required()

const headerSchema = Joi.object({
  authorization: Joi.string().optional()
}).unknown()

module.exports = {
  userSchema,
  ticketSchema,
  headerSchema
}
