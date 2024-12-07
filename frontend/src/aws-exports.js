// Required environment variables check
const requiredEnvVars = [
  'REACT_APP_AWS_PROJECT_REGION',
  'REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID',
  'REACT_APP_AWS_COGNITO_REGION',
  'REACT_APP_AWS_USER_POOLS_ID',
  'REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID',
  'REACT_APP_AWS_OAUTH_DOMAIN',
  'REACT_APP_REDIRECT_SIGN_IN',
  'REACT_APP_REDIRECT_SIGN_OUT'
];

// Use environment variables
const getConfigValue = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const awsmobile = {
    "aws_project_region": getConfigValue('REACT_APP_AWS_PROJECT_REGION'),
    "aws_cognito_identity_pool_id": getConfigValue('REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID'),
    "aws_cognito_region": getConfigValue('REACT_APP_AWS_COGNITO_REGION'),
    "aws_user_pools_id": getConfigValue('REACT_APP_AWS_USER_POOLS_ID'),
    "aws_user_pools_web_client_id": getConfigValue('REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID'),
    "oauth": {
        "domain": getConfigValue('REACT_APP_AWS_OAUTH_DOMAIN'),
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": getConfigValue('REACT_APP_REDIRECT_SIGN_IN'),
        "redirectSignOut": getConfigValue('REACT_APP_REDIRECT_SIGN_OUT'),
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_AND_IDENTITY_POOLS",
    "aws_cognito_username_attributes": ["EMAIL"],
    "aws_cognito_social_providers": ["GOOGLE"],
    "aws_cognito_signup_attributes": ["EMAIL"],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": ["SMS"],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": ["EMAIL"]
};

export default awsmobile;
