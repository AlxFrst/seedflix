#!/bin/sh
sudo echo "Lancement de l'installation de Seedflix 🌱🎬"
sudo apt-get update -y
sudo apt install curl software-properties-common -y
sudo echo "Installation de Docker 🐳 et de Docker Compose 🐙"
sudo apt-get install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings 
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
sudo echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt  install docker-compose-plugin
sudo echo "Docker 🐳 et Docker Compose 🐙 installés"
sudo echo "Création de l'utilisateur media 🧑‍🌾"
# prompt for username
read -p 'Utilisateur: ' uservar
# prompt for password
read -sp 'Password: ' passvar
sudo useradd -m -p $(openssl passwd -1 $passvar) $uservar
sudo adduser $uservar docker
# Prompt user to choose a directory to store media
sudo echo "Création du dossier /data 📁"
read -p 'Dossier de stockage: ' mediavar
sudo mkdir -p $mediavar/torrents $mediavar/movies $mediavar/tv $mediavar/downloads
sudo chown -R $uservar:$uservar $mediavar/torrents $mediavar/movies $mediavar/tv $mediavar/downloads
sudo echo "Dossier /data 📁 créé"
sudo echo "Création du fichier .env 📄"
sudo echo "PUID=1001" >> .env
sudo echo "PGID=1001" >> .env
sudo echo "PATH_MEDIA=$mediavar" >> .env
sudo echo "Fichier .env 📄 créé"
sudo echo "Installation de Seedflix 🌱🎬"
# Lancer docker compose -d en tant que $uservar
sudo -u $uservar docker compose up -d



