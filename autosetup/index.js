const puppeteer = require('puppeteer');

let myIP = '192.168.1.128'; // change for debug test with a local server
let qBittorrentUrl = 'http://' + myIP + ':8080';
let jackettUrl = 'http://' + myIP + ':9117';
let sonarrUrl = 'http://' + myIP + ':8989';
let radarrUrl = 'http://' + myIP + ':7878';
let jellyfinUrl = 'http://' + myIP + ':8096';
let jellyseerrUrl = 'http://' + myIP + ':5055';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {


    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 }); // DEBUG

    // qBittorrent config
    let qbUsername = 'admin';
    let qbPassword = 'adminadmin';
    let qbDownloadPath = '/data/downloads'; // NEED TO SED THIS BEFORE RUNNING

    await page.goto(qBittorrentUrl);
    await page.type('#username', qbUsername);
    await page.type('#password', qbPassword);
    await page.click('#login');
    await page.waitForSelector('#torrentsTableDiv');
    await page.hover('#desktopNavbar > ul > li:nth-child(4)')
    await page.click('#preferencesLink');
    await page.click('#savepath_text');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('#savepath_text', qbDownloadPath);
    await page.click('#PrefBittorrentLink > a');
    await page.click('#max_ratio_checkbox');
    await page.click('#max_ratio_value');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('#max_ratio_value', '0');
    await page.click('#preferencesPage_content > div:nth-child(8) > input[type=button]')

    // Jackett config
    // await page.goto(jackettUrl);
    // await page.waitForSelector('#api-key-input');
    // let jackettApiKey = await page.$eval('#api-key-input', el => el.value);
    // console.log(jackettApiKey);
    // // add indexers
    // await delay(3000);
    // await page.click('#jackett-add-indexer');
    // await delay(3000);
    // await page.click('#selecttorrent911');
    // await page.click('#add-selected-indexers');

    // // for each class sorting_1 console.log find
    // let indexerNames = []
    // const elements = await page.$$('#configured-indexer-datatable > tbody > tr');
    // for (const element of elements) {
    //     let indexerName = await element.$eval('td:nth-child(1) > a', el => el.innerText);
    //     indexerNames.push(indexerName);
    // }
    // console.log(indexerNames);




})();