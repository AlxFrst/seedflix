#!/bin/bash

echo "███████ ███████ ███████ ██████  ███████ ██      ██ ██   ██ "
echo "██      ██      ██      ██   ██ ██      ██      ██  ██ ██  "
echo "███████ █████   █████   ██   ██ █████   ██      ██   ███   "
echo "     ██ ██      ██      ██   ██ ██      ██      ██  ██ ██  "
echo "███████ ███████ ███████ ██████  ██      ███████ ██ ██   ██ "

# variables terraform or vagrant modify this to automate the installation
username="#username#"
password="#userpassword#"
path="#path#"
autosetup=false

echo "🔍 Vérification de l'existence de Docker..."
if ! command -v docker &> /dev/null; then
echo "❌ Docker n'est pas installé. Installation en cours..."
sudo apt update -y
sudo apt install ca-certificates gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin -y
echo "✅ Docker installé"
else
echo "✅ Docker est déjà installé"
fi

echo "🔍 Vérification de l'existence de Docker Compose..."
if ! command docker compose version &> /dev/null; then
echo "❌ Docker Compose n'est pas installé. Installation en cours..."
sudo apt install docker-compose-plugins -y
echo "✅ Docker Compose installé"
else
echo "✅ Docker Compose est déjà installé"
fi

echo "🌱🎬 Installation de Seedflix en cours..."
sudo apt install curl software-properties-common -y

echo "💡 Création d'un utilisateur pour Seedflix. Veuillez fournir un nom d'utilisateur et un mot de passe."
if [ "$username" = "#username#" ]; then
    read -p "Nom d'utilisateur: " username
fi
if [ "$password" = "#userpassword#" ]; then
    read -p "Mot de passe: " password
fi

sudo useradd -m -p $(openssl passwd -1 $password) $username
sudo usermod -aG docker $username
echo "✅ Utilisateur $username créé avec succès !"

echo "💡 Création des dossiers nécessaires à Seedflix."
echo "Veuillez fournir le chemin absolu du dossier de téléchargement (ex: /data ou /media):"
if [ "$path" = "#path#" ]; then
    read -p "Chemin absolu: " path
fi

sudo mkdir -p $path/torrents $path/movies $path/tv $path/downloads
sudo chown -R $username:$username $path/torrents $path/movies $path/tv $path/downloads
echo "✅ Dossiers créés avec succès !"

echo "💡 Clonage du dépôt Git de Seedflix dans le dossier de l'utilisateur."
sudo -u $username git clone https://github.com/AlxFrst/seedflix.git /home/$username/seedflix
sudo chown -R $username:$username /home/$username/seedflix
echo "✅ Dépôt cloné avec succès !"

echo "💡 Création du fichier .env de Seedflix."
echo "PUID=$(id -u $username)" | sudo tee -a /home/$username/seedflix/.env > /dev/null
echo "PGID=$(id -g $username)" | sudo tee -a /home/$username/seedflix/.env > /dev/null
echo "PATH_MEDIA=$path" | sudo tee -a /home/$username/seedflix/.env > /dev/null
echo "✅ Fichier .env créé avec succès !"

echo "🔍 Vérification de l'existence de la tâche cron"
task="1 * * * /usr/bin/sync; echo 1 > /proc/sys/vm/drop_caches /usr/bin/sync; echo 3 > /proc/sys/vm/drop_caches"
crontab_file="/etc/crontab"

if grep -qF "$task" "$crontab_file"; then
echo "✅ La tâche cron existe déjà dans le fichier crontab."
else
echo "❌ La tâche cron n'existe pas dans le fichier crontab. Ajout en cours..."
sudo bash -c "echo '$task' >> $crontab_file"
echo "✅ La tâche cron a été ajoutée avec succès dans le fichier crontab."
fi

echo "🎉 Installation terminée !"
echo "🌱🎬 Lancement de Seedflix..."
sudo -u $username docker compose -f /home/$username/seedflix/docker-compose.yml up -d

# Ask user if he want auto setup y/n if yes set autosetup to true
echo "🔍 Voulez-vous lancer l'installation automatique des apps Seedflix ? [Work in progress]"
read -p "y/n: " autosetup
if [ "$autosetup" = "y" ] ; then
    autosetup=true
    else
    autosetup=false
fi


# if autosetup is true then run the nodejs script
if [ "$autosetup" = true ] ; then
    echo "🔍 Lancement de l'installation automatique de Seedflix..."
    # install nodejs 16 and npm
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt update -y
    sudo apt-get install -y nodejs
    sudo apt-get install -y chromium-browser
    sudo apt-get install libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 
    sudo -u $username npm i --prefix /home/$username/seedflix/autosetup
    else
    echo "Pas d'installation automatique de Seedflix."
fi

echo "🎉 Installation terminée !"
echo "Vous pouvez accéder à vos applications aux adresses suivante:"
echo "🔍 Les applications"
echo "Jellyfin http://localhost:8096"
echo "Radarr http://localhost:7878"
echo "Sonarr http://localhost:8989"
echo "qBittorrent http://localhost:8080"
echo "FlareSolverr http://localhost:8191"
echo "JellySeerr http://localhost:5055"