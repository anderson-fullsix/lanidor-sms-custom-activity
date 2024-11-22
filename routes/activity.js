'use strict';
var util = require('util');

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
}

exports.edit = function (req, res) {
    logData(req);
    res.send(200, 'Edit');
};

exports.save = function (req, res) {
    logData(req);
    res.send(200, 'Save');
};

exports.execute = function (req, res) {
require('dotenv').config();
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            var token = null
            const authToken = process.env.AUTH_TOKEN;
            const urlLogin = process.env.URL_LOGIN;
            
            const config_get = {
              method: 'get',
              maxBodyLength: Infinity,
              url: urlLogin,
              headers: {
                'Authorization': `Basic ${authToken}`,
              },
              data: '',
            };

            axios.request(config_get)
            .then((response) => {
                token = response.data.token

                let recipients = [];
                let mobileNumber = '';
                let variavel = '';
                let variavel2 = '';
                let variavel3 = '';
                let messageText = '';

                decoded.inArguments.forEach(arg => {
                
                    if (arg.variavel) {
                        variavel = arg.variavel;
                    }
                
                    if (arg.variavel2) {
                        variavel2 = arg.variavel2;
                    }
                
                    if (arg.variavel3) {
                        variavel3 = arg.variavel3;
                    }
                    
                    if (arg.text) {
                        messageText = arg.text;
                    }
    
                    if (arg.recipients) {
                        arg.recipients.forEach(obj => {
                            for (let key in obj) {
                                if (obj.hasOwnProperty(key) && key.startsWith('Mobile')) {
                                    recipients.push({ "Mobile": obj[key] });
                                    mobileNumber = obj[key];
                                }
                            }
                        });
                    }
                });

                if (variavel) {
                    messageText = messageText.replace("<<variavel>>", variavel);
                }
                
                if (variavel2) {
                    messageText = messageText.replace("<<variavel2>>", variavel2);
                }
                
                if (variavel3) {
                    messageText = messageText.replace("<<variavel3>>", variavel3);
                }
        
                const uniqueMessageId = generateUniqueMessageId(mobileNumber);
                
                let data = JSON.stringify({
                  "id": uniqueMessageId,
                  "description": decoded.inArguments[0].description,
                  "sender": decoded.inArguments[0].sender,
                  "partnerId": decoded.inArguments[0].partnerId,
                  "text": messageText,
                  "variavel": decoded.inArguments[0].variavel,
                  "variavel2": decoded.inArguments[0].variavel2,
                  "variavel3": decoded.inArguments[0].variavel3,
                  "sendnow": "true",
                  "recipients": recipients
                });
    
                const urlAction = process.env.URL_ACTION;
                    
                let config_post = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: urlAction,
                  headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + token
                  },
                  data : data
                };

                axios.request(config_post)
                .then((response) => {
                })
                .catch((error) => {
                    console.log("Error axios.request response: ", error);
                });
            })
            .catch((error) => {
              console.log("Error axios.request: ", error);
            });

            var decodedArgs = decoded.inArguments[0];
            logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};

exports.publish = function (req, res) {
    logData(req);
    res.send(200, 'Publish');
};

exports.validate = function (req, res) {
    logData(req);
    res.send(200, 'Validate');
};

function generateUniqueMessageId(mobileNumber) {
    const timestamp = new Date().getTime(); 
    return `MSG-${mobileNumber}-${timestamp}`;
}
