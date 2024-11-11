'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
const axios = require('axios');
//const FuelRest = require('fuel-rest');

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
// Função para obter o token OAuth
async function getOAuthToken() {
    const authResponse = await axios.post('https://auth.exacttargetapis.com/v1/requestToken', {
        clientId: '0zi6qnu4vepdfsotelvxeimj',
        clientSecret: 'KRjVa8UgYVqRDlbmHIipkpiW'
    });
    return authResponse.data.accessToken;
}

// Função para gravar os dados na Data Extension
async function saveToDataExtension(data) {
    const dePayload = {
        "items": [
            {
                "id": data.id,
                "partnerId": data.partnerId,
                "sender": data.sender,
                "description": data.description,
                "text": data.text,
                "user": data.user,
                "registrationDate": data.registrationDate,
                "records": data.records,
                "status": data.status,
                "sentDate": data.sentDate,
                "error": data.error
            }
        ]
    };

    try {
        // Obter o token OAuth antes de fazer a requisição
        const accessToken = await getOAuthToken();

        const response = await axios.post(
            'https://YOUR_SUBDOMAIN.rest.marketingcloudapis.com/hub/v1/dataevents/key:65659DF6-6DED-4C78-9CF3-5683939E4F36/rowset',
            dePayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        console.log('Dados gravados na Data Extension:', response.data);
    } catch (err) {
        console.error('Erro ao gravar na Data Extension:', err);
    }
}
*/

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
            const entrySourceDE = decoded.inArguments[0].entrySourceDE; // Captura o nome da Data Extension
            console.log("Nome da Data Extension de Entry Source: ", entrySourceDE);
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

/*
let recipients = decoded.inArguments[0].recipients.map(recipient => {
  return { "Mobile": recipient.Mobile };
});
*/
    
let recipients = [];
let mobileNumber = '';
let variavel = '';
let messageText = ''; // Variável para armazenar o texto da mensagem

console.log("decoded.inArguments: ", JSON.stringify(decoded.inArguments));
console.log("decoded.inArguments[0]: ", decoded.inArguments[0]);

// Itera sobre os inArguments
decoded.inArguments.forEach(arg => {
    // Verifica se variavel está presente
    if (arg.variavel) {
        variavel = arg.variavel;
        console.log("variavel: ", variavel);
    } else {
        console.log("variavel não encontrado em: ", arg);
    }

    // Verifica se o texto da mensagem está presente
    if (arg.text) {
        messageText = arg.text;
        console.log("Texto da mensagem: ", messageText);
    }

    // Itera sobre os destinatários para buscar o número de telefone
    if (arg.recipients) {
        arg.recipients.forEach(obj => {
            for (let key in obj) {
                if (obj.hasOwnProperty(key) && key.startsWith('Mobile')) {
                    recipients.push({ "Mobile": obj[key] });
                    mobileNumber = obj[key];
                    console.log("recipients: ", recipients);
                }
            }
        });
    }
});

if (variavel) {
    messageText = messageText.replace("<<variavel>>", variavel);
    console.log("Mensagem final: ", messageText);
} else {
    console.log("variavel está indefinido. Substituição não realizada.");
}

// Gerando um messageId único
const uniqueMessageId = generateUniqueMessageId(mobileNumber);
console.log("Unique Message ID: ", uniqueMessageId);

let data = JSON.stringify({
  "id": uniqueMessageId,
  "description": decoded.inArguments[0].description,
  "sender": decoded.inArguments[0].sender,
  "partnerId": decoded.inArguments[0].partnerId,
//  "text": decoded.inArguments[0].text,
  "text": messageText,
  "variavel": decoded.inArguments[0].variavel,
  "sendnow": "true",
  "recipients": recipients,
  "entrySourceDE": decoded.inArguments[0].entrySourceDE
});

console.log("**** payload sent to Client server ****");
console.log("id: ", uniqueMessageId);
console.log("description: ", decoded.inArguments[0].description);
console.log("sender: ", decoded.inArguments[0].sender);
console.log("partnerId: ", decoded.inArguments[0].partnerId);
//console.log("text: ", decoded.inArguments[0].text);
console.log("text: ", messageText);
console.log("variavel: ", decoded.inArguments[0].variavel);
console.log("sendnow: ", "true");
console.log("Mobile: ", decoded.inArguments[0].recipients[0].Mobile);
console.log("recipients: ", recipients);
console.log("entrySourceDE: ", decoded.inArguments[0].entrySourceDE);

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
  // Chama a função para gravar os dados na Data Extension após a resposta
  //saveToDataExtension(response.data);
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

function generateUniqueMessageId(mobileNumber) {
    const timestamp = new Date().getTime();  // Usa apenas o timestamp
    return `MSG-${mobileNumber}-${timestamp}`;  // Retorna o ID único baseado no timestamp
}
