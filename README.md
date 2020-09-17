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

### 1. Architecture

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

#### DynamoDB
- It serve the source of truth of the status of the data retrieval process.
- The persistence layer expose 3 endpoints:
1. POST /request?id=123 for creating the initial data retrieval request
2. PUT /request?id=123 for updating the job status of the specific provider.
3. GET /request?id=123 for checking if all the jobs finish. 


#### Redis
- It serves the queue service with persistence capability. 

---

### 2. Open API Specification
- API Spec first approach
- There are two API spec under this project
#### API spec for Asynchronous Client

To view the spec, go to folder `./open-api-spec/client/`, run

```
$ npm start
```

The spec can be accessed at localhost:8080

#### API spec for Aggregation Server

To view the spec, go to folder `./open-api-spec/server/`, run

```
$ npm start
```

The spec can be accessed at localhost:8080



