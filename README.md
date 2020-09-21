# Datahog

## Implementation Plan 
1. Design the architecture
2. Create Open API Spec 3.0
3. Create API tests
4. Create node server for the asynchronous client, define functions, and create unit tests
5. Create node server for the aggregation server, define functions, and create unit tests
6. Setup local DynamoDB, create table and schema with node library
7. Setup task queue with Bee-queue backed with Redis
8. Discussion

---
### 0. Quick  Start

This is an overview of how to start the datahog application. 

#### Install dependencies
##### 1. Redis

Redis is used to support the message queue. Run below command to run the offical Redis container

```
$ docker run --name my-redis-container -p 6379:6379 -d redis
```

(Optional) To access Redis, [check this gist](https://gist.github.com/ng-the-engineer/04acc31d7fafc1288bfb4ff960271551)

##### 2. Local DynamoDB

DynamoDB is used to track the progress of the data retrieval jobs.

This implementation work with a local DynamoDB, you don't need an AWS credential to run this application. To setup, please follow below steps.

1. [Install local DynamoDB](https://gist.github.com/ng-the-engineer/1f3b9bc61ab718ba36b9a6fe0b4f5289)

2. [Configure dummy AWS credential](https://gist.github.com/ng-the-engineer/e89b16e83c216b09d35d762b12878d31)

3. [(Optional) Setup DynamoDB GUI tool](https://gist.github.com/ng-the-engineer/7050636d63e3cdf3db6b0bea6dc5602a)

4. This app has only one table in DynamoDB (named JOBS). Run below script to create the table. You will see the message `Table is created successfully` when the table is created successfully.

```
# node ./lib/persistence/scripts/createTable.js
```

#### Open API Specification

This app has two sets of API. 

##### Asynchronous Client
- Entry point to place the data retrieval request.
- Provide a web-hook to receive the callback from the server.

##### Aggregation Server
- Break down the request into individual retrieval jobs.
- Failed retrieval job will retry at certain interval until succeed.
- Requests are processed in concurrent and asynchronous fashion.

To view the API specification/ Swagger in web browser, under root folder, run

```
$ docker-compose up -d
```



| API                  | Swagger Url                 |
| -------------------- |:---------------------------:|
| Asynchronous Client  | http://localhost:8081/      |
| Aggregation Server   | http://localhost:8082/      |

The specification is written in Open API Specification version 3


#### Start Asynchronous Client 

In folder `./async-client`, run 

```
$ yarn && yarn build && yarn start
```

When `Aysnc Client starts listening on port 3100` appearing in the console, the client app is ready to serve.

#### Start Aggregation Server

In folder `./aggregation-server`, run 

```
$ yarn && yarn build && yarn start
```

When `Aggregation Server starts listening on port 3200` appearing in the console, the server app is ready to serve.


#### Make a first request

In the first attempt, you are going to place the data retrieval request with one provider (e.g. gas). 

```
POST http://localhost:3100/api/v1/requests
```



Post request body:
```
{
    "providers": [
        {
            "provider": "gas"
        }
    ]
}
```

You will get a response alike below structure. The status `REQUEST_PLACED` means the request has sent to the server successfully. The `requestId` is an identifier to match up the result when the callback is collected.

```
{
    "status": "REQUEST_PLACED",
    "requestId": "NFR6B"
}
```

Let's see what is happening behind the scene. 


#### From the server console log
```
01  <-- POST /api/v1/requests?requestId=NFR6B
02  --> POST /api/v1/requests?requestId=NFR6B 200 3ms 45b
03 2020-09-20T23:48:07.971Z JobId: 42 queued up with payload [object Object]
04 2020-09-20T23:48:07.979Z JobId: 42 failed with status: 500
05 2020-09-20T23:48:07.985Z JobId: 42 is being retried! (9)
06 2020-09-20T23:48:12.988Z JobId: 42 failed with status: 500
07 2020-09-20T23:48:12.991Z JobId: 42 is being retried! (8)
08 2020-09-20T23:48:17.999Z JobId: 42 failed with status: 500
09 2020-09-20T23:48:18.001Z JobId: 42 is being retried! (7)
10 2020-09-20T23:48:23.006Z JobId: 42 has processed with status: 200
11 2020-09-20T23:48:23.008Z JobId: 42 received result: [
12     {
13          "billedOn": "2020-04-07T15:03:14.257Z",
14          "amount": 22.27
15     },
16     {
17          "billedOn": "2020-05-07T15:03:14.257Z",
18          "amount": 30
19     }
20 ]
21 2020-09-20T23:48:23.022Z JobId: 42 is ready to send callback
22 2020-09-20T23:48:23.024Z RequestId: NFR6B has acknowledged by client (CALLBACK_ACKNOWLEDGED)
```


| Line     | Explanation                                    |
| -------- |:-----------------------------------------------|
| 01       | Received a POST request from client            |
| 02       | Acknowledged with status code 200              |
| 03       | A job (id=42) is created and add to the queue  |
| 04       | The job is processed (fetch the mock server) but it return status code 500 |
| 05       | After 5 seconds, the job retry, but it still got an error |
| 10       | It succeed after 4 attempts                    |
| 11 - 20  | The data crawled                               |
| 21       | Send back the result to the client via the callback url |
| 22       | Client has collected the result and reply an acknowledgement |


#### From the client console log

```
00   <-- POST /api/v1/requests
01 2020-09-20T23:48:07.969Z requestId: NFR6B placed request
02   --> POST /api/v1/requests 200 5ms 47b
03   <-- POST /api/v1/callback?requestId=NFR6B
04 2020-09-20T23:48:23.024Z requestId: NFR6B received callback: [
05     {
06          "requestId": "NFR6B",
07          "provider": "gas",
08          "result": [
09               {
10                    "amount": 22.27,
11                    "billedOn": "2020-04-07T15:03:14.257Z"
12               },
13               {
14                    "amount": 30,
15                    "billedOn": "2020-05-07T15:03:14.257Z"
16               }
17          ]
18     }
19 ]
20   --> POST /api/v1/callback?requestId=NFR6B 200 0ms 35b
```

| Line     | Explanation                                    |
| -------- |:-----------------------------------------------|
| 00       | Endpoint /api/v1/requests is triggered         |
| 01       | Client sent the request to server at 23:48:07 with identifier NFR6B |
| 02       | Response a status 200 to the POST request      |
| 03 & 04  | Collected a result for NFR6B after 16 seconds  |
| 05 - 19  | The crawled data from server                   |
| 20       | Reply to server with an acknowledgement        |


#### Request with multiple providers

Call the same endpoint with the followed body:

Post request body:
```
{
    "providers": [
        {
            "provider": "gas"
        },{
            "provider": "internet"
        }
    ]
}
```

#### From the server console log

```
00  <-- POST /api/v1/requests?requestId=3IQG7
01   --> POST /api/v1/requests?requestId=3IQG7 200 2ms 45b
02 2020-09-21T00:43:17.347Z JobId: 47 queued up with payload [object Object]
03 2020-09-21T00:43:17.347Z JobId: 48 queued up with payload [object Object]
04 2020-09-21T00:43:17.358Z JobId: 47 failed with status: 500
05 2020-09-21T00:43:17.363Z JobId: 47 is being retried! (9)
06 2020-09-21T00:43:17.373Z JobId: 48 failed with status: 500
07 2020-09-21T00:43:17.375Z JobId: 48 is being retried! (9)
08 2020-09-21T00:43:22.371Z JobId: 47 has processed with status: 200
09 2020-09-21T00:43:22.373Z JobId: 47 received result: [
10     {
11          "billedOn": "2020-04-07T15:03:14.257Z",
12          "amount": 22.27
13     },
14     {
15          "billedOn": "2020-05-07T15:03:14.257Z",
16          "amount": 30
17     }
18 ]
19 2020-09-21T00:43:22.390Z JobId: 48 failed with status: 500
20 2020-09-21T00:43:22.393Z JobId: 48 is being retried! (8)
21 2020-09-21T00:43:27.400Z JobId: 48 has processed with status: 200
22 2020-09-21T00:43:27.403Z JobId: 48 received result: [
23     {
24          "billedOn": "2020-02-07T15:03:14.257Z",
25          "amount": 15.12
26     },
27      {
28          "billedOn": "2020-03-07T15:03:14.257Z",
29          "amount": 15.12
30     }
31 ]
32 2020-09-21T00:43:27.418Z JobId: 48 is ready to send callback
33 2020-09-21T00:43:27.420Z RequestId: 3IQG7 has acknowledged by client (CALLBACK_ACKNOWLEDGED)
```

| Line     | Explanation                                    |
| -------- |:-----------------------------------------------|
| 00       | Endpoint /api/v1/requests is triggered with requestId 3IQG7       |
| 02 & 03  | 2 jobs is created (id 47 & 48) and add to the queue at 00:43:17 |
| 08       | Job id 47 crawled successfully after 1 retry        |
| 21       | Job id 48 crwaled successfully after 2 retries      |
| 33       | Server sent back the result at 00:43:27             |  

#### From the client log

```
00  <-- POST /api/v1/requests
01 2020-09-21T00:43:17.344Z requestId: 3IQG7 placed request
02   --> POST /api/v1/requests 200 5ms 47b
03   <-- POST /api/v1/callback?requestId=3IQG7
04 2020-09-21T00:43:27.419Z requestId: 3IQG7 received callback: [
05      {
06           "requestId": "3IQG7",
07           "provider": "gas",
08           "result": [
09               {
10                    "amount": 22.27,
11                    "billedOn": "2020-04-07T15:03:14.257Z"
12               },
13               {
14                    "amount": 30,
15                    "billedOn": "2020-05-07T15:03:14.257Z"
16               }
17          ]
18     },
19     {
20          "requestId": "3IQG7",
21          "provider": "internet",
22          "result": [
23               {
24                    "amount": 15.12,
25                    "billedOn": "2020-02-07T15:03:14.257Z"
26               },
27               {
28                    "amount": 15.12,
29                    "billedOn": "2020-03-07T15:03:14.257Z"
30               }
31          ]
32     }
33 ]
34   --> POST /api/v1/callback?requestId=3IQG7 200 1ms 35b00
```

| Line     | Explanation                                    |
| -------- |:-----------------------------------------------|
| 01       | equestId: 3IQG7 placed request at 00:43:17     |
| 03 & 04  | Callback is collected at 00:43:27              |
| 05 - 33  | Data crawled                                   |
| 34       | Reply to server with an acknowledgement        |



---

### 1. Development

#### Unit Test

In folder `./aggregation-server`, run 

```
$ yarn run unit-tests
```


#### API Test

##### Async Client

Start the Async Client app before executing tests

```
$ yarn start
```

In folder `./async-client`, run

```
$ yarn run api-tests
```

##### Aggregation Server

In folder `./aggregation-server`, run

```
$ yarn run api-tests
```

#### Project structure

```
.
├── aggregation-server               (Root folder of server)
│   ├── lib
│   ├── src
│   │   ├── api-tests                
│   │   │   └── postRequest.spec.js  
│   │   ├── controllers
│   │   │   └── datahog.js           (Jobs creation)
│   │   ├── events
│   │   │   ├── pushResult.js        (Event handler for sending back result)
│   │   │   └── pushResult.spec.js   
│   │   ├── messaging
│   │   │   └── mq.js                (Queue producer and consumer)
│   │   ├── persistence              (DynamoDB interface)
│   │   │   ├── model                (Bind table name)
│   │   │   ├── schema               (Table schema)
│   │   │   ├── scripts              (Create table script)
│   │   │   └── throughput           (throughput setting)
│   │   ├── route                    
│   │   │   └── root.js              (Main route)
│   │   ├── services                 
│   │   │   ├── getJob.js            (Query database)
│   │   │   ├── getJob.spec.js       
│   │   │   ├── saveJob.js           (Insert database)
│   │   │   ├── saveJob.spec.js       
│   │   │   ├── sendHttpCallback.js  (POST request to client)
│   │   │   ├── sendHttpCallback.spec.js  
│   │   │   ├── updateJob.js         (Update database)
│   │   │   └── updateJob.spec.js   
│   │   ├── utils                    
│   │   │   └── setAwsRegion.js      (local AWS config)
│   │   ├── app.js                   (App entry point)
│   │   └── config.js                (App-wise config)
├── async-client                     (Root folder of client)
│   ├── lib
│   └── src
│   │   ├── api-tests
│   │   │   ├── postCallback.spec.js
│   │   │   └── postRequest.spec.js
│   │   ├── route
│   │   │   └── root.js              (Main route)
│   │   ├── services
│   │   │   ├── idGenerator.js       (Generate requestId)
│   │   │   └── requestServer.js     (Post request to aggregation server)
│   │   ├── app.js
│   │   └── config.js                (app-wise config)
├── node_modules
├── open-api-spec                    (Root folder of API spec)
│   ├── client
│   │   ├── Dockerfile               
│   │   └── openapi.yaml             (open api spec entry point)   
│   └── server
│   │   ├── Dockerfile               
│   │   └── openapi.yaml             (open api spec entry point) 
├── package.json
├── README.md                        (Main readme)
└── yarn.lock
```

---

### 2. Architecture

#### Asynchronous client 
- A HTTP server accepting data retrieval request. 
- The request is processed in asynchronous mode and expecting to obtain the result in future, as long as the data providers are available to response. 
- Multiple providers is supported.
- It exposes an endpoint as a callback url for the Aggregation Service to call.

#### Aggregation service 
- A HTTP server accepting data retrieval request.
- The retrieval request will be broken into jobs by providers. Each job serve corresponding provider.
- The status of a request persist in DynamoDB. It has a structure like
  
```
{
  requestId: 999,
  jobs: [
    {
      provider: 'gas',
      url: 'http://localhost:3000/providers/gas'
      status: 'INIT'
    }
  ],
  callbackUrl: 'http://localhost:3100/xxx'
}
```

- The job aims to make HTTP request to the data provider endpoints.
- Each job is placed to a queue.
- A successful job (data provider return 200) trigger a status update to the corresponding requestId in database. It also check the all status in the request. If all jobs has finished, it send back the result to the callback url.
- A failing job (data provider return 500, or others) requeue (backoff) the job in the queue.
- 

Sequence Diagram: 
![alt text][sequence diagram]

[sequence diagram]: ./sequence_diagram.png "Sequence Diagram"

#### DynamoDB
- It serve the source of truth of the status of the data retrieval process.
- The persistence layer expose 3 endpoints:
1. POST /request?id=123 for creating the initial data retrieval request
2. PUT /request?id=123 for updating the job status of the specific provider.
3. GET /request?id=123 for checking if all the jobs finish. 


#### Redis
- It serves the queue service with persistence capability. 

---

### Discussion
