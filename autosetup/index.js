const puppeteer = require('puppeteer');
const axios = require('axios');

let myIP = 'localhost'; // NEED TO SED THIS BEFORE RUNNING
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

    // qBittorrent
    let qbUsername = 'admin';
    let qbPassword = 'adminadmin';
    let qbDownloadPath = '/data/downloads'; // NEED TO SED THIS BEFORE RUNNING
    const qBittorrentpage = await browser.newPage();
    await qBittorrentpage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await qBittorrentpage.goto(qBittorrentUrl, { waitUntil: 'networkidle2' });
    await qBittorrentpage.type('#username', qbUsername);
    await qBittorrentpage.type('#password', qbPassword);
    await qBittorrentpage.click('#login');
    await qBittorrentpage.waitForSelector('#torrentsTableDiv');
    await qBittorrentpage.hover('#desktopNavbar > ul > li:nth-child(4) > a');
    await qBittorrentpage.waitForSelector('#preferencesLink');
    await qBittorrentpage.click('#preferencesLink');
    await qBittorrentpage.waitForSelector('#PrefDownloadsLink > a');
    await qBittorrentpage.click('#PrefDownloadsLink > a');
    await qBittorrentpage.waitForSelector('#savepath_text');
    await qBittorrentpage.evaluate((qbDownloadPath) => { document.querySelector('#savepath_text').value = qbDownloadPath; }, qbDownloadPath);
    await qBittorrentpage.click('#PrefBittorrentLink > a');
    await qBittorrentpage.waitForSelector('#max_ratio_checkbox');
    await qBittorrentpage.click('#max_ratio_checkbox');
    await qBittorrentpage.evaluate(() => { document.querySelector('#max_ratio_value').value = 0; });
    await qBittorrentpage.click('#preferencesPage_content > div:nth-child(8) > input[type=button]');
    console.log('[qBittorrent] Installation terminée');
    await qBittorrentpage.close();

    // JACKETT
    let jacketIndexers = ['ThePirateBay', 'Torrent911'];
    // TODO: add indexers
    // TODO: tests each indexer to be sure it's working
    // TODO: add FlareSolverr url
    const jackettPage = await browser.newPage();
    await jackettPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jackettPage.goto(jackettUrl, { waitUntil: 'networkidle2' });
    let jackettApiKey = await jackettPage.evaluate(() => { return document.querySelector('#api-key-input').value; });
    console.log('[Jackett] Clé api: ' + jackettApiKey);
    await jackettPage.click('#jackett-add-indexer');
    await delay(1000);
    for (indexer of jacketIndexers) {
        await jackettPage.click('#select' + indexer.toLowerCase());
        await delay(1000);
    }
    await jackettPage.click('#add-selected-indexers');
    await delay(1000);
    await jackettPage.reload({ waitUntil: 'networkidle2' });
    await jackettPage.waitForSelector('#jackett-add-indexer')
    await jackettPage.click('#jackett-test-all');
    await delay(3000);
    await jackettPage.close();


    // SONARR
    // TODO: add each indexers
    const sonarrPage = await browser.newPage();
    await sonarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await sonarrPage.goto(sonarrUrl + "/settings/general", { waitUntil: 'networkidle2' });
    const inputValues = await sonarrPage.$$eval('input[type="text"]', inputs => { return inputs.map(input => input.value); });
    let sonarrApiKey = inputValues[2]; // Récupérer la troisième valeur du tableau
    console.log('[Sonarr] Clé api: ' + sonarrApiKey);
    await sonarrPage.close();
    // API CALLS
    const headers = { 'X-Api-Key': sonarrApiKey, 'Content-Type': 'application/json' };
    const data = { "name": "qbittorrent", "protocol": "torrent", "fields": [{ "name": "host", "value": "qbittorrent" }, { "name": "username", "value": "admin" }, { "name": "password", "value": "adminadmin" }], "implementationName": "QBitTorrent", "implementation": "QBitTorrent", "configContract": "QBitTorrentSettings", "enable": true };
    axios.post(sonarrUrl + '/api/v3/downloadclient', data, { headers })
        .then(response => console.log(response.data))
        .catch(error => console.error(error));

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


    // JELLYFIN
    let jellyfinUsername = 'admin'; // NEED TO SED THIS BEFORE RUNNING
    let jellyfinPassword = 'adminadmin'; // NEED TO SED THIS BEFORE RUNNING
    let jellyfinLanguage = 'fr'; // NEED TO SED THIS BEFORE RUNNING
    let jellyfinMoviePath = '/data/movies'; // NEED TO SED THIS BEFORE RUNNING
    let jellyfinTvPath = '/data/tv'; // NEED TO SED THIS BEFORE RUNNING
    const jellyfinPage = await browser.newPage();
    await jellyfinPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jellyfinPage.goto(jellyfinUrl, { waitUntil: 'networkidle2' });
    await jellyfinPage.waitForSelector('#selectLocalizationLanguage');
    await jellyfinPage.select('select#selectLocalizationLanguage', jellyfinLanguage);
    await jellyfinPage.click('#wizardStartPage > div > div > form > div.wizardNavigation > button');
    await jellyfinPage.waitForSelector('#txtUsername');
    await delay(2000);
    await jellyfinPage.click('#txtUsername');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtUsername', jellyfinUsername);
    await jellyfinPage.evaluate((jellyfinPassword) => { document.querySelector('#txtManualPassword').value = jellyfinPassword; }, jellyfinPassword);
    await jellyfinPage.evaluate((jellyfinPassword) => { document.querySelector('#txtPasswordConfirm').value = jellyfinPassword; }, jellyfinPassword);
    await jellyfinPage.click('#wizardUserPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.waitForSelector('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogHeader > h3');
    await jellyfinPage.click('#selectCollectionType');
    await jellyfinPage.keyboard.down('ArrowDown');
    await jellyfinPage.keyboard.press('Enter');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await jellyfinPage.type('#txtDirectoryPickerPath', jellyfinMoviePath);
    await jellyfinPage.keyboard.press('Enter');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('select#selectLanguage', jellyfinLanguage);
    await jellyfinPage.select('select#selectCountry', jellyfinLanguage.toUpperCase());
    await delay(2000);
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogFooter > button');
    await delay(2000);
    await jellyfinPage.waitForSelector('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogHeader > h3');
    await jellyfinPage.click('#selectCollectionType');
    await jellyfinPage.keyboard.down('ArrowDown');
    await jellyfinPage.keyboard.down('ArrowDown');
    await jellyfinPage.keyboard.down('ArrowDown');
    await jellyfinPage.keyboard.press('Enter');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await jellyfinPage.type('#txtDirectoryPickerPath', jellyfinTvPath);
    await jellyfinPage.keyboard.press('Enter');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('select#selectLanguage', jellyfinLanguage);
    await jellyfinPage.select('select#selectCountry', jellyfinLanguage.toUpperCase());
    await delay(2000);
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogFooter > button');
    await delay(2000);
    await jellyfinPage.waitForSelector('#wizardLibraryPage > div > div > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardLibraryPage > div > div > div.wizardNavigation > button.raised.button-submit.emby-button');
    await delay(2000);
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('select#selectLanguage', jellyfinLanguage);
    await jellyfinPage.select('select#selectCountry', jellyfinLanguage.toUpperCase());
    await delay(2000);
    await jellyfinPage.click('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await delay(2000);
    await jellyfinPage.waitForSelector('#wizardSettingsPage > div > div > form > div:nth-child(2) > label > span.checkboxOutline');
    await jellyfinPage.evaluate(() => { document.querySelectorAll('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button')[1].click(); });
    await jellyfinPage.waitForSelector('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    await jellyfinPage.click('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    console.log('[Jellyfin] Installation terminée');
    await jellyfinPage.close();

    // JELLYSEER


    // close browser
    await browser.close();
    console.log("L'installation des services est terminée");
    console.log("Vous pouvez desormer acceder a JellySeer via l'adresse suivante : http://localhost:5055");

})();