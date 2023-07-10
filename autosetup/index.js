const puppeteer = require('puppeteer');
const axios = require('axios');

let targetIP = 'localhost';

let radarrPort = '7878';
let sonarrPort = '8989';
let prowlarrPort = '9696';
let qbittorrentPort = '8080';
let jellyfinPort = '8096';
let jellyseerrPort = '5055';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    const browser = await puppeteer.launch({ headless: true });

    let path = '#path#'; // SED THIS BEFORE LAUNCHING

    // PROWLARR
    let prowlarrUsername = 'admin'; // SED THIS BEFORE LAUNCHING
    let prowlarrPassword = 'admin'; // SED THIS BEFORE LAUNCHING
    let prowlarrApiKey = '';
    const prowlarrPage = await browser.newPage();
    await prowlarrPage.goto('http://' + targetIP + ':' + prowlarrPort, { waitUntil: 'networkidle2' });
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

    // Api Calls
    const prowlarrHeader = { 'X-Api-Key': prowlarrApiKey };
    const radarrHeader = { 'X-Api-Key': radarrApiKey };
    const sonarrHeader = { 'X-Api-Key': sonarrApiKey };
    // Prowlarr Api Calls
    const prowlarrAddRadarr = { syncLevel: "fullSync", name: "Radarr", fields: [{ name: "prowlarrUrl", value: "http://prowlarr:9696" }, { name: "baseUrl", value: "http://radarr:7878" }, { name: "apiKey", value: radarrApiKey }, { name: "syncCategories", value: [2000, 2010, 2020, 2030, 2040, 2045, 2050, 2060, 2070, 2080] }], implementationName: "Radarr", implementation: "Radarr", configContract: "RadarrSettings", infoLink: "https://wiki.servarr.com/prowlarr/supported#radarr", tags: [] };
    await axios.post('http://' + targetIP + ':' + prowlarrPort + '/api/v1/applications', prowlarrAddRadarr, { headers: prowlarrHeader });
    const prowlarrAddSonarr = { syncLevel: "fullSync", name: "Sonarr", fields: [{ name: "prowlarrUrl", value: "http://prowlarr:9696" }, { name: "baseUrl", value: "http://sonarr:8989" }, { name: "apiKey", value: sonarrApiKey }, { name: "syncCategories", value: [5000, 5010, 5020, 5030, 5040, 5045, 5050] }, { name: "animeSyncCategories", value: [5070] }, { name: "syncAnimeStandardFormatSearch", value: false }], implementationName: "Sonarr", implementation: "Sonarr", configContract: "SonarrSettings", infoLink: "https://wiki.servarr.com/prowlarr/supported#sonarr", tags: [] };
    await axios.post('http://' + targetIP + ':' + prowlarrPort + '/api/v1/applications', prowlarrAddSonarr, { headers: prowlarrHeader });
    const prowlarrAddT911 = { indexerUrls: ["https://www.torrent911.me/", "https://t911.org/", "https://oxtorrent.unblockninja.com/"], legacyUrls: ["https://www.protege-liens.com/", "https://oxtorrent.nocensor.work/", "https://oxtorrent.unblockit.kim/", "https://www.oxtorrent.sh/", "https://www.oxtorrent.pl/", "https://oxtorrent.unblockit.bz/", "https://www.oxtorrent.vc/", "https://oxtorrent.unblockit.tv/", "https://oxtorrent.unblockit.how/", "https://www.oxtorrent.be/", "https://oxtorrent.unblockit.cam/", "https://oxtorrent.nocensor.biz/", "https://oxtorrent.unblockit.day/", "https://www.oxtorrent.re/", "https://oxtorrent.unblockit.llc/", "https://www.torrent911.com/", "https://www.t911.net/", "https://oxtorrent.unblockit.blue/", "https://oxtorrent.nocensor.sbs/", "https://www.torrent911.net/", "https://www.torrent911.org/", "https://www.torrent911.cc/", "https://www.t911.me/", "https://www.torrent911.tv/", "https://www.t911.tv/", "https://torrent911.ws/", "http://www.torrent911.ws/", "https://www.torrent911.ws/"], definitionName: "torrent911", description: "Torrent911 is a French Public site for TV / MOVIES / GENERAL", language: "fr-FR", enable: true, redirect: false, supportsRss: true, supportsSearch: true, supportsRedirect: false, supportsPagination: false, appProfileId: 1, protocol: "torrent", privacy: "public", capabilities: { limitsMax: 100, limitsDefault: 100, categories: [{ id: 2000, name: "Movies", subCategories: [] }, { id: 5000, name: "TV", subCategories: [{ id: 5070, name: "TV/Anime", subCategories: [] }] }, { id: 3000, name: "Audio", subCategories: [] }, { id: 7000, name: "Books", subCategories: [] }, { id: 4000, name: "PC", subCategories: [{ id: 4050, name: "PC/Games", subCategories: [] }] }, { id: 1000, name: "Console", subCategories: [{ id: 1050, name: "Console/XBox 360", subCategories: [] }] }, { id: 6000, name: "XXX", subCategories: [] }], supportsRawSearch: true, searchParams: ["q", "q"], tvSearchParams: ["q", "season", "ep"], movieSearchParams: ["q"], musicSearchParams: ["q"], bookSearchParams: ["q"] }, priority: 25, added: "0001-01-01T00:00:00Z", sortName: "torrent911", name: "Torrent911", fields: [{ name: "definitionFile", value: "torrent911" }, { name: "baseUrl", value: "https://www.torrent911.me/" }, { name: "baseSettings.queryLimit" }, { name: "baseSettings.grabLimit" }, { name: "torrentBaseSettings.appMinimumSeeders" }, { name: "torrentBaseSettings.seedRatio" }, { name: "torrentBaseSettings.seedTime" }, { name: "torrentBaseSettings.packSeedTime" }, { name: "multilang", value: false }, { name: "multilanguage", value: 1 }, { name: "vostfr", value: false }], implementationName: "Cardigann", implementation: "Cardigann", configContract: "CardigannSettings", infoLink: "https://wiki.servarr.com/prowlarr/supported-indexers#torrent911", tags: [] };
    await axios.post('http://' + targetIP + ':' + prowlarrPort + '/api/v1/indexer', prowlarrAddT911, { headers: prowlarrHeader });
    const prowlarrAddTbb = { indexerUrls: ["https://thepiratebay.org/", "https://tpb25.ukpass.co/", "https://tpb.skynetcloud.site/", "https://piratenow.xyz/", "https://pirate-proxy.ink/", "https://mirrorbay.top/", "https://proxifiedpiratebay.org/", "https://unlockedpiratebay.com/", "https://tpb.one/", "https://piratebayorg.net/", "https://tpbproxy.click/", "https://thepiratebay0.org/", "https://thepiratebay10.org/", "https://pirateproxy.live/", "https://thehiddenbay.com/", "https://thepiratebay.zone/", "https://tpb.party/", "https://piratebayproxy.live/", "https://piratebay.live/", "https://piratebay.party/", "https://thepiratebay.party/", "https://ukpiratebay.org/"], legacyUrls: ["https://tpb19.ukpass.co/", "https://pirateproxy.tube/", "https://www.tpbay.win/", "https://baypirated.site/", "https://piratesbaycc.com/", "https://pirateproxy.ltda/", "https://tpb22.ukpass.co/", "https://tpb.sadzawka.tk/", "https://tpb.cnp.cx/", "https://pirate-proxy.app/", "https://thepb.cyou/", "https://5mins.eu/", "https://piratebayproxy.buzz/", "https://wearethereal.ninja/", "https://bibtor.com/", "https://gigatorrent.xyz/", "https://thepirateb.xyz/", "https://ezrasstuff.com/", "https://piratebayo3klnzokct3wt5yyxb2vpebbuyjl7m623iaxmqhsd52coid.onion.ws/", "https://piratebayo3klnzokct3wt5yyxb2vpebbuyjl7m623iaxmqhsd52coid.onion.pet/", "https://tpb24.ukpass.co/", "https://thepiratebay.d4.re/", "https://pirate-proxy.page/", "https://5mins.shop/", "https://tpb.surf/", "https://tpb.monster/", "https://thepiratebay.host/", "https://piratetoday.xyz/", "https://tpb.wtf/", "https://piratebayo3klnzokct3wt5yyxb2vpebbuyjl7m623iaxmqhsd52coid.onion.ly/", "https://piratebayo3klnzokct3wt5yyxb2vpebbuyjl7m623iaxmqhsd52coid.tor2web.to/", "https://piratebayo3klnzokct3wt5yyxb2vpebbuyjl7m623iaxmqhsd52coid.tor2web.link/"], definitionName: "thepiratebay", description: "The Pirate Bay (TPB) is the galaxy’s most resilient Public BitTorrent site", language: "en-US", enable: true, redirect: false, supportsRss: true, supportsSearch: true, supportsRedirect: false, supportsPagination: false, appProfileId: 1, protocol: "torrent", privacy: "public", capabilities: { limitsMax: 100, limitsDefault: 100, categories: [{ id: 3000, name: "Audio", subCategories: [{ id: 3030, name: "Audio/Audiobook", subCategories: [] }, { id: 3040, name: "Audio/Lossless", subCategories: [] }, { id: 3050, name: "Audio/Other", subCategories: [] }, { id: 3020, name: "Audio/Video", subCategories: [] }] }, { id: 2000, name: "Movies", subCategories: [{ id: 2020, name: "Movies/Other", subCategories: [] }, { id: 2040, name: "Movies/HD", subCategories: [] }, { id: 2060, name: "Movies/3D", subCategories: [] }] }, { id: 5000, name: "TV", subCategories: [{ id: 5050, name: "TV/Other", subCategories: [] }, { id: 5040, name: "TV/HD", subCategories: [] }] }, { id: 4000, name: "PC", subCategories: [{ id: 4030, name: "PC/Mac", subCategories: [] }, { id: 4040, name: "PC/Mobile-Other", subCategories: [] }, { id: 4060, name: "PC/Mobile-iOS", subCategories: [] }, { id: 4070, name: "PC/Mobile-Android", subCategories: [] }, { id: 4050, name: "PC/Games", subCategories: [] }] }, { id: 1000, name: "Console", subCategories: [{ id: 1180, name: "Console/PS4", subCategories: [] }, { id: 1040, name: "Console/XBox", subCategories: [] }, { id: 1030, name: "Console/Wii", subCategories: [] }, { id: 1090, name: "Console/Other", subCategories: [] }] }, { id: 6000, name: "XXX", subCategories: [{ id: 6010, name: "XXX/DVD", subCategories: [] }, { id: 6060, name: "XXX/ImageSet", subCategories: [] }, { id: 6070, name: "XXX/Other", subCategories: [] }] }, { id: 8000, name: "Other", subCategories: [] }, { id: 7000, name: "Books", subCategories: [{ id: 7030, name: "Books/Comics", subCategories: [] }, { id: 7050, name: "Books/Other", subCategories: [] }] }], supportsRawSearch: false, searchParams: ["q", "q"], tvSearchParams: ["q", "season", "ep"], movieSearchParams: ["q"], musicSearchParams: ["q"], bookSearchParams: ["q"] }, priority: 25, added: "0001-01-01T00:00:00Z", sortName: "pirate bay", name: "The Pirate Bay", fields: [{ name: "definitionFile", value: "thepiratebay" }, { name: "baseUrl", value: "https://thepiratebay.org/" }, { name: "baseSettings.queryLimit" }, { name: "baseSettings.grabLimit" }, { name: "torrentBaseSettings.appMinimumSeeders" }, { name: "torrentBaseSettings.seedRatio" }, { name: "torrentBaseSettings.seedTime" }, { name: "torrentBaseSettings.packSeedTime" }], implementationName: "Cardigann", implementation: "Cardigann", configContract: "CardigannSettings", infoLink: "https://wiki.servarr.com/prowlarr/supported-indexers#thepiratebay", tags: [] };
    await axios.post('http://' + targetIP + ':' + prowlarrPort + '/api/v1/indexer', prowlarrAddTbb, { headers: prowlarrHeader });
    // Radarr Api Calls
    const radarrAddQbittorrent = { "enable": true, "protocol": "torrent", "priority": 1, "removeCompletedDownloads": true, "removeFailedDownloads": true, "name": "Qbittorrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "port", "value": 8080 }, { "name": "useSsl", "value": false }, { "name": "urlBase" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }, { "name": "movieCategory", "value": "radarr" }, { "name": "movieImportedCategory" }, { "name": "recentMoviePriority", "value": 0 }, { "name": "olderMoviePriority", "value": 0 }, { "name": "initialState", "value": 0 }, { "name": "sequentialOrder", "value": false }, { "name": "firstAndLast", "value": false }], "implementationName": "qBittorrent", "implementation": "QBittorrent", "configContract": "QBittorrentSettings", "infoLink": "https://wiki.servarr.com/radarr/supported#qbittorrent", "tags": [] };
    await axios.post('http://' + targetIP + ':' + radarrPort + '/api/v3/downloadclient', radarrAddQbittorrent, { headers: radarrHeader });
    const radarrProfileAny = { "name": "Any", "upgradeAllowed": false, "cutoff": 20, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": true }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": true }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": true }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": true }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 1 };
    await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/1', radarrProfileAny, { headers: radarrHeader });
    const radarrProfileHd7201080 = { "name": "HD - 720p/1080p", "upgradeAllowed": false, "cutoff": 6, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 6 };
    await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/6', radarrProfileHd7201080, { headers: radarrHeader });
    const radarrProfileHd1080 = { "name": "HD-1080p", "upgradeAllowed": false, "cutoff": 7, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 4 };
    await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/4', radarrProfileHd1080, { headers: radarrHeader });
    const radarrProfileHd720 = { "name": "HD-720p", "upgradeAllowed": false, "cutoff": 6, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 3 };
    await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/3', radarrProfileHd720, { headers: radarrHeader });
    const radarrProfileSd = { "name": "SD", "upgradeAllowed": false, "cutoff": 20, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": true }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": true }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 2 };
    await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/2', radarrProfileSd, { headers: radarrHeader });
    const radarrProfileUhd = { "name": "Ultra-HD", "upgradeAllowed": false, "cutoff": 31, "items": [{ "quality": { "id": 0, "name": "Unknown", "source": "unknown", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 24, "name": "WORKPRINT", "source": "workprint", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 25, "name": "CAM", "source": "cam", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 26, "name": "TELESYNC", "source": "telesync", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 27, "name": "TELECINE", "source": "telecine", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 29, "name": "REGIONAL", "source": "dvd", "resolution": 480, "modifier": "regional" }, "items": [], "allowed": false }, { "quality": { "id": 28, "name": "DVDSCR", "source": "dvd", "resolution": 480, "modifier": "screener" }, "items": [], "allowed": false }, { "quality": { "id": 1, "name": "SDTV", "source": "tv", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 2, "name": "DVD", "source": "dvd", "resolution": 0, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 23, "name": "DVD-R", "source": "dvd", "resolution": 480, "modifier": "remux" }, "items": [], "allowed": false }, { "name": "WEB 480p", "items": [{ "quality": { "id": 8, "name": "WEBDL-480p", "source": "webdl", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 12, "name": "WEBRip-480p", "source": "webrip", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1000 }, { "quality": { "id": 20, "name": "Bluray-480p", "source": "bluray", "resolution": 480, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 21, "name": "Bluray-576p", "source": "bluray", "resolution": 576, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 4, "name": "HDTV-720p", "source": "tv", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 720p", "items": [{ "quality": { "id": 5, "name": "WEBDL-720p", "source": "webdl", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 14, "name": "WEBRip-720p", "source": "webrip", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1001 }, { "quality": { "id": 6, "name": "Bluray-720p", "source": "bluray", "resolution": 720, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 9, "name": "HDTV-1080p", "source": "tv", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "name": "WEB 1080p", "items": [{ "quality": { "id": 3, "name": "WEBDL-1080p", "source": "webdl", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 15, "name": "WEBRip-1080p", "source": "webrip", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }], "allowed": false, "id": 1002 }, { "quality": { "id": 7, "name": "Bluray-1080p", "source": "bluray", "resolution": 1080, "modifier": "none" }, "items": [], "allowed": false }, { "quality": { "id": 30, "name": "Remux-1080p", "source": "bluray", "resolution": 1080, "modifier": "remux" }, "items": [], "allowed": false }, { "quality": { "id": 16, "name": "HDTV-2160p", "source": "tv", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "name": "WEB 2160p", "items": [{ "quality": { "id": 18, "name": "WEBDL-2160p", "source": "webdl", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 17, "name": "WEBRip-2160p", "source": "webrip", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }], "allowed": true, "id": 1003 }, { "quality": { "id": 19, "name": "Bluray-2160p", "source": "bluray", "resolution": 2160, "modifier": "none" }, "items": [], "allowed": true }, { "quality": { "id": 31, "name": "Remux-2160p", "source": "bluray", "resolution": 2160, "modifier": "remux" }, "items": [], "allowed": true }, { "quality": { "id": 22, "name": "BR-DISK", "source": "bluray", "resolution": 1080, "modifier": "brdisk" }, "items": [], "allowed": false }, { "quality": { "id": 10, "name": "Raw-HD", "source": "tv", "resolution": 1080, "modifier": "rawhd" }, "items": [], "allowed": false }], "minFormatScore": 0, "cutoffFormatScore": 0, "formatItems": [], "language": { "id": 2, "Name": "French" }, "id": 5 };
    await axios.put('http://' + targetIP + ':' + radarrPort + '/api/v3/qualityprofile/5', radarrProfileUhd, { headers: radarrHeader });
    const radarrRootFolder = { "path": path + '/movies' };
    await axios.post('http://' + targetIP + ':' + radarrPort + '/api/v3/rootFolder', radarrRootFolder, { headers: radarrHeader });
    // Sonarr Api Calls
    const sonarrAddQbittorrent = { "name": "qbittorrent", "protocol": "torrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }], "implementationName": "QBitTorrent", "implementation": "QBitTorrent", "configContract": "QBitTorrentSettings", "enable": true };
    await axios.post('http://' + targetIP + ':' + sonarrPort + '/api/v3/downloadclient', sonarrAddQbittorrent, { headers: sonarrHeader });
    await axios.delete('http://' + targetIP + ':' + sonarrPort + '/api/v3/languageprofile/1', { headers: sonarrHeader });
    const sonarrAddLanguageProfile = { "upgradeAllowed": false, "cutoff": { "id": 2, "name": "French" }, "languages": [{ "language": { "id": 0, "name": "Unknown" }, "allowed": false }, { "language": { "id": 13, "name": "Vietnamese" }, "allowed": false }, { "language": { "id": 30, "name": "Ukrainian" }, "allowed": false }, { "language": { "id": 17, "name": "Turkish" }, "allowed": false }, { "language": { "id": 14, "name": "Swedish" }, "allowed": false }, { "language": { "id": 3, "name": "Spanish" }, "allowed": false }, { "language": { "id": 11, "name": "Russian" }, "allowed": false }, { "language": { "id": 18, "name": "Portuguese" }, "allowed": false }, { "language": { "id": 12, "name": "Polish" }, "allowed": false }, { "language": { "id": 15, "name": "Norwegian" }, "allowed": false }, { "language": { "id": 29, "name": "Malayalam" }, "allowed": false }, { "language": { "id": 24, "name": "Lithuanian" }, "allowed": false }, { "language": { "id": 21, "name": "Korean" }, "allowed": false }, { "language": { "id": 8, "name": "Japanese" }, "allowed": false }, { "language": { "id": 5, "name": "Italian" }, "allowed": false }, { "language": { "id": 9, "name": "Icelandic" }, "allowed": false }, { "language": { "id": 22, "name": "Hungarian" }, "allowed": false }, { "language": { "id": 27, "name": "Hindi" }, "allowed": false }, { "language": { "id": 23, "name": "Hebrew" }, "allowed": false }, { "language": { "id": 20, "name": "Greek" }, "allowed": false }, { "language": { "id": 4, "name": "German" }, "allowed": false }, { "language": { "id": 19, "name": "Flemish" }, "allowed": false }, { "language": { "id": 16, "name": "Finnish" }, "allowed": false }, { "language": { "id": 7, "name": "Dutch" }, "allowed": false }, { "language": { "id": 6, "name": "Danish" }, "allowed": false }, { "language": { "id": 25, "name": "Czech" }, "allowed": false }, { "language": { "id": 10, "name": "Chinese" }, "allowed": false }, { "language": { "id": 28, "name": "Bulgarian" }, "allowed": false }, { "language": { "id": 26, "name": "Arabic" }, "allowed": false }, { "language": { "id": 1, "name": "English" }, "allowed": true }, { "language": { "id": 2, "name": "French" }, "allowed": true }], "name": "Français" };
    await axios.post('http://' + targetIP + ':' + sonarrPort + '/api/v3/languageprofile', sonarrAddLanguageProfile, { headers: sonarrHeader });
    const sonarrCustomProfile = { "enabled": true, "required": ["Multi", "vff", "vf"], "ignored": [], "preferred": [], "includePreferredWhenRenaming": false, "tags": [], "indexerId": 0, "name": "Multi" };
    await axios.post('http://' + targetIP + ':' + sonarrPort + '/api/v3/releaseprofile', sonarrCustomProfile, { headers: sonarrHeader });
    const sonarrRootFolder = { "path": path + "/tv" };
    await axios.post('http://' + targetIP + ':' + sonarrPort + '/api/v3/rootfolder', sonarrRootFolder, { headers: sonarrHeader });

    // QBITTORRENT
    let qbUsername = 'admin'; // SED THIS BEFORE LAUNCHING
    let qbPassword = 'adminadmin'; // SED THIS BEFORE LAUNCHING
    let qbDownloadPath = path + '/downloads'; // SED THIS BEFORE LAUNCHING
    console.log('[qBittorrent] Lancement de la configuration');
    const qBittorrentPage = await browser.newPage();
    await qBittorrentPage.goto('http://' + targetIP + ':' + qbittorrentPort, { waitUntil: 'networkidle2' });
    await qBittorrentPage.type('#username', qbUsername);
    await qBittorrentPage.type('#password', qbPassword);
    await qBittorrentPage.click('#login');
    await qBittorrentPage.waitForSelector('#torrentsTableDiv');
    await qBittorrentPage.hover('#desktopNavbar > ul > li:nth-child(4) > a');
    await qBittorrentPage.waitForSelector('#preferencesLink');
    await qBittorrentPage.click('#preferencesLink');
    await qBittorrentPage.waitForSelector('#PrefDownloadsLink > a');
    await qBittorrentPage.click('#PrefDownloadsLink > a');
    await qBittorrentPage.waitForSelector('#savepath_text');
    await qBittorrentPage.evaluate((qbDownloadPath) => { document.querySelector('#savepath_text').value = qbDownloadPath; }, qbDownloadPath);
    await qBittorrentPage.click('#PrefBittorrentLink > a');
    await qBittorrentPage.waitForSelector('#max_ratio_checkbox');
    await qBittorrentPage.click('#max_ratio_checkbox');
    await qBittorrentPage.evaluate(() => { document.querySelector('#max_ratio_value').value = 0; });
    await qBittorrentPage.click('#preferencesPage_content > div:nth-child(8) > input[type=button]');
    console.log('[qBittorrent] Configuration terminée');
    await qBittorrentPage.close();

    // JELLYFIN
    const jellyfinPage = await browser.newPage();
    let jellyfinUsername = '#jellyuser#'; // SED THIS BEFORE LAUNCHING
    let jellyfinPassword = '#jellypass'; // SED THIS BEFORE LAUNCHING
    await jellyfinPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jellyfinPage.goto('http://' + targetIP + ':' + jellyfinPort, { waitUntil: 'networkidle2' });
    await jellyfinPage.waitForSelector('#selectLocalizationLanguage');
    await jellyfinPage.select('#selectLocalizationLanguage', 'fr');
    await jellyfinPage.waitForSelector('#wizardStartPage > div > div > form > div.wizardNavigation > button');
    await jellyfinPage.click('#wizardStartPage > div > div > form > div.wizardNavigation > button');
    console.log('[Jellyfin] Langue changée en français');
    await delay(6000);
    await jellyfinPage.waitForSelector('#txtUsername');
    await jellyfinPage.click('#txtUsername');
    await jellyfinPage.click('#txtUsername');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtUsername', jellyfinUsername);
    await jellyfinPage.waitForSelector('#txtManualPassword');
    await jellyfinPage.click('#txtManualPassword');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtManualPassword', jellyfinPassword);
    await jellyfinPage.waitForSelector('#txtPasswordConfirm');
    await jellyfinPage.click('#txtPasswordConfirm');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtPasswordConfirm', jellyfinPassword);
    await jellyfinPage.waitForSelector('#wizardUserPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardUserPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await delay(6000);
    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('#selectCollectionType');
    await jellyfinPage.select('#selectCollectionType', 'movies');
    await jellyfinPage.waitForSelector('#txtValue');
    await jellyfinPage.click('#txtValue');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtValue', 'Films');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('#selectLanguage', 'fr');
    await jellyfinPage.waitForSelector('#selectCountry');
    await jellyfinPage.select('#selectCountry', 'FR');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await delay(6000);
    await jellyfinPage.click('#txtDirectoryPickerPath');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtDirectoryPickerPath', path + '/movies');
    await jellyfinPage.waitForSelector('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await jellyfinPage.click('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogFooter > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('#selectCollectionType');
    await jellyfinPage.select('#selectCollectionType', 'tvshows');
    await jellyfinPage.waitForSelector('#txtValue');
    await jellyfinPage.click('#txtValue');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtValue', 'Séries');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('#selectLanguage', 'fr');
    await jellyfinPage.waitForSelector('#selectCountry');
    await jellyfinPage.select('#selectCountry', 'FR');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await jellyfinPage.click('#txtDirectoryPickerPath');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtDirectoryPickerPath', path + '/tv');
    await jellyfinPage.waitForSelector('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await jellyfinPage.click('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogFooter > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('#wizardLibraryPage > div > div > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardLibraryPage > div > div > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('#selectLanguage', 'fr');
    await jellyfinPage.waitForSelector('#selectCountry');
    await jellyfinPage.select('#selectCountry', 'FR');
    await jellyfinPage.waitForSelector('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.waitForSelector('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    const elements = await jellyfinPage.$$("#wizardSettingsPage>div>div>form>div.wizardNavigation>button.raised.button-submit.emby-button"); if (elements.length > 1) { await elements[1].click(); console.log("Clic effectué sur le deuxième élément."); } else { console.log("Deuxième élément non trouvé."); }
    await jellyfinPage.waitForSelector('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    await jellyfinPage.click('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    await jellyfinPage.close();

    // JELLYSEER
    let jellyseerrApiKey = '';
    const jellyseerr = await browser.newPage();
    await jellyseerr.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jellyseerr.goto('http://' + targetIP + ':' + jellyseerrPort, { waitUntil: 'networkidle2' });
    const setupbuttons = await jellyseerr.$$('button');
    for (const button of setupbuttons) { const buttonText = await jellyseerr.evaluate(button => button.innerText, button); if (buttonText == 'Use your Jellyfin account') { await button.click(); } }
    const setupinputs = await jellyseerr.$$('input');
    for (const input of setupinputs) { const placeholderText = await jellyseerr.evaluate(input => input.placeholder, input); if (placeholderText == 'Jellyfin URL') { await input.type('http://jellyfin:8096'); } if (placeholderText == 'Email Address') { await input.type('admin@admin.com'); } if (placeholderText == 'Username') { await input.type(jellyfinUsername); } if (placeholderText == 'Password') { await input.type(jellyfinPassword); } }
    const setupbuttons2 = await jellyseerr.$$('button');
    for (const button of setupbuttons2) { const buttonText = await jellyseerr.evaluate(button => button.innerText, button); console.log(buttonText); }
    await setupbuttons2[4].click();
    console.log('[Jellyseerr] Passage du login');
    await delay(4000);
    const librarybuttons = await jellyseerr.$$('button');
    await librarybuttons[1].click();
    await delay(4000);
    const spans = await jellyseerr.$$('li > div > div > span');
    spans[0].click();
    await delay(2000);
    spans[1].click();
    await delay(2000);
    const setupbuttons3 = await jellyseerr.$$('button');
    await setupbuttons3[2].click();
    await delay(2000);
    const setupbuttons4 = await jellyseerr.$$('button');
    await setupbuttons4[2].click();
    await delay(2000);
    const setupbuttons5 = await jellyseerr.$$('button');
    await setupbuttons5[3].click();
    await delay(6000);
    const radarrsonnarbuttons = await jellyseerr.$$('button');
    await radarrsonnarbuttons[3].click();
    await delay(4000);
    await jellyseerr.goto('http://' + targetIP + ':' + jellyseerrPort + '/settings', { waitUntil: 'networkidle2' });
    jellyseerrApiKey = await jellyseerr.evaluate(() => document.querySelector('#apiKey').value);
    console.log('[Jellyseer] Clé api: ' + jellyseerrApiKey);
    const jellyseerrAddRadarr = {
        "name": "Radarr Seedflix",
        "hostname": "radarr",
        "port": 7878,
        "apiKey": radarrApiKey,
        "useSsl": false,
        "baseUrl": "",
        "activeProfileId": 1,
        "activeProfileName": "Any",
        "activeDirectory": path + "/movies",
        "is4k": false,
        "minimumAvailability": "released",
        "tags": [],
        "isDefault": true,
        "syncEnabled": false,
        "preventSearch": false
    }
    await axios.post('http://' + targetIP + ':' + jellyseerrPort + '/api/v1/settings/sonarr', jellyseerrAddRadarr, { headers: { 'x-api-key': jellyseerrApiKey } });
    const jellyseerrAddSonarr = {
        "name": "Sonarr Seedflix",
        "hostname": "sonarr",
        "port": 8989,
        "apiKey": sonarrApiKey,
        "useSsl": false,
        "activeProfileId": 1,
        "activeLanguageProfileId": 2,
        "activeProfileName": "Any",
        "activeDirectory": path + "/tv",
        "tags": [],
        "animeTags": [],
        "is4k": false,
        "isDefault": true,
        "enableSeasonFolders": false,
        "syncEnabled": false,
        "preventSearch": false
    }
    await axios.post('http://' + targetIP + ':' + jellyseerrPort + '/api/v1/settings/sonarr', jellyseerrAddSonarr, { headers: { 'x-api-key': jellyseerrApiKey } });
    await jellyseerr.close();

    await browser.close();




})();