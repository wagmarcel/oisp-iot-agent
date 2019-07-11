
#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

IMAGE_NAME="oisp/oisp-testsensor"
CONTAINER_NAME="oisp-testsensor"
DOCKERFILE_NAME="Dockerfile.testsensor"

build:
	@$(call msg,"Building testsensor ...");
	@/bin/bash -c "docker build . -t ${IMAGE_NAME} -f ${DOCKERFILE_NAME}"

start:
	@$(call msg,"Starting testsensor ...");
	@/bin/bash -c "docker run -d -t -i --rm --network=host --name ${CONTAINER_NAME} ${IMAGE_NAME}"

stop:
	@$(call msg,"Stopping testsensor ...");
	@/bin/bash -c "docker stop ${CONTAINER_NAME}"

clean: stop
	@$(call msg,"Cleaning ...");
	@/bin/bash -c "docker rmi ${IMAGE_NAME}"

test: build
	(cd scripts/getagentenv; \
	npm install @open-iot-service-platform/oisp-cli; \
	./setupCLIConfigFromLocal.sh;)
	
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
