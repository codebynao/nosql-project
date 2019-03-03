const defaultConfig = {
  PORT: 8080,
  REGEX_OBJECTID: /^[a-f0-9]{24}$/,
  TICKET_PRIORITIES: [1, 2, 3, 4, 5],
  TICKET_STATUS: ['pending', 'done', 'open', 'closed', 'test']
}

module.exports = defaultConfig
