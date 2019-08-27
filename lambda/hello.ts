exports.handler = async function(event: AWSLambda.APIGatewayEvent) {
  console.log('REQUEST', JSON.stringify(event, null, 2))

  const response = {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello CDK! You've hit ${ event.path }\n`,
  }
  return response
}
