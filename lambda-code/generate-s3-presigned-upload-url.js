var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  signatureVersion: 'v4',
});

exports.handler = (event, context, callback) => {
  console.log('BEGIN - handler event =[' + JSON.stringify(event) + ']');
  run()
    .then((res) => {
        console.log('BEGIN - run().then()');
        const url = s3.getSignedUrl('putObject', {
            Bucket: 'uploaded-measures-files',
            Key: 'meters-mesures-auckland.json',
            Expires: 100,
        });
        res.body = url; 
        console.log('FINISHED - run().then(): res.body= [' + res.body + ']');
        callback(null, res)
        
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