
var cloud;
var logger;
var sensorList;
var waitingRegistrationResponse = false;

var sampleMetric =  { "s": "temp-sensor", "m": "air-temp", "v": 26.7 };
var sampleReg = { "s": "temp-sensor", "t": "float", "u": "Celsius" };


var messageHandler = function(msg) {
    logger.debug("JSON Message: ", msg);

    if (msg === undefined) {
        logger.error('Invalid message received (empty)');
        return;
    }

    if (msg.m !== undefined) {
        // This is a metric message

        // Validate the input args
        if (!msg.s || !msg.m || !msg.v) {
            logger.error('Invalid message format. Expected %j got %j', sampleMetric, msg, {});
            return;
        }

        if (sensorList[msg.s] === undefined) {
            logger.error('The requested sensor: %s have not been registered.', msg.s);
            return;
        }

        if (!waitingRegistrationResponse) {
            cloud.metric(msg);
        } else {
            // TODO: Buffer received message
        }

    } else {
        // This is a registration message

        // Validate the input args
        if (!msg.s) {
            logger.error('Invalid message format. Expected %j got %j', sampleReg, msg, {});
            return;
        }

        sensorList[msg.s] = {   units: msg.u || 'number',
            data_type: msg.t || 'float',
            name: msg.s,
            items: 1 };

        // waitingRegistrationResponse = true;

        cloud.reg(sensorList);

    }
};

var init = function(loggerObj, cloudObj, sensorListObj) {
    logger = loggerObj;
    cloud = cloudObj;
    sensorList = sensorListObj;
}

module.exports.init = init;
module.exports.messageHandler = messageHandler;