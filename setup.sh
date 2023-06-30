#!/bin/bash

echo "Vérification de l'existence de Docker 🐳"
if ! command -v docker &> /dev/null; then
    echo "Docker n'est pas installé. Installation en cours..."
    sudo apt update -y
    sudo apt install ca-certificates curl gnupg -y
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update -y
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin -y
    echo "Docker 🐳 installé"
else
    echo "Docker 🐳 est déjà installé"
fi

echo "Vérification de l'existence de Docker Compose 🐙"
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose n'est pas installé. Installation en cours..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose 🐙 installé"
else
    echo "Docker Compose 🐙 est déjà installé"
fi

echo "Lancement de l'installation de Seedflix 🌱🎬"
sudo apt install curl software-properties-common -y

echo "Nous allons créer un utilisateur pour Seedflix. Merci de renseigner un nom d'utilisateur et un mot de passe."
read -p "Nom d'utilisateur: " username
read -sp "Mot de passe: " password
sudo useradd -m -p $(openssl passwd -1 $password) $username
sudo usermod -aG docker $username
echo "Utilisateur $username créé avec succès !"

echo "Nous allons maintenant créer les dossiers nécessaires à Seedflix."
echo "Merci de renseigner le chemin absolu du dossier de téléchargement (ex: /data ou /media):"
read -p "Chemin absolu: " path
sudo mkdir -p $path/torrents $path/movies $path/tv $path/downloads
sudo chown -R $username:$username $path/torrents $path/movies $path/tv $path/downloads
echo "Dossiers créés avec succès !"

echo "Nous allons maintenant cloner le dépôt Git de Seedflix dans le dossier de l'utilisateur."
sudo -u $username git clone https://github.com/AlxFrst/seedflix.git /home/$username/seedflix
sudo chown -R $username:$username /home/$username/seedflix
echo "Dépôt cloné avec succès !"

echo "Nous allons maintenant créer le fichier .env de Seedflix."
echo "PUID=$(id -u $username)" | sudo tee -a /home/$username/seedflix/.env > /dev/null
echo "PGID=$(id -g $username)" | sudo tee -a /home/$username/seedflix/.env > /dev/null
echo "PATH_MEDIA=$path" | sudo tee -a /home/$username/seedflix/.env > /dev/null
echo "Fichier .env créé avec succès !"

echo "Vérification de l'existence de la tâche cron"
task="1 * * * /usr/bin/sync; echo 1 > /proc/sys/vm/drop_caches /usr/bin/sync; echo 3 > /proc/sys/vm/drop_caches"
crontab_file="/etc/crontab"

if grep -qF "$task" "$crontab_file"; then
    echo "La tâche cron existe déjà dans le fichier crontab."
else
    echo "La tâche cron n'existe pas dans le fichier crontab. Ajout en cours..."
    sudo bash -c "echo '$task' >> $crontab_file"
    echo "La tâche cron a été ajoutée avec succès dans le fichier crontab."
fi

echo "Installation terminée !"
echo "Lancement de Seedflix 🌱🎬"
sudo -u $username docker-compose -f /home/$username/seedflix/docker-compose.yml up -d