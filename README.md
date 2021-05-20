# Introduction
This is a backend side of the react native app named SmartHero to sell products.
This repository will content the setup of database docker container uesing docker-compose

# Preparation
I assume that you already have Docker and Docker Compose installed on your machine. If not, please refer to https://docs.docker.com/install/ for Docker installation and refer to https://docs.docker.com/compose/install/ for Docker Compose installation.

# What is the Docker Compose file  means?
It will have MongoDB image and it will take the latest version. MongoDB will have user root and password rootpassword. It will expose port 27017 to the host machine.

It will also using data container to save the data, called mongodb_data_container. It's useful for data persistent, so the data will not be deleted even later you call command ```docker-compose down```.

# Run it
```console
docker-compose up -d
```
Above command will start the services on detach mode (similar like running in the background)

# Connection with the database server
To connect to the server open the shell of this container and write.
```console
mongo admin -u root -p rootpassword
```
Or you can use the mongodb Compass. You should download the program https://www.mongodb.com/try/download/compass and give the informations of connection in the programm. You must have the ip of docker machine. In my case it was 192.168.99.100. Then give the port numper exp. 27017 finally the username and password. 
