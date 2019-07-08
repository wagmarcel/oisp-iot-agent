#!/bin/bash

USER=$1
USER=${USER:="wagmarcel@web.de"}
PASS=$2
PASS=${PASS:="Intel123"}
BASE_COMMAND=${PWD}/oisp-cli.js


${BASE_COMMAND} auth.post.token ${USER} ${PASS}
${BASE_COMMAND} auth.get.tokeninfo
