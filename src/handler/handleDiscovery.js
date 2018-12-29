module.exports = (request, logger) => {
  const header = request.directive.header
  header.name = 'Discover.Response'
  header.messageId = header.messageId + '-R'

  const payload = {
    endpoints: [
      {
        endpointId: 'room-light',
        manufacturerName: 'tasuwo',
        friendlyName: '電気',
        description: '部屋の電気',
        displayCategories: ['LIGHT'],
        capabilities: [
          {
            type: 'AlexaInterface',
            interface: 'Alexa.PowerController',
            version: '3',
            properties: {
              supported: [
                {
                  name: 'powerState'
                }
              ]
            }
          }
        ]
      },
      {
        endpointId: 'room-humidifier',
        manufacturerName: 'tasuwo',
        friendlyName: '加湿器',
        description: '部屋の加湿器',
        displayCategories: ['SWITCH'],
        capabilities: [
          {
            type: 'AlexaInterface',
            interface: 'Alexa.PowerController',
            version: '3',
            properties: {
              supported: [
                {
                  name: 'powerState'
                }
              ]
            }
          }
        ]
      }
    ]
  }

  const response = {
    event: {
      header,
      payload
    }
  }

  logger.info({ res: response }, 'Discovery Response')

  return response
}
