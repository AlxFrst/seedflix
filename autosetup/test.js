const puppeteer = require('puppeteer');
const axios = require('axios');

let myIP = '192.168.1.210'; // NEED TO SED THIS BEFORE RUNNING
let radarrUrl = 'http://' + myIP + ':7878/settings/general';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


(async () => {

    const browser = await puppeteer.launch({ headless: false });

    // RADARR
    const radarrPage = await browser.newPage();
    await radarrPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await radarrPage.goto(radarrUrl, { waitUntil: 'networkidle2' });
    const inputValues2 = await radarrPage.$$eval('input[type="text"]', inputs => {
        return inputs.map(input => input.value);
    });
    let radarrApiKey = inputValues2[2]; // Récupérer la troisième valeur du tableau
    console.log('radarrApiKey: ' + radarrApiKey);
    await radarrPage.goto('http://' + myIP + ':7878/settings/downloadclients', { waitUntil: 'networkidle2' });
    await radarrPage.$$eval('button', buttons => { buttons[buttons.length - 2].click(); }); await radarrPage.$$eval('button', btns => { btns[13].click(); });
    await radarrPage.$$eval('input[type="text"]', inputs => {
        inputs[0].value = 'qbittorrent';
        inputs[3].value = 'admin';
        inputs[4].value = 'adminadmin';
    });
    await delay(3000);
    const savebutton = await radarrPage.$$eval('button', btns => {
        // click on the 7th button
        btns[6].click();
    });


})();