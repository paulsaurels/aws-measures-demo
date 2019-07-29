# Gentrack - Solution Arcitecture Proposal  

This solution proposal was thought to be implemented with AWS Services having its frontend and backend being considered in the scope of the solution. Also considerations about deployment with continuous integrations (CI), continuous delivery (CD) as well as considerations about security. 

## Problem

Gentrack receives loads of text files every day which have measures of the power or the water consumed by its customers. Which line in these files is about one measure gauged at the meter device from a consumer house. 

# Technological Stack used in this Proposal of Solution

## Fontend - one static page and one SPA (Simple Page Application - ReactJS) 
* HTML 5
* Bootstrap
* Javascript 
* Jquery
* ReactJS
* Dropzone React Component

## Backend - services from AWS (Serverless Approach - No EC2 instance was necessary to be directly used)

* *CloudWatch* -
Monitoring logs from all services used, and allow to create alerts for important notifications such as Billing Alerts.

* *IAM - Identity Access Management* -
Administrates the main AWS Account and allows to create user accounts to assign different Role, ACL, Polices, etc - (protecting the main or root account)

* *Cognito* -
Manage Authorization and Authentication of Users, Applications and allow the cru=eatind of Pool of users.

* *S3 - Simple Storage Service* -
Allows the creation of buckets of data for storing files, static websites, etc

* *Gateway API* -
Manage and allows the creation of REST and WebSockets APIS.

* *Lambda* -
Serverless backend allows the execution of containerized functions without the deployment of an application server in the EC2 instances.

* *DynamoDB* -
Databases NoSql - Permits data to be stored in Schemless Documents. 

## Solution Description

```
Flow 1 - Uploading files to the Cloud Solution
-----------------------------------------------
Text files with measures are uploaded to AWS S3 bucket by using a Simple Page Application made in ReactJS. The user is authenticated before having access to the upload feature. This application gives the flexibility to Drag and Drop files onto a region in the page (Dropzone) and files are selected to be uploaded to the cloud. When the file has arrived in the specified S3 bucket, one event is fired against to the AWS Lambda function service, where one predefined code starts to run, opens the text file uplodaded for reading access and copy all the file content, transforming each text line into the DynamoDB Document, storaging it at DynamoDB Table.


Flow 2 - Consulting Measures in the Web Page
--------------------------------------------
A simple list of measures is shown when a user access a simple and public https link.
The page shows each measure that was previously uplodaded through the files in the Flow 1. The measura has the following fields METER_ID, MEASURE_DATE, MEASURE_VALUE, FILE_NAME_UPLOADED.  

```

## Technical Design

```
Flow 1 - Uplodading files to the Cloud Solution
===============================================

A local Single Page Application made in Reactjs (create-react-app) that shows a login form to prompt the user credentials (login and password). The user credential will be authenticated through a user pool defined in the AWS Cognito. After successful authentication, Amazon Cognito returns the user pool token to the ReactJS application. This tokens will grant users access to the next API method created in the AWS API Gateway. The AWS GateWay API then receives a REST GET request with the authorization token from ReactJS application and calls AWS Lambda function to generate a pre-signed PUT URL that will allow ReactJs App to call the next Request throughout the AWS Gateway again. Is valid to remember that AWS API Gateway is integrated with AWS Cognito and always validate the authorization token into incoming requests. The next request called by React App, as mentioned before, will be a pre-signed PUT request that allows files selected to be uploaded effectively into the S3 bucket. S3 fire one event per file uploaded to the another AWS Lambda function, that will access the files content and will store into the DynamoDB table.

[FEATURES]: 

User Login:
----------- 
ReactJS APP --> POST submit user credentials --> AWS API Gateway --> AWS Cognito 


Pre-Signed URL PUT (for Upload file):
------------------------------------
ReactJS APP --> GET request for Pre-Signed S3 Access URL --> AWS API Gateway --> AWS LAMBDA Generate Pre-Signed PUT URL --> AWS S3 


Upload the File to S3:
----------------------
ReactJS APP --> PUT request for Upload S3 Object --> AWS S3


Insertion Measures to DynamoDB:
------------------------------
AWS S3 --> Fire Event --> AWS Lambda --> Take bucket and Filename from Event --> Access S3 Bucket --> get Content --> Insert into DynamoDb Table



Flow 2 - Consulting Measures in the Web Page
============================================

One S3 Bucket was create for hosting static website in which is a single web page made in HTML 5, Bootstrap 3.x and JQuery for showing a List of Mesuares. The page has the public access and when it is completed loaded in the web browser of the user machine or smartphone, a JQuery Ajax request goes to the AWS API Gateway that passes the request until an AWS Lambda function. This Lambda function executes an access to the AWS DynamoDB Service and scans the Mesuare Table, returning back a list of Mesuare Documents to the JQuery Ajax Javascript function in the Web Page. JQuery constructs the list of Measures that the user can see at the web page.  

[FEATURES]

Hosting Page at S3 static content
---------------------------------
Browser --> GET Link to plublic AWS S3 Bucket index.html --> JQuery Javascript sends GET Request --> AWS Gateway API --> AWS Lambda Function --> retrieve measures from DynamoDB Table (Scan) 

```

## CI/CD
Some options are possible here at AWS to create the CI/CD flows for this solution. It is possible to use AWS Codepipeline that integrates with other AWS tools for DEVOPS such as CodeCommit, CodeBuild and CodeDeploy.

Alternatively, it is possible to use AWS Cloud Formation that uses recipes or Stack predefined to deploy all the services needed for a Solution.

## Security
The security here is being achieved here using IAM for grant permission to Users of AWS, and AWS Cognito integrated with AWS API Gateway.
