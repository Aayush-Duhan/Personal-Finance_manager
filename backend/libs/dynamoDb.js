const AWS = require('aws-sdk');\nconst dynamoDb = new AWS.DynamoDB.DocumentClient();\nmodule.exports = dynamoDb;
