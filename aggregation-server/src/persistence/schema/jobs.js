import dynamo from 'dynamodb'
import Joi from 'joi'

const table = {
  hashKey: 'provider',
  rangeKey: 'requestId',
  schema: {
    id: dynamo.types.uuid(),
    provider: Joi.string(),
    requestId: Joi.string(),
    status: Joi.string(),
    result: Joi.any(),
    time: Joi.date().timestamp(),
  },
}

module.exports = {
  table,
}