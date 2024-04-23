define([
    'postmonger',
    'jquery' // Add jQuery as a dependency
], function (
    Postmonger,
    $
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedDataSources', onRequestedDataSources);
    connection.on('clickedNext', save);

    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestDataSources');
    }

    function onRequestedDataSources(dataSources) {
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        // Retrieve and process form field values if necessary
        // For example:
        var id = $('#id').val();
        var description = $('#description').val();
        var text = $('#text').val();
        var sender = $('#sender').val();
        var mobile = $('#mobile').val();
        
        // Log retrieved values for debugging
        console.log("id: " + id);
        console.log("description: " + description);
        console.log("text: " + text);
        console.log("sender: " + sender);
        console.log("mobile: " + mobile);

        // Update activity payload if needed
        payload['metaData'].isConfigured = true;
        console.log(payload);
        connection.trigger('updateActivity', payload);
    }
});
