#!/bin/bash
# Usage:
# $1 accountid
# $2 deviceid
# $3 componentname

usage="Usage: source $0 accountid deviceid componentname"
ROOTDIR=../../../
CLIDIR=node_modules/@open-iot-service-platform/oisp-cli/
CLIBIN=${CLIDIR}/oisp-cli.js

if [ "$#" -lt 3 ]; then
  echo "Not enough arguments"
  echo $usage
  exit 1
fi

ACCOUNTID=$1
DEVICEID=$2
COMPONENTNAME=$3

echo Executing with ACCOUNTID=${ACCOUNTID} DEVICEID=${DEVICEID} COMPONENTNAME=${COMPONENTNAME} 1>&2

# get token
${CLIBIN} devices.get ${ACCOUNTID} >/dev/null 2>&1
${CLIBIN} data.post.search ${ACCOUNTID} ${DEVICEID} ${COMPONENTNAME} 0 $(date +%s) | grep series | jq '.series[0].points | length'
