const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

let radarrUrl = 'http://localhost:7878';

(async () => {

    console.log('Démarrage de l\'installation automatique de chaques services veuillez patienter...');
    const browser = await puppeteer.launch();

    // RADARR
    // TODO: add qbittorrent to radarr
    // TODO: add each indexers
    const radarrPage = await browser.newPage();
    await radarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await radarrPage.goto(radarrUrl + "/settings/general", { waitUntil: 'networkidle2' });
    const inputValues2 = await radarrPage.$$eval('input[type="text"]', inputs => { return inputs.map(input => input.value); });
    let radarrApiKey = inputValues2[2]; // Récupérer la troisième valeur du tableau
    console.log('[Radarr] Clé api: ' + radarrApiKey);
    await radarrPage.close();

    let keys = JSON.parse(fs.readFileSync('keys.json'));
    keys.Radarr = radarrApiKey;
    fs.writeFileSync('keys.json', JSON.stringify(keys));

    // Get jackett api key from keys.json
    keys = JSON.parse(fs.readFileSync('keys.json'));
    let jackettApiKey = keys.Jackett;
    console.log('[Jackett] Clé api: ' + jackettApiKey);


    const headers = { 'X-Api-Key': radarrApiKey, 'Content-Type': 'application/json' };
    const qbitData = { "enable": true, "protocol": "torrent", "priority": 1, "removeCompletedDownloads": true, "removeFailedDownloads": true, "name": "Qbittorrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "port", "value": 8080 }, { "name": "useSsl", "value": false }, { "name": "urlBase" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }, { "name": "movieCategory", "value": "radarr" }, { "name": "movieImportedCategory" }, { "name": "recentMoviePriority", "value": 0 }, { "name": "olderMoviePriority", "value": 0 }, { "name": "initialState", "value": 0 }, { "name": "sequentialOrder", "value": false }, { "name": "firstAndLast", "value": false }], "implementationName": "qBittorrent", "implementation": "QBittorrent", "configContract": "QBittorrentSettings", "infoLink": "https://wiki.servarr.com/radarr/supported#qbittorrent", "tags": [] };
    await axios.post(radarrUrl + '/api/v3/downloadclient', qbitData, { headers: headers })
        .then(response => console.log("[Sonarr] Qbittorrent ajouté ✅"))
        .catch(error => console.log('[Sonarr] Erreur lors de l\'ajout de Qbittorrent ❌'));
    const tpbData = { "enableRss": true, "enableAutomaticSearch": true, "enableInteractiveSearch": true, "supportsRss": true, "supportsSearch": true, "protocol": "torrent", "priority": 25, "downloadClientId": 0, "name": "The Pirate Bay", "fields": [{ "name": "baseUrl", "value": "http://jackett:9117/api/v2.0/indexers/thepiratebay/results/torznab/" }, { "name": "apiPath", "value": "/api" }, { "name": "multiLanguages", "value": [] }, { "name": "apiKey", "value": jackettApiKey }, { "name": "categories", "value": [2000, 2020, 2040, 2060, 100201, 100202, 100501, 100502, 100505] }, { "name": "additionalParameters" }, { "name": "removeYear", "value": false }, { "name": "minimumSeeders", "value": 1 }, { "name": "seedCriteria.seedRatio" }, { "name": "seedCriteria.seedTime" }, { "name": "requiredFlags", "value": [] }], "implementationName": "Torznab", "implementation": "Torznab", "configContract": "TorznabSettings", "infoLink": "https://wiki.servarr.com/radarr/supported#torznab", "tags": [] };
    await axios.post(radarrUrl + '/api/v3/indexer', tpbData, { headers: headers })
        .then(response => console.log("[Sonarr] The Pirate Bay ajouté ✅"))
        .catch(error => console.log('[Sonarr] Erreur lors de l\'ajout de The Pirate Bay ❌'));
    const t911Data = { "enableRss": true, "enableAutomaticSearch": true, "enableInteractiveSearch": true, "supportsRss": true, "supportsSearch": true, "protocol": "torrent", "priority": 25, "downloadClientId": 0, "name": "Torrent911", "fields": [{ "name": "baseUrl", "value": "http://jackett:9117/api/v2.0/indexers/torrent911/results/torznab/" }, { "name": "apiPath", "value": "/api" }, { "name": "multiLanguages", "value": [] }, { "name": "apiKey", "value": jackettApiKey }, { "name": "categories", "value": [2000, 145469] }, { "name": "additionalParameters" }, { "name": "removeYear", "value": false }, { "name": "minimumSeeders", "value": 1 }, { "name": "seedCriteria.seedRatio" }, { "name": "seedCriteria.seedTime" }, { "name": "requiredFlags", "value": [] }], "implementationName": "Torznab", "implementation": "Torznab", "configContract": "TorznabSettings", "infoLink": "https://wiki.servarr.com/radarr/supported#torznab", "tags": [] };
    await axios.post(radarrUrl + '/api/v3/indexer', t911Data, { headers: headers })
        .then(response => console.log("[Sonarr] Torrent911 ajouté ✅"))
        .catch(error => console.log('[Sonarr] Erreur lors de l\'ajout de Torrent911 ❌'));
    const profileAnyData = { "name": "Any", "upgradeAllowed": false, "cutoff": 20, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": true }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": true }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": true }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": true }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 1 };
    await axios.put(radarrUrl + '/api/v3/qualityprofile/1', profileAnyData, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Profil Any mis a jour"))
        .catch(error => console.log('[Sonarr] Erreur lors de la mise a jour du profil Any'));
    const hd7201080profileData = { "name": "HD - 720p/1080p", "upgradeAllowed": false, "cutoff": 6, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 6 };
    await axios.put(radarrUrl + '/api/v3/qualityprofile/6', hd7201080profileData, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Profil HD 720/1080p mis a jour"))
        .catch(error => console.log("[Sonarr] Erreur lors de la mise a jour du profil HD 720/1080p"));
    const hd1080profiledata = { "name": "HD-1080p", "upgradeAllowed": false, "cutoff": 7, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 4 };
    await axios.put(radarrUrl + '/api/v3/qualityprofile/4', hd1080profiledata, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Profil HD 71080p mis a jour"))
        .catch(error => console.log("[Sonarr] Erreur lors de la mise a jour du profil HD 1080p"));
    const hd720profiledata = { "name": "HD-720p", "upgradeAllowed": false, "cutoff": 6, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 3 };
    await axios.put(radarrUrl + '/api/v3/qualityprofile/3', hd720profiledata, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Profil HD 720p mis a jour"))
        .catch(error => console.log("[Sonarr] Erreur lors de la mise a jour du profil HD 720p"));
    const sdprofiledata = { "name": "SD", "upgradeAllowed": false, "cutoff": 20, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": true }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": true }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 2 };
    await axios.put(radarrUrl + '/api/v3/qualityprofile/2', sdprofiledata, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Profil SD mis a jour"))
        .catch(error => console.log("[Sonarr] Erreur lors de la mise a jour du profil SD"));
    const ultrahdprofiledata = { "name": "Ultra-HD", "upgradeAllowed": false, "cutoff": 31, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 5 };
    await axios.put(radarrUrl + '/api/v3/qualityprofile/5', ultrahdprofiledata, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Profil Ultra HD mis a jour"))
        .catch(error => console.log("[Sonarr] Erreur lors de la mise a jour du profil Ultra HD"));
    const rootFolderData = { "path": "/data/movies/" };
    await axios.post(radarrUrl + '/api/v3/rootFolder', rootFolderData, { headers: { 'X-Api-Key': radarrApiKey } })
        .then(response => console.log("[Sonarr] Dossier racine mis a jour"))
        .catch(error => console.log("[Sonarr] Erreur lors de la mise a jour du dossier racine"));






    // close browser
    await browser.close();

})();