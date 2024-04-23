define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();

    connection.on('initActivity', initialize);

    function initialize(data) {
        console.log(data);

        // Check if 'Event' data is available
        if (data && data['arguments'] && data['arguments'].execute && data['arguments'].execute.inArguments) {
            var inArguments = data['arguments'].execute.inArguments;

            // Check if the 'Event' data contains the mobile field
            for (var i = 0; i < inArguments.length; i++) {
                var argument = inArguments[i];
                if (argument.recipients && argument.recipients[0] && argument.recipients[0].Mobile) {
                    var mobileValue = argument.recipients[0].Mobile;
                    console.log('Mobile value:', mobileValue);
                }
            }
        }

        // Once initialization is complete, signal that the activity is ready
        connection.trigger('ready');
    }

    // Return the connection object to make it available for other modules
    return connection;
});
