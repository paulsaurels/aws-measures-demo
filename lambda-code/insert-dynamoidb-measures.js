var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var dynamodb = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
  console.log('BEGIN - handler event =[' + JSON.stringify(event) + ']');

  // Retrieve the bucket & key for the uploaded S3 object that
  // caused this Lambda function to be triggered
  var src_bkt = event.Records[0].s3.bucket.name;
  var src_key = event.Records[0].s3.object.key;

  run()
    .then((res) => {
        console.log('BEGIN - run().then()');
        
        // Retrieve the object
        s3.getObject({
            Bucket: src_bkt,
            Key: src_key
        }, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            } else {
                console.log("Raw text:\n" + data.Body.toString('ascii'));

                let measures = JSON.stringify(data.Body.toString('ascii'));
                
                bulkInsertDynamoDb(measures);

                callback(null, null);
            }
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


bulkInsertDynamoDb = (itemsFromS3) => {
    var params = {
        'RequestItems': {
            'measures': []
        }
    };

    for (const obj of itemsFromS3) {
        
        var item = {
            'PutRequest': {
                Item: {
                    'meterId': {
                        'S': obj.meterId
                    },
                    'measureDate': {
                        'S': Date.parse(obj.measureDate).toString()
                    },
                    'measure': {
                        'S': measure
                    }
                }
            }
        };

        params['RequestItems']['measures'].push(item);
    }

    dynamodb.batchWriteItem(params);
};
