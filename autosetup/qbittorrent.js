const puppeteer = require('puppeteer');

let qBittorrentUrl = 'http://localhost:8080';

(async () => {

    const browser = await puppeteer.launch();

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
    await browser.close();

})();