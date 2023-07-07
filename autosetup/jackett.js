const puppeteer = require('puppeteer');

let jackettUrl = 'http://localhost:9117';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    const browser = await puppeteer.launch();

    let jacketIndexers = ['ThePirateBay', 'Torrent911'];
    // TODO: add indexers
    // TODO: tests each indexer to be sure it's working
    // TODO: add FlareSolverr url
    const jackettPage = await browser.newPage();
    await jackettPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jackettPage.goto(jackettUrl, { waitUntil: 'networkidle2' });
    let jackettApiKey = await jackettPage.evaluate(() => { return document.querySelector('#api-key-input').value; });
    console.log('[Jackett] Clé api: ' + jackettApiKey);
    // add the api keys to keys.json like Jackett: 'key'
    let keys = require('./keys.json');
    keys.Jackett = jackettApiKey;
    let keysJson = JSON.stringify(keys);
    require('fs').writeFileSync('./keys.json', keysJson);

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

    // close browser
    await browser.close();

})();