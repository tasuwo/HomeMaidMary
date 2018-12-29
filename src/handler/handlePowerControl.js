const AWS = require('aws-sdk')
const iotdata = new AWS.IotData({
  endpoint: process.env['AWS_IOT_ENDPOINT']
})

module.exports = async (request, logger) => {
  const requestMethod = request.directive.header.name
  const endpointId = request.directive.endpoint.endpointId
  const requestToken = request.directive.endpoint.scope.token
  const responseHeader = request.directive.header

  return controlByRaspberryPi(endpointId, requestMethod, logger)
    .then((powerResult) => {
      responseHeader.namespace = 'Alexa'
      responseHeader.name = 'Response'
      responseHeader.messageId = responseHeader.messageId + '-R'

      const response = {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: powerResult,
              timeOfSample: new Date().toISOString(),
              uncertaintyInMilliseconds: 500
            }
          ]
        },
        event: {
          header: responseHeader,
          endpoint: {
            scope: {
              type: 'BearerToken',
              token: requestToken
            },
            endpointId
          },
          payload: {}
        }
      }

      logger.info({ res: response }, 'Alexa.PowerController Response')

      return response
    })
    .catch(() => {
      responseHeader.namespace = 'Alexa'
      responseHeader.name = 'ErrorResponse'

      const response = {
        event: {
          responseHeader,
          endpoint: {
            endpointId
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: '何らかの理由で失敗しました'
          }
        }
      }

      logger.error({ res: response }, 'Alexa.ErrorResponse Response')

      return response
    })
}

function controlByRaspberryPi(endpointId, requestMethod, logger) {
  const params = {
    topic: `${process.env['TOPIC']}/${endpointId}/${requestMethod}`,
    payload: 'test',
    qos: 0
  }

  logger.info({ pub: params }, 'Published to AWS IoT')

  return new Promise((resolve, reject) => {
    iotdata.publish(params, (err) => {
      if (err) {
        logger.error(err, 'Published to AWS IoT')

        reject(err)
        return
      }

      if (requestMethod === 'TurnOn') {
        resolve('ON')
      } else if (requestMethod === 'TurnOff') {
        resolve('OFF')
      }
    })
  })
}
