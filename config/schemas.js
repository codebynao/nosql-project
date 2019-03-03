const Joi = require('joi')
const configDefault = require('../config/default')

const userSchema = {
  _id: Joi.string().regex(configDefault.REGEX_OBJECTID).optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  username: Joi.string().required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().optional(),
  groups: Joi.array().items(Joi.string()),
  avatar: Joi.string().optional(),
  tickets: Joi.array().items(Joi.string().regex(configDefault.REGEX_OBJECTID)).optional()
}

const commentSchema = Joi.object({
  _id: Joi.string().regex(configDefault.REGEX_OBJECTID).optional(),
  userId: userSchema,
  text: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()).optional()
})

const ticketSchema = {
  _id: Joi.string().regex(configDefault.REGEX_OBJECTID).optional(),
  userId: userSchema,
  title: Joi.string().required(),
  deadline: Joi.date().optional(),
  description: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  comments: Joi.array().items(commentSchema).optional(),
  priority: Joi.number().valid([1, 2, 3, 4, 5]).default(3),
  status: Joi.string().valid(['pending', 'done', 'open', 'closed', 'test']).default('pending'),
  tags: Joi.array().items(Joi.string()).optional(),
  assignees: Joi.array().items(Joi.string()).optional(),
  subscribers: Joi.array().items(Joi.string()).optional(),
  commits: Joi.array().items(Joi.string()).optional()
}

const headerSchema = Joi.object({
  authorization: Joi.string().optional()
}).unknown()

module.exports = {
  userSchema,
  ticketSchema,
  headerSchema
}
