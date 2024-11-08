#!/bin/bash

# Se déplacer dans le répertoire contenant le fichier docker-compose.yml
cd /app  # Remplace /app par le répertoire où tu stockes ton fichier docker-compose.yml

# Tirer les dernières images avec docker-compose
docker-compose pull

# Lancer les conteneurs en mode détaché
docker-compose up -d

# Garder le conteneur en vie
tail -f /dev/null
