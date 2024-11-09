#!/bin/bash

# Se déplacer dans le répertoire contenant le fichier docker-compose.yml
cd /app

# Lancer l'application nextjs
pnpm start

# Tirer les dernières images avec docker-compose
docker-compose pull

# Lancer les conteneurs en mode détaché
docker-compose up -d

# Garder le conteneur en vie
tail -f /dev/null
