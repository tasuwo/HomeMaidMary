'use strict'

const handleDiscovery = require('./handler/handleDiscovery')
const handlePowerControl = require('./handler/handlePowerControl')
const bunyan = require('bunyan')
const bformat = require('bunyan-format')
const formatOut = bformat({ outputMode: 'bunyan', levelInString: true })
const logger = bunyan.createLogger({
  name: 'my-home-skill',
  stream: formatOut,
  level: 'info'
})

module.exports.handler = async function(request, context) {
  if (
    request.directive.header.namespace === 'Alexa.Discovery' &&
    request.directive.header.name === 'Discover'
  ) {
    logger.info({ req: request })
    context.succeed(handleDiscovery(request, logger))
  } else if (request.directive.header.namespace === 'Alexa.PowerController') {
    if (
      request.directive.header.name === 'TurnOn' ||
      request.directive.header.name === 'TurnOff'
    ) {
      logger.info({ req: request })
      context.succeed(await handlePowerControl(request, logger))
    }
  }
}
