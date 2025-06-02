'use strict';

require('dotenv').config();

const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const axios = require('axios');

exports.logExecuteData = [];

let cachedToken = null;
let tokenExpiresAt = 0; // em milissegundos

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

async function getAuthToken() {
    const now = Date.now();

    if (cachedToken && tokenExpiresAt > now) {
        return cachedToken;
    }

    const authToken = process.env.AUTH_TOKEN;
    const urlLogin = process.env.URL_LOGIN;

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: urlLogin,
        headers: {
            'Authorization': `Basic ${authToken}`
        },
        data: ''
    };

    const response = await axios.request(config);
    cachedToken = response.data.token;

    // Ajuste aqui se o servidor retornar tempo de expiração (em segundos)
    tokenExpiresAt = now + (5 * 60 * 1000); // Assume 5 minutos

    return cachedToken;
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
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            getAuthToken()
            .then((token) => {
                let recipients = [];
                let mobileNumber = '';
                let variavel = '';
                let variavel2 = '';
                let variavel3 = '';
                let messageText = '';

                decoded.inArguments.forEach(arg => {
                    if (arg.variavel) variavel = arg.variavel;
                    if (arg.variavel2) variavel2 = arg.variavel2;
                    if (arg.variavel3) variavel3 = arg.variavel3;
                    if (arg.text) messageText = arg.text;

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

                if (variavel) messageText = messageText.replace("<<variavel>>", variavel);
                if (variavel2) messageText = messageText.replace("<<variavel2>>", variavel2);
                if (variavel3) messageText = messageText.replace("<<variavel3>>", variavel3);

                const uniqueMessageId = generateUniqueMessageId(mobileNumber);

                const data = JSON.stringify({
                    "id": uniqueMessageId,
                    "description": decoded.inArguments[0].description,
                    "sender": decoded.inArguments[0].sender,
                    "partnerId": decoded.inArguments[0].partnerId,
                    "text": messageText,
                    "variavel": variavel,
                    "variavel2": variavel2,
                    "variavel3": variavel3,
                    "sendnow": "true",
                    "recipients": recipients
                });

                const urlAction = process.env.URL_ACTION;

                const config_post = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: urlAction,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    data: data
                };

                axios.request(config_post)
                .then((response) => {
                    console.log("Mensagem enviada com sucesso:", response.data);
                })
                .catch((error) => {
                    console.error("Erro ao enviar mensagem:", error);
                });

                logData(req);
                res.send(200, 'Execute');
            })
            .catch((error) => {
                console.error("Erro ao obter token:", error);
                return res.status(500).send("Erro na autenticação");
            });
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
