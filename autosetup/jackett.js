const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

let jackettUrl = 'http://192.168.1.210:9117';

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

    // add jackett api key in keys.json
    let keys = JSON.parse(fs.readFileSync('./keys.json'));
    keys.Jackett = jackettApiKey;
    fs.writeFileSync('./keys.json', JSON.stringify(keys));

    await jackettPage.goto('http://192.168.1.210:9117/api/v2.0/indexers/thepiratebay/config', { waitUntil: 'networkidle0' });

    const postData = {
        id: 'sitelink',
        type: 'inputstring',
        name: 'Site Link',
        value: 'https://thepiratebay.org/'
    };

    await jackettPage.evaluate((data) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'http://192.168.1.210:9117/api/v2.0/indexers/thepiratebay/config';

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }, postData);

    await jackettPage.waitForNavigation();

    const response = await jackettPage.content();
    console.log('Response:', response);


    await jackettPage.click('#jackett-add-indexer');
    await delay(10000);
    for (indexer of jacketIndexers) {
        await jackettPage.click('#select' + indexer.toLowerCase());
        await delay(3000);
    }
    await jackettPage.click('#add-selected-indexers');
    await delay(3000);
    await jackettPage.reload({ waitUntil: 'networkidle2' });
    await jackettPage.waitForSelector('#jackett-add-indexer')
    await jackettPage.click('#jackett-test-all');
    await delay(3000);
    await jackettPage.close();

    // close browser
    await browser.close();

})();