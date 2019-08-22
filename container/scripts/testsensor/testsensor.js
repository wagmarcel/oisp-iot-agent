#!/usr/bin/env node
// dummy sensor sending random values
// defined by environment
// TEST_SAMPLES: if set number of samples to send before terminating
// COMPONENT_TYPE: name of the component type
// COMPONENT_NAME: name of the component
"use strict";
var dgram = require('dgram');
var PD = require("probability-distributions");

var PORT = 41234;
var HOST = '127.0.0.1';
var values = {};
var numSamples = 0;
var componentType = "temperature.v1.0";
var componentName = "temp";
var testSamples;
var sensorSpecs= [
    {
	agents: [
	    {
		port: 41234,
		host: "127.0.0.1"
	    },
	    {
		port: 41244,
		host: "127.0.0.1"
	    }
	],
	name: "tempSensor",
	componentName: "temp",
	componentType: "temperature.v1.0",
	type: "number",
	sigma: 0.1,
	startValue: 20
    },
    {
	agents: [
	    {
		port: 41244,
		host: "127.0.0.1"
	    }
	],
	name: "stateSensor",
	componentName: "internalState",
	componentType: "machineDescription.v1.0",
	type: "string",
	startValue: "mydeviceinfo"
    }
]

if (process.env.TEST_SAMPLES) {
    testSamples = process.env.TEST_SAMPLES;
}

/*if (process.env.COMPONENT_TYPE) {
    componentType = process.env.COMPONENT_TYPE;
}
if (process.env.COMPONENT_NAME) {
    componentName = process.env.COMPONENT_NAME;
}*/



var registerComponent = function(spec) {
    var component = { "t": spec.componentType, "n": spec.componentName }
    var comp_message = new Buffer(JSON.stringify(component));
    spec.agents.forEach(function(agent){
	var client = dgram.createSocket('udp4');
	console.log("Marcel registring: ", agent);
	client.send(comp_message, 0, comp_message.length, agent.port, agent.host, function(err, response) {
            if (err) console.log("Error:", err);
            client.close();
            console.log("registering " + JSON.stringify(component));
	});
    });
}

var sendObservation = function(spec, data, cb) {
    var message = new Buffer(JSON.stringify(data));
    spec.agents.forEach(function(agent) {
	var client = dgram.createSocket('udp4');
	client.send(message, 0, message.length, agent.port, agent.host, function(err, response) {
            cb && cb(err, response);
            client.close();
	});
    });
}

var getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//initialize all values
sensorSpecs.forEach(function(spec) {
    values[spec.name] = spec.startValue; 
});

//first register the temp component
sensorSpecs.forEach(function(spec) {
    setTimeout(
	function() {registerComponent(spec)}, 5000);
});


sensorSpecs.forEach(function(spec){
    setTimeout(
	function(){ setInterval(function() {
	    //to be on the save side re-register. Agent will realize if already existing
	    registerComponent(spec);
	    var value = values[spec.name];
	    var telemetry = { "n": componentName, "v": value };
	    sendObservation(spec, telemetry, function(err, bytes) {
		if (err) console.log("Error:", err);
		console.log(telemetry)
		if (spec.type === "number") {
		    var change = PD.rnorm(1, 0, spec.sigma);
		    value += change[0];
		    values[spec.name] = value;
		}
		numSamples++;
		if (testSamples && numSamples >= testSamples) {
		    console.log("Maximal number of testsamples reached. Terminating!")
		    process.exit(0);
		}
	    })
	}, 5 * 1000)}, 10000)
});
