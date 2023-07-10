const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

let targetIP = '192.168.1.210';

let radarrPort = '7878';
let sonarrPort = '8989';
let prowlarrPort = '9696';

(async () => {

    const browser = await puppeteer.launch({ headless: true });

    // PROWLARR
    let prowlarrUsername = 'admin';
    let prowlarrPassword = 'admin';
    let prowlarrApiKey = '';
    const prowlarrPage = await browser.newPage();
    await prowlarrPage.goto('http://' + targetIP + ':' + prowlarrPort, { waitUntil: 'networkidle2' });
    // if #id-9 > button if found, then it's the first time setup
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

    await browser.close();

    // Api Calls






})();