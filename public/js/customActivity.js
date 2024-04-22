define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');  

    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'id') {
                    $('#id').val(val);
                }

                if (key === 'description') {
                    $('#description').val(val);
                }

                if (key === 'text') {
                    $('#text').val(val);
                }

            });
        });

        // Chama a função para gerar o token OAuth
        gerarTokenOAuth()
            .then(accessToken => {
                console.log('Token OAuth gerado:', accessToken);
                $('#accessToken').val(accessToken);

                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'done',
                    visible: true
                });
            })
            .catch(error => {
                console.error('Erro ao gerar token OAuth:', error);
                // Trate o erro conforme necessário
            });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    // Função para fazer a chamada à API e gerar o token OAuth
    function gerarTokenOAuth() {
    var urlLogin = "https://www.abinfo.pt/api/sms/auth/login";
    var token = "YW5kZXJzb24ubWVuZGVzLWV4dEBmdWxsc2l4LnB0Okxhbmlkb3IjMjAyNCE=";
    var auth = "Bearer " + token;

    return axios.get(urlLogin, {
        headers: {
            Authorization: auth
        }
    })
    .then(response => {
        return response.data.token;
    })
    .catch(error => {
        throw error;
    });
}

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        let now = Date.now();
        var id = $('#id').val();
        var description = $('#description').val();
        var text = $('#text').val();
        var sendingDate = now;
        
        payload['arguments'].execute.inArguments = [{
            "id": id,
            "description": description,
            "sender": "LANIDOR",
            "partnerId": "508006007",
            "text": text,
            "sendnow": "true",
            "recipients": [
                       {
                           "Mobile":"{{InteractionDefaults.MobileNumber}}"
                       }
                   ]
        }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }


});
