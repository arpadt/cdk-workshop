import { DynamoDB, Lambda } from 'aws-sdk'

exports.handler = async function(event: AWSLambda.APIGatewayEvent) {
  console.log('REQUEST: ', JSON.stringify(event, null, 2))

  const dynamo = new DynamoDB()
  const lambda = new Lambda()

  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME as string,
    Key: {
      path: {
        S: event.path,
      },
    },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: {
      ':incr': {
        N: '1',
      },
    },
  }).promise()

  const resp = await lambda.invoke({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME as string,
    Payload: JSON.stringify(event),
  }).promise()

  console.log('Downstream response: ', JSON.stringify(resp, null, 2))

  return JSON.parse(resp.Payload as string)
}
