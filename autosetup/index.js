const puppeteer = require('puppeteer');

let myIP = '192.168.1.210'; // change for debug test with a local server
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

    const qBittorrentpage = await browser.newPage();
    await qBittorrentpage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    // qBittorrent config
    let qbUsername = 'admin';
    let qbPassword = 'adminadmin';
    let qbDownloadPath = '/data/downloads'; // NEED TO SED THIS BEFORE RUNNING

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
    // replace download path
    await qBittorrentpage.evaluate((qbDownloadPath) => {
        document.querySelector('#savepath_text').value = qbDownloadPath;
    }, qbDownloadPath);
    await qBittorrentpage.click('#PrefBittorrentLink > a');
    await qBittorrentpage.waitForSelector('#max_ratio_checkbox');
    await qBittorrentpage.click('#max_ratio_checkbox');
    // replace #max_ratio_value with 0
    await qBittorrentpage.evaluate(() => {
        document.querySelector('#max_ratio_value').value = 0;
    });
    await qBittorrentpage.click('#preferencesPage_content > div:nth-child(8) > input[type=button]');
    console.log('qBittorrent config done');
    await qBittorrentpage.close();

    // Jackett config
    // Open new tab
    const jackettPage = await browser.newPage();
    await jackettPage.setViewport({ width: 1920, height: 1080 }); // DEBUG

    // Jackett config
    let defaultIndexer = ['1337x', 'torrent911', 'limetorrents', 'cpasbien'];

    await jackettPage.goto(jackettUrl, { waitUntil: 'networkidle2' });
    await jackettPage.waitForSelector('#jackett-add-indexer');
    await jackettPage.click('#jackett-add-indexer');
    await delay(3000);
    for (let i = 0; i < defaultIndexer.length; i++) {
        console.log('add ' + defaultIndexer[i]);
        await jackettPage.click('#select' + defaultIndexer[i]);
        await delay(2000); // Attendre après chaque clic
    }
    await jackettPage.click('#add-selected-indexers');
    await delay(3000);

})();