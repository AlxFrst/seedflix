#!/bin/bash

sudo clear

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
jellyfinuser="#jellyfinuser#"
jellyfinpassword="#jellyfinpassword#"
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
        if [ "$jellyfinuser" = "#jellyfinuser#" ]; then
            echo "🙎‍♂️ Veuillez fournir un nom d'utilisateur pour Jellyfin."
            read -p "Nom d'utilisateur: " jellyfinuser
        fi
        if [ "$jellyfinpassword" = "#jellyfinpassword#" ]; then
            echo "🔒 Veuillez fournir un mot de passe pour l'utilisateur $jellyfinuser."
            read -p "Mot de passe: " jellyfinpassword
        fi
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
            if [[ ${#grafana_influx_password} -lt 8 ]]; then
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

echo "L'installation va commencer dans 10 secondes, profitez-en pour vous servir un café ☕"
# create a countdown


# create a HOME variable for the user
export HOME=/home/$username

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

# Seedflix installation basics
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
    echo "[SUPERVISION] Pas d'installation ❌"
fi


# Services apps installation
if [ "$autosetup" = true ] ; then
    echo "[AUTO-SETUP] Installation en cours 👀"
    # SED FOR JS FILES
    # Exec JS files
    else
    echo "[AUTO-SETUP] Pas d'installation automatique des services Seedflix ❌"
fi

# Final message
echo "----------------------------------------"
echo "🎉 Installation terminée !"
echo "----------------------------------------"
echo "Vous pouvez accéder à vos applications aux adresses suivante:"
echo "----------------------------------------"
echo "🔍 Les applications"
echo "Jellyfin http://localhost:8096"
echo "Radarr http://localhost:7878"
echo "Sonarr http://localhost:8989"
echo "qBittorrent http://localhost:8080"
echo "FlareSolverr http://localhost:8191"
echo "JellySeerr http://localhost:5055"
echo "Jackett http://localhost:9117"
echo "----------------------------------------"
if [ "$supervision" = true ] ; then
    echo "👁️ La supervision"
    echo "Grafana http://localhost:3000"
    echo "Username: $grafana_influx_user Password: $grafana_influx_password"
    echo "InfluxDB http://localhost:8086"
    echo "Username: $grafana_influx_user Password: $grafana_influx_password"
fi