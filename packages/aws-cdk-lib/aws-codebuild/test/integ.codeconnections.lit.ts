import * as cdk from '../../core';
import * as codebuild from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    // Create GitHub source credentials using CodeConnections
    new codebuild.GitHubSourceCredentials(this, 'GitHubCredentials', {
      connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
    });

    // Create a CodeBuild project that can use the CodeConnections credentials
    new codebuild.Project(this, 'MyProject', {
      source: codebuild.Source.gitHub({
        owner: 'aws',
        repo: 'aws-cdk',
      }),
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Hello from CodeBuild with CodeConnections!"',
            ],
          },
        },
      }),
    });
    /// !hide
  }
}

const app = new cdk.App();

new TestStack(app, 'codebuild-codeconnections');

app.synth();
