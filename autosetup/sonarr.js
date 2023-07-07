const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');


let sonarrUrl = 'http://localhost:8989';

(async () => {

    const browser = await puppeteer.launch();


    // SONARR
    // TODO: add each indexers
    const sonarrPage = await browser.newPage();
    await sonarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await sonarrPage.goto(sonarrUrl + "/settings/general", { waitUntil: 'networkidle2' });
    const inputValues = await sonarrPage.$$eval('input[type="text"]', inputs => { return inputs.map(input => input.value); });
    let sonarrApiKey = inputValues[2]; // Récupérer la troisième valeur du tableau
    console.log('[Sonarr] Clé api: ' + sonarrApiKey);
    await sonarrPage.close();

    let keys = JSON.parse(fs.readFileSync('keys.json'));
    keys.Sonarr = sonarrApiKey;
    fs.writeFileSync('keys.json', JSON.stringify(keys));

    // Get jackett api key from keys.json
    keys = JSON.parse(fs.readFileSync('keys.json'));
    let jackettApiKey = keys.Jackett;
    console.log('[Jackett] Clé api: ' + jackettApiKey);

    // API CALLS
    const headers = { 'X-Api-Key': sonarrApiKey, 'Content-Type': 'application/json' };
    const qbitadd = { "name": "qbittorrent", "protocol": "torrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }], "implementationName": "QBitTorrent", "implementation": "QBitTorrent", "configContract": "QBitTorrentSettings", "enable": true };
    await axios.post(sonarrUrl + '/api/v3/downloadclient', qbitadd, { headers })
        .then(response => console.log("[Sonarr] Qbittorrent ajouté ✅"))
        .catch(error => console.log('[Sonarr] Erreur lors de l\'ajout de Qbittorrent ❌'));
    const tpbData = { "enableRss": true, "enableAutomaticSearch": true, "enableInteractiveSearch": true, "supportsRss": true, "supportsSearch": true, "protocol": "torrent", "priority": 25, "downloadClientId": 0, "name": "The Pirate Bay", "fields": [{ "name": "baseUrl", "value": "http://jackett:9117/api/v2.0/indexers/thepiratebay/results/torznab/" }, { "name": "apiPath", "value": "/api" }, { "name": "apiKey", "value": jackettApiKey }, { "name": "categories", "value": [5030, 5040, 5050, 100205, 100208] }, { "name": "animeCategories", "value": [] }, { "name": "animeStandardFormatSearch", "value": false }, { "name": "additionalParameters" }, { "name": "minimumSeeders", "value": 1 }, { "name": "seedCriteria.seedRatio" }, { "name": "seedCriteria.seedTime" }, { "name": "seedCriteria.seasonPackSeedTime" }], "implementationName": "Torznab", "implementation": "Torznab", "configContract": "TorznabSettings", "infoLink": "https://wiki.servarr.com/sonarr/supported#torznab", "tags": [] };
    await axios.post(sonarrUrl + '/api/v3/indexer', tpbData, { headers })
        .then(response => console.log("[Sonarr] Indexeur The Pirtate Bay ajouté ✅"))
        .catch(error => console.log("[Sonarr] Erreur lors de l'ajout de The Pirtate Bay ❌"));
    const t911Data = { "enableRss": true, "enableAutomaticSearch": true, "enableInteractiveSearch": true, "supportsRss": true, "supportsSearch": true, "protocol": "torrent", "priority": 25, "downloadClientId": 0, "name": "Torrent911", "fields": [{ "name": "baseUrl", "value": "http://jackett:9117/api/v2.0/indexers/torrent911/results/torznab/" }, { "name": "apiPath", "value": "/api" }, { "name": "apiKey", "value": jackettApiKey }, { "name": "categories", "value": [2000] }, { "name": "animeCategories", "value": [] }, { "name": "animeStandardFormatSearch", "value": false }, { "name": "additionalParameters" }, { "name": "minimumSeeders", "value": 1 }, { "name": "seedCriteria.seedRatio" }, { "name": "seedCriteria.seedTime" }, { "name": "seedCriteria.seasonPackSeedTime" }], "implementationName": "Torznab", "implementation": "Torznab", "configContract": "TorznabSettings", "infoLink": "https://wiki.servarr.com/sonarr/supported#torznab", "tags": [] };
    await axios.post(sonarrUrl + '/api/v3/indexer', t911Data, { headers })
        .then(response => console.log("[Sonarr] Indexeur Torrent911 ajouté ✅"))
        .catch(error => console.log("[Sonarr] Erreur lors de l'ajout de Torrent911 ❌"));
    await axios.delete(sonarrUrl + '/api/v3/languageprofile/1', { headers })
        .then(response => console.log("[Sonarr] Profil de langue Anglais supprimé ✅"))
        .catch(error => console.log("[Sonarr] Erreur lors de la suppression du profil de langue Anglais ❌"));
    const createProfileData = { "upgradeAllowed": false, "cutoff": { "id": 2, "name": "French" }, "languages": [{ "language": { "id": 0, "name": "Unknown" }, "allowed": false }, { "language": { "id": 13, "name": "Vietnamese" }, "allowed": false }, { "language": { "id": 30, "name": "Ukrainian" }, "allowed": false }, { "language": { "id": 17, "name": "Turkish" }, "allowed": false }, { "language": { "id": 14, "name": "Swedish" }, "allowed": false }, { "language": { "id": 3, "name": "Spanish" }, "allowed": false }, { "language": { "id": 11, "name": "Russian" }, "allowed": false }, { "language": { "id": 18, "name": "Portuguese" }, "allowed": false }, { "language": { "id": 12, "name": "Polish" }, "allowed": false }, { "language": { "id": 15, "name": "Norwegian" }, "allowed": false }, { "language": { "id": 29, "name": "Malayalam" }, "allowed": false }, { "language": { "id": 24, "name": "Lithuanian" }, "allowed": false }, { "language": { "id": 21, "name": "Korean" }, "allowed": false }, { "language": { "id": 8, "name": "Japanese" }, "allowed": false }, { "language": { "id": 5, "name": "Italian" }, "allowed": false }, { "language": { "id": 9, "name": "Icelandic" }, "allowed": false }, { "language": { "id": 22, "name": "Hungarian" }, "allowed": false }, { "language": { "id": 27, "name": "Hindi" }, "allowed": false }, { "language": { "id": 23, "name": "Hebrew" }, "allowed": false }, { "language": { "id": 20, "name": "Greek" }, "allowed": false }, { "language": { "id": 4, "name": "German" }, "allowed": false }, { "language": { "id": 19, "name": "Flemish" }, "allowed": false }, { "language": { "id": 16, "name": "Finnish" }, "allowed": false }, { "language": { "id": 7, "name": "Dutch" }, "allowed": false }, { "language": { "id": 6, "name": "Danish" }, "allowed": false }, { "language": { "id": 25, "name": "Czech" }, "allowed": false }, { "language": { "id": 10, "name": "Chinese" }, "allowed": false }, { "language": { "id": 28, "name": "Bulgarian" }, "allowed": false }, { "language": { "id": 26, "name": "Arabic" }, "allowed": false }, { "language": { "id": 1, "name": "English" }, "allowed": true }, { "language": { "id": 2, "name": "French" }, "allowed": true }], "name": "Français" };
    await axios.post(sonarrUrl + '/api/v3/languageprofile', createProfileData, { headers })
        .then(response => console.log("[Sonarr] Profil de langue Français ajouté ✅"))
        .catch(error => console.log("[Sonarr] Erreur lors de l'ajout du profil de langue Français ❌"));
    const customProfileData = { "enabled": true, "required": ["Multi", "vff", "vf"], "ignored": [], "preferred": [], "includePreferredWhenRenaming": false, "tags": [], "indexerId": 0, "name": "Multi" };
    await axios.post(sonarrUrl + '/api/v3/releaseprofile', customProfileData, { headers })
        .then(response => console.log("[Sonarr] Profil de release Multi ajouté ✅"))
        .catch(error => console.log("[Sonarr] Erreur lors de l'ajout du profil de release Multi ❌"));
    const rootFolderData = { "path": "/data/tv/" };
    await axios.post(sonarrUrl + '/api/v3/rootfolder', rootFolderData, { headers })
        .then(response => console.log("[Sonarr] Dossier de téléchargement ajouté ✅"))
        .catch(error => console.log("[Sonarr] Erreur lors de l'ajout du dossier de téléchargement ❌"));




    // close browser
    await browser.close();

})();