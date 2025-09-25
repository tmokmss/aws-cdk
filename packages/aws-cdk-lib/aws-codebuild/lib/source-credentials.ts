import { Construct } from 'constructs';
import { CfnSourceCredential } from './codebuild.generated';
import { Resource, SecretValue, UnscopedValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Creation properties for `GitHubSourceCredentials`.
 */
export interface GitHubSourceCredentialsProps {
  /**
   * The personal access token to use when contacting the GitHub API.
   *
   * Cannot be used together with connectionArn.
   */
  readonly accessToken?: SecretValue;

  /**
   * The ARN of the CodeConnections connection to use for GitHub authentication.
   *
   * Supports both legacy CodeStar Connections and new CodeConnections ARN formats:
   * - arn:aws:codestar-connections:region:account:connection/connection-id
   * - arn:aws:codeconnections:region:account:connection/connection-id
   *
   * Cannot be used together with accessToken.
   */
  readonly connectionArn?: string;
}

/**
 * The source credentials used when contacting the GitHub API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
@propertyInjectable
export class GitHubSourceCredentials extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codebuild.GitHubSourceCredentials';

  constructor(scope: Construct, id: string, props: GitHubSourceCredentialsProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Validate that exactly one of accessToken or connectionArn is provided
    const hasAccessToken = props.accessToken !== undefined;
    const hasConnectionArn = props.connectionArn !== undefined;

    if (!hasAccessToken && !hasConnectionArn) {
      throw new UnscopedValidationError('Either accessToken or connectionArn must be provided');
    }

    if (hasAccessToken && hasConnectionArn) {
      throw new UnscopedValidationError(
        'Cannot provide both accessToken and connectionArn. Use either accessToken for personal access token authentication or connectionArn for CodeConnections authentication',
      );
    }

    // Validate connectionArn format if provided
    if (hasConnectionArn) {
      const connectionArnPattern = /^arn:[^:]+:(codestar-connections|codeconnections):[^:]+:[^:]+:connection\/[a-zA-Z0-9-]+$/;
      if (!connectionArnPattern.test(props.connectionArn!)) {
        throw new UnscopedValidationError(
          'Invalid connectionArn format. Expected format: arn:partition:codeconnections:region:account:connection/connection-id or arn:partition:codestar-connections:region:account:connection/connection-id',
        );
      }
    }

    new CfnSourceCredential(this, 'Resource', {
      serverType: 'GITHUB',
      authType: hasConnectionArn ? 'CODECONNECTIONS' : 'PERSONAL_ACCESS_TOKEN',
      token: hasConnectionArn ? props.connectionArn! : props.accessToken!.unsafeUnwrap(), // Safe usage
    });
  }
}

/**
 * Creation properties for `GitHubEnterpriseSourceCredentials`.
 */
export interface GitHubEnterpriseSourceCredentialsProps {
  /**
   * The personal access token to use when contacting the
   * instance of the GitHub Enterprise API.
   */
  readonly accessToken: SecretValue;
}

/**
 * The source credentials used when contacting the GitHub Enterprise API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub Enterprise
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
@propertyInjectable
export class GitHubEnterpriseSourceCredentials extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codebuild.GitHubEnterpriseSourceCredentials';

  constructor(scope: Construct, id: string, props: GitHubEnterpriseSourceCredentialsProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    new CfnSourceCredential(this, 'Resource', {
      serverType: 'GITHUB_ENTERPRISE',
      authType: 'PERSONAL_ACCESS_TOKEN',
      token: props.accessToken.unsafeUnwrap(), // Safe usage
    });
  }
}

/**
 * Construction properties of `BitBucketSourceCredentials`.
 */
export interface BitBucketSourceCredentialsProps {
  /** Your BitBucket username. */
  readonly username: SecretValue;

  /** Your BitBucket application password. */
  readonly password: SecretValue;
}

/**
 * The source credentials used when contacting the BitBucket API.
 *
 * **Note**: CodeBuild only allows a single credential for BitBucket
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
@propertyInjectable
export class BitBucketSourceCredentials extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codebuild.BitBucketSourceCredentials';

  constructor(scope: Construct, id: string, props: BitBucketSourceCredentialsProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    new CfnSourceCredential(this, 'Resource', {
      serverType: 'BITBUCKET',
      authType: 'BASIC_AUTH',
      username: props.username.unsafeUnwrap(), // Safe usage
      token: props.password.unsafeUnwrap(), // Safe usage
    });
  }
}
