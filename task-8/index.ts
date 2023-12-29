import { Stack, StackProps, App } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';



export class MyDatabaseStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const dbInstance = new rds.DatabaseInstance(this, 'Instance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_12,
      }),
      instanceType: new ec2.InstanceType('t2.micro'),
      vpc,
      allowMajorVersionUpgrade: true,
      //
    });
  }
}

const app = new App();
new MyDatabaseStack(app, 'MyDatabaseStack', {
  env: { account: '761576343621', region: 'us-east-1' },
});
app.synth();
