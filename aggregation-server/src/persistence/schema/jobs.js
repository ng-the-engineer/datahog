import dynamo from 'dynamodb'
import Joi from 'joi'

const table = {
  hashKey: 'provider',
  rangeKey: 'requestId',
  timestamps : true, // will generate createdAt and updatedAt
  schema: {
    id: dynamo.types.uuid(),
    provider: Joi.string(),
    requestId: Joi.string(),
    status: Joi.string(),
    result: Joi.any(),
  },
}

module.exports = {
  table,
}