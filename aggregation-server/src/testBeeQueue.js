// const http = require('http')
// var fetchUrl = require("fetch").fetchUrl;
const fetch = require('node-fetch');

const Queue = require('bee-queue');
const queue = new Queue('example', { activateDelayedJobs: true })

const axios = require('axios')

const addJob = async (obj) => {
  const job = await queue.createJob(obj)
  .backoff('exponential', 1000)
  .retries(5)
  .save()

  // console.log('job:', job)

  job.on('succeeded', function (result) {
    console.log('result:', result)
    console.log(`Received result for job ${job.id}: ${result}`);
  });

  job.on('retrying', (err) => {
    console.log(
      `Job ${job.id} failed with error ${err.message} but is being retried!`
    );
    // job.retry()
  });

  return job
}

const job1 = addJob({x: 2})

// const job2 = addJob({x: 4})


// Process jobs from as many servers or processes as you like
queue.process( function (job, done) {
  const k = Math.round(Math.random())
  // console.log(done)
  console.log(new Date().toISOString() + ' jobId=' + job.id + ' k=' + k + ' x=' + job.data.x + ' reminder=' + (job.data.x + k) % 2 + ' retries=' + job.options.retries)

  if ((job.data.x + k) % 2 > 0) {
    // console.log('The reminder is 1!')
    throw Error
  }


  // http.get({
  //   hostname: 'localhost',
  //   port: 3000,
  //   path: '/providers/gas',
  //   agent: false  // Create a new agent just for this one request
  // }, (res) => {
  //   console.log('res', res.statusCode)
    
  //   res.on('data', (d) => {
  //     process.stdout.write(d);
  //   });

  //   return done(null, res.statusCode);
  // });


  // Test OK
  // fetchUrl("http://localhost:3000/providers/gas", function(error, meta, body){
  //   console.log(body.toString());
  //   return done(null, body.toString());
  // });


  // Test OK
  fetch('https://api.github.com/users/github')
    .then(res => res.json())
    .then(json => {
      // console.log(json)
      return done(null, 'Hello');
    });


});
