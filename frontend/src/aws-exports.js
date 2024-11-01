const amplifyConfig = {
    Auth: {
        Cognito: {
          userPoolClientId: '6kmf25mg125ul2edroklddsvnk',
          userPoolId: 'ap-south-1_B8oHfOQAw',
          loginWith: {
            oauth: {
              domain: 'https://myfinanceapp-auth.auth.ap-south-1.amazoncognito.com',
              scopes: ['openid','email','profile'],
              redirectSignIn: 'https://main.d3lqh73emmjp9j.amplifyapp.com/',
              redirectSignOut: 'https://main.d3lqh73emmjp9j.amplifyapp.com/',
              responseType: 'code',
            },
            username: 'true',
            email: 'true', 
            phone: 'false', 
          }
        }
      },
  };
  
  export default amplifyConfig;
  