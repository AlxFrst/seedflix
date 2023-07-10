const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

let targetIP = '192.168.1.210';

let radarrPort = '7878';
let sonarrPort = '8989';
let prowlarrPort = '9696';

(async () => {

    const browser = await puppeteer.launch({ headless: true });

    // PROWLARR
    let prowlarrUsername = 'admin';
    let prowlarrPassword = 'admin';
    let prowlarrApiKey = '';
    const prowlarrPage = await browser.newPage();
    await prowlarrPage.goto('http://' + targetIP + ':' + prowlarrPort, { waitUntil: 'networkidle2' });
    // if #id-9 > button if found, then it's the first time setup
    if (await prowlarrPage.$('#id-9 > button') !== null) {
        console.log('[Prowlarr] First time setup detected');
        await prowlarrPage.waitForSelector('#id-9 > button');
        await prowlarrPage.click('#id-9 > button');
        await prowlarrPage.waitForSelector('#id-10 > div > div:nth-child(4) > div');
        await prowlarrPage.click('#id-10 > div > div:nth-child(4) > div');
        const prowlarrInputs = await prowlarrPage.$$('input');
        await prowlarrInputs[0].type(prowlarrUsername);
        await prowlarrInputs[1].type(prowlarrPassword);
        const spans = await prowlarrPage.$$('span');
        await spans[1].click();
    }

    if (await prowlarrPage.$('body > div > div > div.panel > div.panel-body > div') !== null) {
        console.log('[Prowlarr] Login detected');
        await prowlarrPage.waitForSelector('body > div > div > div.panel > div.panel-body > form > div:nth-child(1) > input');
        await prowlarrPage.type('body > div > div > div.panel > div.panel-body > form > div:nth-child(1) > input', prowlarrUsername);
        await prowlarrPage.type('body > div > div > div.panel > div.panel-body > form > div:nth-child(2) > input', prowlarrPassword);
        await prowlarrPage.click('body > div > div > div.panel > div.panel-body > form > button');
    }
    await prowlarrPage.goto('http://' + targetIP + ':' + prowlarrPort + '/settings/general', { waitUntil: 'networkidle2' });
    const prowlarrInputs = await prowlarrPage.$$('input');
    prowlarrApiKey = await (await prowlarrInputs[5].getProperty('value')).jsonValue();
    console.log('[Prowlarr] API Key: ' + prowlarrApiKey);
    await prowlarrPage.close();

    // RADARR
    let radarrApiKey = '';
    const radarrPage = await browser.newPage();
    await radarrPage.goto('http://' + targetIP + ':' + radarrPort + '/settings/general', { waitUntil: 'networkidle2' });
    const radarrInputs = await radarrPage.$$('input');
    radarrApiKey = await (await radarrInputs[3].getProperty('value')).jsonValue();
    console.log('[Radarr] API Key: ' + radarrApiKey);
    await radarrPage.close();

    // SONARR
    let sonarrApiKey = '';
    const sonarrPage = await browser.newPage();
    await sonarrPage.goto('http://' + targetIP + ':' + sonarrPort + '/settings/general', { waitUntil: 'networkidle2' });
    const sonarrInputs = await sonarrPage.$$('input');
    sonarrApiKey = await (await sonarrInputs[3].getProperty('value')).jsonValue();
    console.log('[Sonarr] API Key: ' + sonarrApiKey);
    await sonarrPage.close();

    await browser.close();

    // Api Calls
    const prowlarrHeader = { 'X-Api-Key': prowlarrApiKey };
    const radarrHeader = { 'X-Api-Key': radarrApiKey };
    const sonarrHeader = { 'X-Api-Key': sonarrApiKey };
    // const prowlarrAddRadarr = { syncLevel: "fullSync", name: "Radarr", fields: [{ name: "prowlarrUrl", value: "http://prowlarr:9696" }, { name: "baseUrl", value: "http://radarr:7878" }, { name: "apiKey", value: radarrApiKey }, { name: "syncCategories", value: [2000, 2010, 2020, 2030, 2040, 2045, 2050, 2060, 2070, 2080] }], implementationName: "Radarr", implementation: "Radarr", configContract: "RadarrSettings", infoLink: "https://wiki.servarr.com/prowlarr/supported#radarr", tags: [] };
    // await axios.post('http://' + targetIP + ':' + prowlarrPort + '/api/v1/applications', prowlarrAddRadarr, { headers: prowlarrHeader });
    // const prowlarrAddSonarr = { syncLevel: "fullSync", name: "Sonarr", fields: [{ name: "prowlarrUrl", value: "http://prowlarr:9696" }, { name: "baseUrl", value: "http://sonarr:8989" }, { name: "apiKey", value: sonarrApiKey }, { name: "syncCategories", value: [5000, 5010, 5020, 5030, 5040, 5045, 5050] }, { name: "animeSyncCategories", value: [5070] }, { name: "syncAnimeStandardFormatSearch", value: false }], implementationName: "Sonarr", implementation: "Sonarr", configContract: "SonarrSettings", infoLink: "https://wiki.servarr.com/prowlarr/supported#sonarr", tags: [] };
    // await axios.post('http://' + targetIP + ':' + prowlarrPort + '/api/v1/applications', prowlarrAddSonarr, { headers: prowlarrHeader });
    // const radarrAddQbittorrent = { "enable": true, "protocol": "torrent", "priority": 1, "removeCompletedDownloads": true, "removeFailedDownloads": true, "name": "Qbittorrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "port", "value": 8080 }, { "name": "useSsl", "value": false }, { "name": "urlBase" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }, { "name": "movieCategory", "value": "radarr" }, { "name": "movieImportedCategory" }, { "name": "recentMoviePriority", "value": 0 }, { "name": "olderMoviePriority", "value": 0 }, { "name": "initialState", "value": 0 }, { "name": "sequentialOrder", "value": false }, { "name": "firstAndLast", "value": false }], "implementationName": "qBittorrent", "implementation": "QBittorrent", "configContract": "QBittorrentSettings", "infoLink": "https://wiki.servarr.com/radarr/supported#qbittorrent", "tags": [] };
    // await axios.post('http://' + targetIP + ':' + radarrPort + '/api/v3/downloadclient', radarrAddQbittorrent, { headers: radarrHeader });
    // const radarrProfileAny = { "name": "Any", "upgradeAllowed": false, "cutoff": 20, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": true }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": true }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": true }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": true }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 1 };
    // await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/1', radarrProfileAny, { headers: radarrHeader });
    // const radarrProfileHd7201080 = { "name": "HD - 720p/1080p", "upgradeAllowed": false, "cutoff": 6, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 6 };
    // await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/6', radarrProfileHd7201080, { headers: radarrHeader });



})();