/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var path = require('path'),
    Cloud = require("../api/cloud.proxy"),
    conf = require('../config'),
    Message = require('../lib/agent-message'),
    utils = require("../lib/utils").init(),
    logger = require("../lib/logger").init(),
    Component = require('../lib/data/Components'),
    common = require('../lib/common');

var filename = "sensor-list.json";
function getStoreFileName () {
    return path.join(__dirname, '../data/' +  filename);
}

var resetComponents = function () {
    var fullFilename = getStoreFileName();
    var data = [];
    return common.writeToJson(fullFilename, data);
};

var registerComponents = function (comp, catalogid) {
    logger.info("Starting registration ..." );
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(conf, logger, id);
        cloud.activate(function (status) {
            var r = 0;
            if (status === 0) {
                var agentMessage = Message.init(cloud, logger);
                var msg = {
                        "n": comp,
                        "t": catalogid
                        };
                agentMessage.handler(msg, function (stus){
                    logger.info("Components registered", stus);
                    process.exit(r);
                });

            } else {
                logger.error("Error in the activation process ...", status);
                process.exit(1);
            }

        });
    });
}
function registerObservation (comp, value) {
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(conf, logger, id);
        cloud.activate(function (status) {
            var r = 0;
            if (status === 0) {
                var agentMessage = Message.init(cloud, logger);
                var msg = {
                    "n": comp,
                    "v": value
                };
                agentMessage.handler(msg, function (stus){
                    logger.info("Observation Sent", stus);
                    process.exit(r)
                });

            } else {
                logger.error("Error in the Observation Submission process ...", status);
                process.exit(1)
            }

        });
    });
}

function getComponentsList () {
    var com = common.readFileToJson(getStoreFileName());
    var table = new Component.Register(com);
    console.log(table.toString());
}
function getCatalogList  () {
    utils.getDeviceId(function (id) {
        var cloud = Cloud.init(conf, logger, id);
        cloud.catalog(function (catalog) {
            var table = new Component.Table(catalog);
            logger.info("Catalog Retrieved ");
            console.log(table.toString());
        });
    });
}

module.exports = {
    addCommand : function (program) {
        program
            .command('register <comp_name> <catalogid>')
            .description('Display registered components.')
            .action(registerComponents);
        program
            .command('reset-components')
            .description('clear the component lists.')
            .action(resetComponents);
        program
            .command('observation  <comp_name> <value>')
            .description('Display registered components.')
            .action(registerObservation);
        program
            .command('catalog')
            .description('Display Catalog of Device Account.')
            .action(getCatalogList);
        program
            .command('components')
            .description('Display Components Register at Devices.')
            .action(getComponentsList);
    },
    runCommand: function (program) {
       if (program.initialize) {
            resetComponents();
        }
    }
};
