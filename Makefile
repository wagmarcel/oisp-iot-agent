
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

IMAGE_NAME=oisp/oisp-iot-agent
CONTAINER_NAME=oisp-iot-agent

build:
	@$(call msg,"Building oisp-agent ...");
	@/bin/bash -c "docker build . -t ${IMAGE_NAME}"

start:
	@$(call msg,"Starting oisp-agent container...");
	@echo Starting container with the following settings: OISP_DEVICE_ACTIVATION_CODE="${OISP_DEVICE_ACTIVATION_CODE}" \
		OISP_DEVICE_ID="${OISP_DEVICE_ID}"
	@/bin/bash -c "docker run -d -t -i --rm --network=host \
					--env OISP_DEVICE_ACTIVATION_CODE=${OISP_DEVICE_ACTIVATION_CODE} \
					--env OISP_DEVICE_ID=${OISP_DEVICE_ID} \
					--env	OISP_DEVICE_NAME=${OISP_DEVICE_NAME} \
					--env	OISP_FORCE_REACTIVATION=${OISP_FORCE_REACTIVATION} \
					--env OISP_AGENT_CONFIG=${OISP_AGENT_CONFIG} --name ${CONTAINER_NAME} ${IMAGE_NAME}"

stop:
	@$(call msg,"Stopping oisp-agent ...");
	@/bin/bash -c "docker stop ${CONTAINER_NAME}"


clean: stop
	@$(call msg,"Cleaning ...");
	@/bin/bash -c "docker rmi ${IMAGE_NAME}"
	
test: build start
	@make -C container test
	
#----------------------------------------------------------------------------------------------------------------------
# helper functions
#----------------------------------------------------------------------------------------------------------------------

define msg
	tput setaf 2 && \
	for i in $(shell seq 1 120 ); do echo -n "-"; done; echo -n "\n" && \
	echo "\t"$1 && \
	for i in $(shell seq 1 120 ); do echo -n "-"; done; echo "\n" && \
	tput sgr0
endef
