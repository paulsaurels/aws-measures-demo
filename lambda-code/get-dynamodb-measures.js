var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
  console.log('BEGIN - handler event =[' + JSON.stringify(event) + ']');
  run()
    .then((res) => {
        dynamodb.scan({TableName: 'measures'}, (err, data) => {
            callback(null, data['Items']);
        });
    })
    .catch((err) => callback(err));
};

async function run() {
    console.log('BEGIN - run()');
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    console.log('FINISHED - run(): response.body = ' + response.body);
    return response;
}