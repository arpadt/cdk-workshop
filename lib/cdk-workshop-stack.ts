import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { TableViewer } from 'cdk-dynamo-table-viewer'

import { HitCounter } from './hit-counter'

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'), // the library from which lambda is called, relative from where cdk is run
      handler: 'hello.handler',
    })

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    })

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    })

    new TableViewer(this, 'ViewHitCounter', {
      title: 'HelloHits',
      table: helloWithCounter.table,
    })
  }
}
