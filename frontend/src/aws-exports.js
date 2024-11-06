const awsmobile = {
    "aws_project_region": "ap-south-1",
    "aws_cognito_identity_pool_id": "ap-south-1:17fdad12-094d-4c0e-a258-cc400fef88fb",
    "aws_cognito_region": "ap-south-1",
    "aws_user_pools_id": "ap-south-1_IslMhK8Md",
    "aws_user_pools_web_client_id": "2smojmi9d48ji4n6eak53mf7td",
    "oauth": {
        "domain": "financemanager76a892e1-76a892e1-dev.auth.ap-south-1.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "http://localhost:3000/",
        "redirectSignOut": "http://localhost:3000/",
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
