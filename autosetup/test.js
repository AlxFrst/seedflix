const puppeteer = require('puppeteer');
const axios = require('axios');

let myIP = '192.168.1.210'; // NEED TO SED THIS BEFORE RUNNING
let qBittorrentUrl = 'http://' + myIP + ':8080';
let jackettUrl = 'http://' + myIP + ':9117';
let sonarrUrl = 'http://' + myIP + ':8989';
let radarrUrl = 'http://' + myIP + ':7878';
let jellyfinUrl = 'http://' + myIP + ':8096';
let jellyseerrUrl = 'http://' + myIP + ':5055';
let flareSolverrUrl = 'http://' + myIP + ':8191';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    console.log('Démarrage de l\'installation automatique de chaques services veuillez patienter...');
    const browser = await puppeteer.launch();

    // RADARR
    // TODO: add qbittorrent to sonarr
    // TODO: add each indexers
    const radarrPage = await browser.newPage();
    await radarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await radarrPage.goto(radarrUrl + "/settings/general", { waitUntil: 'networkidle2' });
    const inputValues2 = await radarrPage.$$eval('input[type="text"]', inputs => { return inputs.map(input => input.value); });
    let radarrApiKey = inputValues2[2]; // Récupérer la troisième valeur du tableau
    console.log('[Radarr] Clé api: ' + radarrApiKey);
    await radarrPage.close();
    const radarrheaders = { 'X-Api-Key': radarrApiKey, 'Content-Type': 'application/json' };
    let addQbitToRadarr = { "name": "qbittorrent", "protocol": "torrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }], "implementationName": "QBitTorrent", "implementation": "QBitTorrent", "configContract": "QBitTorrentSettings", "enable": true };
    axios.post(radarrUrl + '/api/v3/downloadclient', addQbitToRadarr, { radarrheaders })
        .then(response => console.log(response.data))
        .catch(error => console.error(error));

    // close browser
    await browser.close();
    console.log("L'installation des services est terminée");
    console.log("Vous pouvez desormer acceder a JellySeer via l'adresse suivante : http://localhost:5055");

})();