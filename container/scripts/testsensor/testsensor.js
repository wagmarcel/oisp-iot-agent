#!/usr/bin/env node
// dummy sensor sending random values every 5s
"use strict";
var dgram = require('dgram');

var PORT = 41234;
var HOST = '127.0.0.1';
var tempValue = 20;
var componentType = "Temperature.v1.0"
var componentName = "temp"




var registerComponent = function(componentType, name) {
    var component = { "t": componentType, "n": name }
    var comp_message = new Buffer(JSON.stringify(component));
    var client = dgram.createSocket('udp4');
    client.send(comp_message, 0, comp_message.length, PORT, HOST, function(err, response) {
        client.close();
    });
}

var sendObservation = function(data, cb) {
    var message = new Buffer(JSON.stringify(data));

    var client = dgram.createSocket('udp4');
    client.send(message, 0, message.length, PORT, HOST, function(err, response) {
        cb && cb(err, response);
        client.close();
    });
}

var getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//first register the temp component
registerComponent(componentType, componentName);

setInterval(function() {
    //to be on the save side re-register. Agent will realize if already existing
    registerComponent(componentType, componentName);
    var telemetry = { "n": "temp", "v": tempValue };
    sendObservation(telemetry, function(err, bytes) {
        if (err) console.log("Error:", err);
        console.log(telemetry)
        var change = getRandomInteger(100, -100)
        tempValue += change / 100.0
    })
}, 5 * 1000)
