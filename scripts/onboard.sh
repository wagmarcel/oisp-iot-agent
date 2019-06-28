#!/bin/bash
# Author: Marcel Wagner
# Brief: Script to setup a new device
# Description: Dependend on Env variables it will activate/re-activate and register components
# Environemnt:
# - OISP_DEVICE_ACTIVATION_CODE if defined and device is not yet activated, it will activate using the code in
#                        the variable
# - OISP_DEVICE_ID the device id for activation
# - OISP_DEVICE_NAME the device name for activation
# - OISP_FORCE_REACTIVATION if set to "true" it will initialize the device and activate again with the code in
#                           OISP_ACTIVATION_CODE


# How can I check whether device is activated? There is only a test for connectivity
# For the time being, it checks whether device has a token.

function fail {
    echo $1
    exit 1
}

ADMIN=../oisp-admin.js
TOKEN=$(cat data/device.json | jq ".device_token")

if [ "$TOKEN" = "false" || ! -z "$OISP_FORCE_REACTIVATION"]; then
    if [ ! -n "$OSIP_DEVICE_ACTIVATION_CODE" ]; then
        fail "No Device Activation Code given but no token found or reactivation is forced"
    fi
    
    ${ADMIN} initialize
    if [ ! -z "$OISP_DEVICE_ID" ]; then
        ${ADMIN} set-device-id $OISP_DEVICE_ID
    else
        fail "No device id given"
    fi
    
    if [ ! -z "$OISP_DEVICE_NAME" ]; then
        ${ADMIN} set-device-name $OISP_DEVICE_NAME
    fi
    ${ADMIN} activate $OISP_DEVICE_ACTIVATION_CODE
fi

