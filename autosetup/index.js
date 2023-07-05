const puppeteer = require('puppeteer');

let myIP = 'localhost'; // NEED TO SED THIS BEFORE RUNNING
let qBittorrentUrl = 'http://' + myIP + ':8080';
let jackettUrl = 'http://' + myIP + ':9117';
let sonarrUrl = 'http://' + myIP + ':8989/settings/general';
let radarrUrl = 'http://' + myIP + ':7878/settings/general';
let jellyfinUrl = 'http://' + myIP + ':8096';
let jellyseerrUrl = 'http://' + myIP + ':5055';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    const browser = await puppeteer.launch({ headless: false });

    // qBittorrent
    // variables
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
    await qBittorrentpage.evaluate((qbDownloadPath) => {
        document.querySelector('#savepath_text').value = qbDownloadPath;
    }, qbDownloadPath);
    await qBittorrentpage.click('#PrefBittorrentLink > a');
    await qBittorrentpage.waitForSelector('#max_ratio_checkbox');
    await qBittorrentpage.click('#max_ratio_checkbox');
    await qBittorrentpage.evaluate(() => {
        document.querySelector('#max_ratio_value').value = 0;
    });
    await qBittorrentpage.click('#preferencesPage_content > div:nth-child(8) > input[type=button]');
    console.log('qBittorrent config done');
    await qBittorrentpage.close();

    // JACKETT
    const jackettPage = await browser.newPage();
    await jackettPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jackettPage.goto(jackettUrl, { waitUntil: 'networkidle2' });
    let jackettApiKey = await jackettPage.evaluate(() => {
        return document.querySelector('#api-key-input').value;
    });
    console.log('jackettApiKey: ' + jackettApiKey);
    await jackettPage.close();

    // SONARR
    const sonarrPage = await browser.newPage();
    await sonarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await sonarrPage.goto(sonarrUrl, { waitUntil: 'networkidle2' });
    const inputValues = await sonarrPage.$$eval('input[type="text"]', inputs => {
        return inputs.map(input => input.value);
    });
    let sonarrApiKey = inputValues[2]; // Récupérer la troisième valeur du tableau
    console.log('sonarrApiKey: ' + sonarrApiKey);
    await sonarrPage.close();

    // RADARR
    const radarrPage = await browser.newPage();
    await radarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await radarrPage.goto(radarrUrl, { waitUntil: 'networkidle2' });
    const inputValues2 = await radarrPage.$$eval('input[type="text"]', inputs => {
        return inputs.map(input => input.value);
    }
    );
    let radarrApiKey = inputValues2[2]; // Récupérer la troisième valeur du tableau
    console.log('radarrApiKey: ' + radarrApiKey);
    await radarrPage.close();

    // JELLYFIN
    // variables
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
    await jellyfinPage.evaluate((jellyfinPassword) => {
        document.querySelector('#txtManualPassword').value = jellyfinPassword;
    }, jellyfinPassword);
    await jellyfinPage.evaluate((jellyfinPassword) => {
        document.querySelector('#txtPasswordConfirm').value = jellyfinPassword;
    }, jellyfinPassword);
    await jellyfinPage.click('#wizardUserPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.waitForSelector('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogHeader > h3');
    await jellyfinPage.click('#selectCollectionType');
    await jellyfinPage.keyboard.down('ArrowDown');
    await jellyfinPage.keyboard.press('Enter');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await jellyfinPage.type('#txtDirectoryPickerPath', '/data/movies');
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
    await jellyfinPage.type('#txtDirectoryPickerPath', '/data/tv');
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
    // click on #wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button but it's the seconde in the NodeList
    await jellyfinPage.evaluate(() => {
        document.querySelectorAll('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button')[1].click();
    });
    await jellyfinPage.waitForSelector('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    await jellyfinPage.click('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    console.log('Jellyfin setup done');
    await jellyfinPage.close();
})();