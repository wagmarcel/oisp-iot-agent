#!/bin/bash
# Usage:
# $1 Username
# $2 password
# $3 deviceId
# $4 deviceName

usage="Usage: source $0 username password deviceid [devicename] [gatewayname]"
ROOTDIR=../../../
CLIDIR=node_modules/@open-iot-service-platform/oisp-cli/
CLIBIN=${CLIDIR}/oisp-cli.js

[[ "${BASH_SOURCE[0]}" != "${0}" ]] || { echo "script ${BASH_SOURCE[0]} is not being sourced. Sourcing is needed to get the env variables back."; exit 1; } 


if [ "$#" -lt 3 ]; then
  echo "Not enough arguments"
  echo $usage
  return
fi


USERNAME=$1
PASSWORD=$2
DEVICEID=$3
DEVICENAME=${4:-${DEVICEID}-name}

echo Executing with USERNAME=${USERNAME} DEVICEID=${DEVICEID} DEVICENAME=${DEVICENAME}
mkdir -p node_modules
npm install @open-iot-service-platform/oisp-cli

#steal configuration from agent
echo \{\"admin_file\": \"admin.js\",  > ${CLIDIR}/config/config.json
tail -n +2 ${ROOTDIR}/config/config.json >> ${CLIDIR}/config/config.json

# get token
${CLIBIN} auth.post.token ${USERNAME} ${PASSWORD} 2>/dev/null
${CLIBIN} auth.get.tokeninfo
ACCOUNT=$(${CLIBIN} local.accounts | cut -d " " -f 2) 
echo $ACCOUNT
${CLIBIN} accounts.put.refresh $ACCOUNT
ACT=$(${CLIBIN} accounts.get.activationcode $ACCOUNT | grep activationCode | sed 's/.*activationCode=\(.*\),.*/\1/')

export OISP_DEVICE_ACTIVATION_CODE=$ACT
export OISP_DEVICE_ID=${DEVICEID}
export OISP_DEVICE_NAME=${DEVICENAME}

