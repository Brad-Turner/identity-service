# Grab the location of the node module: pino-pretty.
pino_pretty_path=${PWD%%/scripts}/node_modules/.bin/pino-pretty

timeout=60 # Seconds

RETURN_HEALTHY=0
RETURN_STARTING=1
RETURN_UNHEALTHY=2
RETURN_UNKNOWN=3
RETURN_ERROR=99

# Start the network in a detached state
docker-compose up --build --detach

# Grab the container ID for our web service
container_id=$(docker-compose ps -q web)

function get_health_state {
  state=$(docker inspect -f '{{ .State.Health.Status }}' ${container_id})
  return_code=$?
  if [ ! ${return_code} -eq 0 ]; then
      exit ${RETURN_ERROR}
  fi
  if [[ "${state}" == "healthy" ]]; then
      return ${RETURN_HEALTHY}
  elif [[ "${state}" == "unhealthy" ]]; then
      return ${RETURN_UNHEALTHY}
  elif [[ "${state}" == "starting" ]]; then
      return ${RETURN_STARTING}
  else
      return ${RETURN_UNKNOWN}
  fi
}


# echo "Wait for container '$container_id' to be healthy for max $timeout seconds..."
# for i in `seq ${timeout}`; do
#     get_health_state
#     state=$?
#     if [ ${state} -eq 0 ]; then
#       echo "Container is healthy after ${i} seconds."

#       # Follow the web service logs and pipe the output to pretty print it
      docker logs --follow $container_id | $pino_pretty_path -c -t
#     fi
#     sleep 1
# done

# echo "Timeout exceeded. Health status returned: $(docker inspect -f '{{ .State.Health.Status }}' ${container_id})"
# exit 1