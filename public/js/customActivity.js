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

        console.log('*** inArguments ***');
        console.log(inArguments);

        var eventDefinitionKey;

        connection.trigger('requestTriggerEventDefinition');

        connection.on('requestedTriggerEventDefinition', function (eventDefinitionModel) {
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;

	payload['arguments'].execute.inArguments[0].Mobile = '{{Event.' + eventDefinitionKey + '.Mobile}}';
        console.log('*** payload0 ***');
        console.log(payload);
	    
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'id') {
                    $('#id').val(val);
			console.log(id);
                }

                if (key === 'description') {
                    $('#description').val(val);
			console.log(description);
                }

                if (key === 'text') {
                    $('#text').val(val);
			console.log(text);
                }

            });
        });
		
        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });


    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;

	//Code to request tokens
	const authData = {
		username: 'AAA',
		password: 'BBB'
    	};

	// Make a request to your authentication endpoint to get the token
	const authURL = 'https://www.abinfo.pt/api/sms/auth/login'
  	fetch(authURL, {
		method: 'GET',
		headers: {
			'Authorization': `Basic YW5kZXJzb24ubWVuZGVzLWV4dEBmdWxsc2l4LnB0Okxhbmlkb3IjMjAyNCE=`
		}
	})
  .then(response => response.json())
  .then(data => {
    // Use the token for subsequent requests
    const token = data.token;
    tokens.resolve(token);
  })
  .catch(error => {
    console.error('Error:', error);
    tokens.reject(error);
  });
    }

connection.on('execute', function(events) {
  // Execute the activity
  const token = events.token;

  // Make a request to your endpoint using the token
  fetch('https://your-other-endpoint.com/sendPayload', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    connection.trigger('success');
  })
  .catch(error => {
    console.error('Error:', error);
    connection.trigger('fail');
  });
});

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
            "text": text,
            "sender": "{{Contact.Attribute.SMSJourney.sender}}",
            "partnerId": "{{Contact.Attribute.SMSJourney.partnerId}}",
            "sendnow": "true",
            "recipients": 
		[{ "Mobile":"{{Contact.Attribute.SMSJourney.Mobile}}" }]
        }];

        payload['metaData'].isConfigured = true;

        console.log('*** payload ***');
        console.log(payload);
        connection.trigger('updateActivity', payload);

	}
}
})
