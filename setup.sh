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
# autosetup variables
autosetup=false
# supervision variables
supervision=false
grafana_influx_user="#grafana_influx_user#"
grafana_influx_password="#grafana_influx_password#"



# User creation
echo "🌱🎬 Démarrage de l'installation de Seedflix !"
if [ "$username" = "#username#" ]; then
    echo "🙎‍♂️ Création d'un utilisateur pour Seedflix. Veuillez fournir un nom d'utilisateur et un mot de passe."
    read -p "Nom d'utilisateur: " username
    else
    echo "🙎‍♂️ Création d'un utilisateur pour Seedflix. Veuillez fournir un mot de passe pour l'utilisateur $username."
fi
if [ "$password" = "#userpassword#" ]; then
    echo "🔒 Veuillez fournir un mot de passe pour l'utilisateur $username."
    read -p "Mot de passe: " password
    echo "🔒 Création de l'utilisateur $username avec le mot de passe $password."
fi
if [ "$path" = "#path#" ]; then
    echo "📁 Veuillez fournir le chemin absolu du dossier de téléchargement (ex: /data ou /media)."
    read -p "Chemin: " path
    echo "📁 Création des dossiers nécessaires à Seedflix dans $path."
fi
if [ $autosetup = false ]; then
    echo "🔍 Voulez-vous lancer l'installation automatique des apps Seedflix ?"
    read -p "y/n: " autosetup
    if [[ -z $autosetup ]]; then
        autosetup=false
    elif [[ "$autosetup" = "y" ]]; then
        autosetup=true
    else
        autosetup=false
    fi
fi
if [ $supervision = false ]; then
    echo "🔍 Voulez-vous lancer l'installation de la supervision ?"
    read -p "y/n: " supervision
    if [[ -z $supervision ]]; then
        supervision=false
    elif [[ "$supervision" = "y" ]]; then
        supervision=true
        if [ "$grafana_influx_user" = "#grafana_influx_user#" ]; then
            echo "🙎‍♂️ Veuillez fournir un nom d'utilisateur pour Grafana et InfluxDB."
            read -p "Nom d'utilisateur: " grafana_influx_user
        fi
        if [ "$grafana_influx_password" = "#grafana_influx_password#" ]; then
        # we need to be sure the password contains at least 8 characters if not we ask again
        while true; do
            echo "🔒 Veuillez fournir un mot de passe pour l'utilisateur $grafana_influx_user."
            read -p "Mot de passe: " grafana_influx_password
            if [[ ${#grafana-influx-password} -lt 8 ]]; then
                echo "❌ Le mot de passe doit contenir au moins 8 caractères."
            else
                break
            fi
        done
        fi
    else
        supervision=false
    fi
fi

# DEBUG
echo "username: $username"
echo "password: $password"
echo "path: $path"
echo "autosetup: $autosetup"
echo "supervision: $supervision"
echo "grafana-influx-user: $grafana-influx-user"
echo "grafana-influx-password: $grafana-influx-password"

# stop the script
exit 1


# Verify & install docker if not installed
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

# Verify & install docker compose if not installed
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
sudo useradd -m -p $(openssl passwd -1 $password) $username
sudo usermod -aG docker $username
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

# Supervision installation
if [ "$supervision" = true ] ; then
    echo "[SUPVERVISION] Installation en cours 👀"
    sudo -u $username sed -i "s/1000/$(getent group docker | cut -d: -f3)/g" /home/$username/seedflix/supervision/.env
    sudo -u $username docker compose -f /home/$username/seedflix/supervision/docker-compose.yml up -d
    else 
    echo "[SUPERVISION] Pas d'installation ❌]"
fi


# Services apps installation
if [ "$autosetup" = true ] ; then
    echo "[AUTO-SETUP] Installation en cours 👀"
    # Ask for jellyfin user and password
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt update -y > /dev/null
    sudo apt-get install -y nodejs > /dev/null
    sudo apt-get install -y chromium-browser > /dev/null
    sudo apt-get install -y libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 > /dev/null
    sudo -u $username npm install --prefix /home/$username/seedflix/autosetup > /dev/null
    # Put here multiples sed command to replace the values in the autosetup/index.js file
    # 
    # 
    # 
    # 
    # 
    sudo -u $username node /home/$username/seedflix/autosetup/index.js
    else
    echo "[AUTO-SETUP] Pas d'installation automatique des services Seedflix ❌]"
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
echo "Jackett http://localhost:9117"
if [ "$supervision" = true ] ; then
    echo "🔍 La supervision"
    echo "Grafana http://localhost:3000"
    echo "InfluxDB http://localhost:8086"
fi