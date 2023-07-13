# Seedflix 🌱🎬

Seedflix est un référentiel Docker qui combine une seedbox et un mediacenter, vous permettant de gérer facilement les torrents et de diffuser du contenu multimédia. Il met l'accent sur la confidentialité et les vitesses de téléchargement optimisées, vous permettant d'organiser votre bibliothèque multimédia et de profiter de films, de séries et de musique.

# Installation rapide ⚡️

```
git clone https://github.com/AlxFrst/seedflix.git && cd seedflix && chmod +x setup.sh && ./setup.sh
```
Répondez aux questions posées par le script et c'est parti ! 🚀
En bonus si vous choisisez l'autosetup une fois terminé il ne vous reste plus qu'a vous rendre sur JellySeerr pour ajouter vos films et séries préférés et les visioner sur Jellyfin.


## Fonctionnalités 🚀

- **Jellyfin** : Un puissant serveur multimédia vous permettant de diffuser votre collection de médias sur différents appareils.
- **Sonarr** : Un gestionnaire intelligent de séries télévisées, vous permettant de télécharger et d'organiser automatiquement vos séries préférées.
- **Radarr** : Un compagnon de Sonarr, conçu pour gérer et télécharger des films.
- **qBittorrent** : Un client BitTorrent populaire pour le téléchargement de torrents.
- **FlareSolverr** : Un outil pour résoudre les défis Cloudflare rencontrés lors du scraping de sites web.
- **Jellyseerr** : Un service permettant de convertir des torrents en liens magnet.
- **Prowlarr**: Gestionnaire d'indexeurs/proxy pour *arr stack, compatible avec diverses apps PVR, Torrent Trackers, Usenet Indexers. Intègre Lidarr, Mylar3, Radarr, Readarr, Sonarr, Jellyfin.

## Prérequis matériel ⚙️

- Configuration matérielle recommandée :
  - Processeur : 2 à 4 cœurs.
  - Mémoire vive (RAM) : Minimum 8 Go, mais il est recommandé d'avoir au moins 16 Go pour des performances optimales.

## Conseils & Astuces 📝

- Exposez sur le web uniquement Jellyfin et Jellyseerr (via un tunnel Cloudflare par exemple) pour une meilleure sécurité.
- Vous pouvez ajouter d'autres sources de torrents via Prowlarr qui se situe sur le port 9696. 
- Ajoutez FlareSolverr comme proxy dans Prowlarr pour résoudre les défis Cloudflare.
- Vous pouvez pousser d'avantages vos recherches de films en ajoutant des profiles dans Radarr et Sonarr. 

## Accès aux services 📺

- **Jellyfin** : http://localhost:8096
- **Prowlarr** : http://localhost:9696
- **Sonarr** : http://localhost:8989
- **Radarr** : http://localhost:7878
- **qBittorrent** : http://localhost:8080
- **FlareSolverr** : http://localhost:8191
- **Jellyseerr** : http://localhost:5055
- **Grafana** : http://localhost:3000 (si supervision activée)
- **InfluxDB** : http://localhost:8086 (si supervision activée)

## Testé sur 🧪
Ubuntu 20.04 LTS (Focal Fossa) amd64 ✅