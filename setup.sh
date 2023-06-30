#!/bin/sh

echo "Lancement de l'installation de Seedflix 🌱🎬"
sudo apt update -y
sudo apt install curl software-properties-common -y
echo "Installation de Docker 🐳 et Docker Compose 🐙"
sudo apt install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings 
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose -y
echo "Docker 🐳 et Docker Compose 🐙 installés"
echo "Création de l'utilisateur media 🧑‍🌾"
# Demande du nom d'utilisateur
read -p 'Utilisateur: ' uservar
# Demande du mot de passe
read -sp 'Password: ' passvar
sudo useradd -m -p $(mkpasswd -m sha-512 $passvar) $uservar
sudo usermod -aG docker $uservar

echo "Déplacement du répertoire Seedflix vers le répertoire home de l'utilisateur"
sudo mv "$(pwd)" "/home/$uservar/Seedflix"

echo "Répertoire déplacé avec succès!"