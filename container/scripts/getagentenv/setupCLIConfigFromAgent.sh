#!/bin/bash
# Is copying a ready config.json from oisp-iot-agent/conf to oisp-cli/conf

#steal configuration from agent
echo \{\"admin_file\": \"admin.js\",  > ${CLIDIR}/config/config.json
tail -n +2 ${ROOTDIR}/config/config.json >> ${CLIDIR}/config/config.json
