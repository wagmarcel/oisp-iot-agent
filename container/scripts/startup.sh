#!/bin/bash
# Author: Marcel Wagner
# Brief: This script is main entrypoint for the Container


# mount config and data directory
# agent expects ./config and ./data locally
# Volume is mounted to /var and ./config and ./data are mounted to /var/config
# and /var/data
# copy ./config/index.js and ./config/config,json only if non-existent
# and ./data/device.json if non existent
ROOTDIR=/app
MNTDIR=/volume

if [ ! -d ${MNTDIR}/config ];then
  mkdir ${MNTDIR}/config
fi
if [ ! -d ${MNTDIR}/data ]; then
  mkdir ${MNTDIR}/data
fi
if [ ! -f ${MNTDIR}/config/index.js ];then
  cp ${ROOTDIR}/config/index.js ${MNTDIR}/config
fi
if [ ! -f ${MNTDIR}/config/config.json ];then
  cp ${ROOTDIR}/config/config.json ${MNTDIR}/config
fi
if [ ! -f ${MNTDIR}/data/devie.json ];then
  cp ${ROOTDIR}/data/device.json ${MNTDIR}/data
fi

rm -rf ${ROOTDIR}/config ${ROOTDIR}/data
ln -s ${MNTDIR}/config ${ROOTDIR}/config 
ln -s ${MNTDIR}/data ${ROOTDIR}/data 
  
# activate if needed
(cd ${ROOTDIR}/container/scripts; ./onboard.sh)

(cd ${ROOTDIR}; ./oisp-agent.js)
