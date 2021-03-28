# Start the network in a detached state
docker-compose up --build --detach

# Grab the container ID for our web service
container_id=$(docker-compose ps -q web)

# Grab the location of the node module: pino-pretty.
pino_pretty_path=${PWD%%/scripts}/node_modules/.bin/pino-pretty

# Follow the web service logs and pipe the output to pretty print it
docker logs --follow $container_id | $pino_pretty_path -c -t