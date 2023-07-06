const puppeteer = require('puppeteer');
const axios = require('axios');

let myIP = '192.168.1.210'; // NEED TO SED THIS BEFORE RUNNING
let qBittorrentUrl = 'http://' + myIP + ':8080';
let jackettUrl = 'http://' + myIP + ':9117';
let sonarrUrl = 'http://' + myIP + ':8989/settings/general';
let radarrUrl = 'http://' + myIP + ':7878/settings/general';
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
    const browser = await puppeteer.launch({ headless: false });

    // JACKETT
    let jacketIndexers = ['1337x', 'ThePirateBay', 'Torrent911'];
    // TODO: add indexers DONE
    // TODO: Handle errors if already added
    // TODO: tests each indexer to be sure it's working
    // TODO: add FlareSolverr url
    const jackettPage = await browser.newPage();
    await jackettPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jackettPage.goto(jackettUrl, { waitUntil: 'networkidle2' });
    let jackettApiKey = await jackettPage.evaluate(() => { return document.querySelector('#api-key-input').value; });
    // console.log('[Jackett] Clé api: ' + jackettApiKey);
    // await jackettPage.click('#jackett-add-indexer');
    // await delay(1000);
    // for (indexer of jacketIndexers) {
    //     await jackettPage.click('#select' + indexer.toLowerCase());
    //     await delay(1000);
    // }
    // await jackettPage.click('#add-selected-indexers');
    // await delay(1000);
    // await jackettPage.reload({ waitUntil: 'networkidle2' });
    // await jackettPage.waitForSelector('#jackett-add-indexer')
    // await jackettPage.click('#jackett-test-all');
    // await delay(3000);
    await jackettPage.reload({ waitUntil: 'networkidle2' });
    const indexerRows = await jackettPage.$$('#configured-indexer-datatable > tbody > tr');
    for (const row of indexerRows) {
        const indexerName = await row.$eval('td:nth-child(1) > a', el => el.innerText);
        console.log(indexerName);
        const testBtn = await row.$('td.fit > div > button.btn.btn-warning.btn-xs.indexer-button-test');
        const confBtn = await row.$('td.fit > div > button.btn.btn-primary.btn-xs.indexer-setup');
        // if the data-state of testBtn is 'error' then we need to click on confBtn
        const state = await testBtn.evaluate((el) => el.getAttribute('data-state'));
        console.log(indexerName + ' state: ' + state);
        // while an indexer is not working we click on the confBtn
        while (state != 'success') {
            await delay(1000);
            const confBtn = await row.$('td.fit > div > button.btn.btn-primary.btn-xs.indexer-setup');
            await confBtn.click();
            await page.waitForSelector('#modals > div > div > div > div.modal-body > form > div.setup-item-alternativesitelinks.alert.alert-info');
            const altSiteLinks = await page.$$('#modals > div > div > div > div.modal-body > form > div.setup-item-alternativesitelinks.alert.alert-info > ul > li > a');
            for (const altSiteLink of altSiteLinks) {
                const altSiteInput = await altSiteLink.$('#modals > div > div > div > div.modal-body > form > div:nth-child(1) > div.setup-item-value > div > input');
                const saveBtn = await altSiteLink.$('#modals > div > div > div > div.modal-footer > button.btn.btn-primary.setup-indexer-go');
                const linkText = await altSiteLink.evaluate((el) => el.innerText);
            }
        }
    }

})();