import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export interface HitCounterProps {
  downstream: lambda.IFunction
}

export class HitCounter extends cdk.Construct {
  public readonly handler: lambda.Function

  constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
    super(scope, id)

    const table = new dynamodb.Table(this, 'Hits', {
      partitionKey: {
        name: 'path',
        type: dynamodb.AttributeType.STRING,
      },
    })

    this.handler = new lambda.Function(this, 'HitCounterHandler', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'),
      handler: 'hit-counter.handler',
      environment: {
        HITS_TABLE_NAME: table.tableName,
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
      },
    })

    // add permission to lambda role to write to ddb
    table.grantReadWriteData(this.handler)

    // grant permission to lambda role to invoke downstream
    props.downstream.grantInvoke(this.handler)
  }
}
