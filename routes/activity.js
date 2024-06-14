'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
const axios = require('axios');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
require('dotenv').config();
    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
/*
  const requestOptions = {
  method: "POST",
  body: "teste",
  redirect: "follow"
};

axios.get('https://enickt5gs0alo.x.pipedream.net')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
 */           
var token = null
let config_get = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.abinfo.pt/api/sms/auth/login',
  headers: { 
    'Authorization': 'Basic YW5kZXJzb24ubWVuZGVzLWV4dEBmdWxsc2l4LnB0Okxhbmlkb3IjMjAyNCE='
  },
  data : ""
};

axios.request(config_get)
.then((response) => {
  console.log(JSON.stringify(response.data));
  token = response.data.token
  console.log("token interno: ", token)

  let data = JSON.stringify({
  "id": decoded.inArguments[0].id,
  "description": decoded.inArguments[0].description,
  "sender": decoded.inArguments[0].sender,
  "partnerId": decoded.inArguments[0].partnerId,
  "text": decoded.inArguments[0].text,
  "sendnow": "true",
  "Mobile": decoded.inArguments[0].recipients[0].Mobile[0].Mobile,
/*  "recipients": decoded.inArguments[0].recipients  */
  "recipients": [
    {
      "Mobile": decoded.inArguments[0].recipients
    }
  ]

});
console.log("**** payload sent to Client server ****");
console.log("id: ", decoded.inArguments[0].id);
console.log("description: ", decoded.inArguments[0].description);
console.log("sender: ", decoded.inArguments[0].sender);
console.log("partnerId: ", decoded.inArguments[0].partnerId);
console.log("text: ", decoded.inArguments[0].text);
console.log("Mobile: ", decoded.recipients);
console.log("recipients: ", decoded.inArguments[0].recipients);

let config_post = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.abinfo.pt/api/sms/communications',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ' + token
  },
  data : data
};

axios.request(config_post)
.then((response) => {
  console.log("JSON stringify: ", JSON.stringify(response.data));
})
.catch((error) => {
  console.log("Error axios.request response: ", error);
});
})
.catch((error) => {
  console.log("Error axios.request: ", error);
});

console.log("token externo: ", token)
            
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
            console.log("decoded.inArguments[0]: ", decoded.inArguments[0]);       
            logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};
