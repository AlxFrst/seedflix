# Seedflix 🌱🎬

Seedflix est un référentiel Docker qui combine une seedbox et un mediacenter, vous permettant de gérer facilement les torrents et de diffuser du contenu multimédia. Il met l'accent sur la confidentialité et les vitesses de téléchargement optimisées, vous permettant d'organiser votre bibliothèque multimédia et de profiter de films, de séries et de musique.

# Installation rapide ⚡️

```
git clone https://github.com/AlxFrst/seedflix.git && cd seedflix && chmod +x setup.sh && ./setup.sh
```

## Fonctionnalités 🚀

- **Jellyfin** : Un puissant serveur multimédia vous permettant de diffuser votre collection de médias sur différents appareils.
- **Jackett** : Un agrégateur d'indexeurs de torrents, vous permettant de rechercher des torrents provenant de plusieurs sources.
- **Sonarr** : Un gestionnaire intelligent de séries télévisées, vous permettant de télécharger et d'organiser automatiquement vos séries préférées.
- **Radarr** : Un compagnon de Sonarr, conçu pour gérer et télécharger des films.
- **qBittorrent** : Un client BitTorrent populaire pour le téléchargement de torrents.
- **FlareSolverr** : Un outil pour résoudre les défis Cloudflare rencontrés lors du scraping de sites web.
- **Jellyseerr** : Un service permettant de convertir des torrents en liens magnet.

## Prérequis matériel ⚙️

- Configuration matérielle recommandée :
  - Processeur : 2 à 4 cœurs.
  - Mémoire vive (RAM) : Minimum 8 Go, mais il est recommandé d'avoir au moins 16 Go pour des performances optimales.

## Conseils & Astuces 📝

- Commencez par ajouter vos indexeurs dans Jackett.
- Mettez en place flaresolverr pour résoudre les défis Cloudflare dans Jackett.
- Ajoutez vos indexeurs dans Sonarr et Radarr et configurez vos profils de téléchargement.
- Ajoutez qBittorrent dans Sonarr et Radarr
- Assurez-vous que dans le "Répertoire de destination par défaut :" le chemin soit défini sur "/data/downloads".)
- Dans les paramètres de Bittorrent, cochez la case "Lorsque le ratio est atteint" et mettez 0 à côté. Ensuite, sélectionnez "mettre en pause le torrent" pour vous assurer que les fichiers se suppriment une fois terminés et sont déplacés dans le bon dossier.
- Ajouter un tunnel cloudflare pour accéder à vos services depuis l'extérieur pour Jellyfin et Jellyseerr. uniquement.
- Rechercher un film ou une série dans Jellyseerr et visionner le directement dans Jellyfin quand il est disponible.
- ENJOY ! 🎉

## Accès aux services 📺

- **Jellyfin** : http://localhost:8096
- **Jackett** : http://localhost:9117
- **Sonarr** : http://localhost:8989
- **Radarr** : http://localhost:7878
- **qBittorrent** : http://localhost:8080
- **FlareSolverr** : http://localhost:8191
- **Jellyseerr** : http://localhost:5055

## Testé sur 🧪
Ubuntu 20.04 LTS (Focal Fossa) amd64 ✅