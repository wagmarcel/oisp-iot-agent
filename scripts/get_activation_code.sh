#!/bin/bash
# Assumption: There are two users registered

BASE_COMMAND=~/oisp-cli/oisp-cli.js


ACTIVATION_CODE=$(${BASE_COMMAND} accounts.put.refresh MyAcc| egrep -o "activationCode=[0-9a-zA-Z]*"| cut -d "=" -f 2)
echo "Refresh activation code:" $ACTIVATION_CODE
