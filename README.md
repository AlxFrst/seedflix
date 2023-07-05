# Seedflix 🌱🎬

Seedflix est un référentiel Docker qui combine une seedbox et un mediacenter, vous permettant de gérer facilement les torrents et de diffuser du contenu multimédia. Il met l'accent sur la confidentialité et les vitesses de téléchargement optimisées, vous permettant d'organiser votre bibliothèque multimédia et de profiter de films, de séries et de musique.

## Fonctionnalités 🚀

- **Jellyfin** : Un puissant serveur multimédia vous permettant de diffuser votre collection de médias sur différents appareils. 
- **Jackett** : Un agrégateur d'indexeurs de torrents, vous permettant de rechercher des torrents provenant de plusieurs sources. 
- **Sonarr** : Un gestionnaire intelligent de séries télévisées, vous permettant de télécharger et d'organiser automatiquement vos séries préférées. 
- **Radarr** : Un compagnon de Sonarr, conçu pour gérer et télécharger des films. 
- **qBittorrent** : Un client BitTorrent populaire pour le téléchargement de torrents.
- **FlareSolverr** : Un outil pour résoudre les défis Cloudflare rencontrés lors du scraping de sites web.
- **Jellyseerr** : Un service permettant de convertir des torrents en liens magnet. 

## Prérequis ⚙️

Installation Rapide
```
git clone https://github.com/AlxFrst/seedflix.git && cd seedflix && chmod +x setup.sh && ./setup.sh
```

Avant de commencer, assurez-vous de disposer des éléments suivants :

- Une machine exécutant Ubuntu 20.04 (ou une version similaire) :
  - Vous pouvez télécharger Ubuntu 20.04 depuis le [site officiel d'Ubuntu](https://ubuntu.com/download).
  - Suivez les instructions d'installation pour configurer Ubuntu sur votre machine.

- Docker 🐳 installé :
  - Consultez la documentation officielle de Docker pour les instructions d'installation sur Ubuntu :
    [Guide d'installation de Docker sur Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

- Docker Compose 🐙 installé :
  - Suivez les instructions d'installation officielles de Docker Compose pour Ubuntu :
    [Guide d'installation de Docker Compose](https://docs.docker.com/compose/install/).

- Configuration matérielle recommandée :
  - Processeur : 2 à 4 cœurs.
  - Mémoire vive (RAM) : Minimum 8 Go, mais il est recommandé d'avoir au moins 16 Go pour des performances optimales.

## Tutoriel 📖
### Installation de Docker et Docker Compose 
1. Les paquets curl et software-properties-common doivent être installés sur votre système
```
sudo apt-get update
sudo apt install curl software-properties-common
```
2. Vos dépôts APT doivent être mis à jour
```
sudo apt update
```
3. Installez Docker à l'aide du script d'installation officiel de Docker
```
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
4. Installez Docker Compose
```
sudo apt install docker-compose-plugin
```
### Configuration des utilisateurs et des répertoires
1. Créer un utilisateur media
```
sudo adduser media
```
2. Ajoutez l'utilisateur media au groupe docker
```
sudo adduser media docker
```
3. Nous allons maintenant créer une arborescence de dossier pour stocker nos données
```
sudo mkdir -p /data/torrents /data/movies /data/tv /data/downloads
```
4. Nous allons maintenant changer le propriétaire des dossiers que nous venons de créer
```
sudo chown -R media:media /data/torrents /data/movies /data/tv /data/downloads
```
### Clonage du dépôt et configuration
1. Connectez-vous sous l’utilisateur media 
```
su media
```
2. Déplacez-vous dans le répertoire personnel de cet utilisateur
```
cd
```
3. Clonez le dépôt GitHub
```
git clone https://github.com/AlxFrst/seedflix.git
```
4. Déplacez-vous dans le dossier seedflix
```
cd seedflix
```
5. Créez le fichier /home/media/.env et modifiez les valeurs en fonction de votre configuration
```
sudo nano /home/media/.env
```
6. Ajoutez ces lignes dans le fichier .env
```
PUID=1001
PGID=1001
PATH_MEDIA=/data
```
### Démarrage des conteneurs Docker
1. Démarrez les conteneurs
```
docker compose up -d
```

Félicitations ! Vous avez maintenant installé et configuré Seedflix sur votre système. Vous pouvez accéder aux différents services en utilisant les ports et les URLs fournis. Profitez de votre seedbox et de votre mediacenter ! 🎉

## Accès aux services 📺
- **Jellyfin** : http://localhost:8096
- **Jackett** : http://localhost:9117
- **Sonarr** : http://localhost:8989
- **Radarr** : http://localhost:7878
- **qBittorrent** : http://localhost:8080
- **FlareSolverr** : http://localhost:8191
- **Jellyseerr** : http://localhost:5055


## Conseils 📝
- Commencez par ajouter vos indexeurs dans Jackett.
- Mettez en place flaresolverr pour résoudre les défis Cloudflare dans Jackett.
- Ajoutez vos indexeurs dans Sonarr et Radarr et configurez vos profils de téléchargement.
- Ajoutez qBittorrent dans Sonarr et Radarr
- Assurez-vous que dans le "Répertoire de destination par défaut :", le chemin soit défini sur "/data/downloads".
- Dans les paramètres de Bittorrent, cochez la case "Lorsque le ratio est atteint" et mettez 0 à côté. Ensuite, sélectionnez "mettre en pause le torrent" pour vous assurer que les fichiers se suppriment une fois terminés et sont déplacés dans le bon dossier.





