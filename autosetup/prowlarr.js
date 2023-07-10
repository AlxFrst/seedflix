const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

let prowlarrUrl = 'http://192.168.1.210:9696';
let username = 'admin';
let password = 'admin';


(async () => {

    const browser = await puppeteer.launch({ headless: false });
    const prowlarrPage = await browser.newPage();
    await prowlarrPage.goto(prowlarrUrl, { waitUntil: 'networkidle2' });
    // if #id-9 > button if found, then it's the first time setup
    if (await prowlarrPage.$('#id-9 > button') !== null) {
        console.log('First time setup detected');
        await prowlarrPage.waitForSelector('#id-9 > button');
        await prowlarrPage.click('#id-9 > button');
        await prowlarrPage.waitForSelector('#id-10 > div > div:nth-child(4) > div');
        await prowlarrPage.click('#id-10 > div > div:nth-child(4) > div');
        const inputs = await prowlarrPage.$$('input');
        await inputs[0].type(username);
        await inputs[1].type(password);
        const spans = await prowlarrPage.$$('span');
        await spans[1].click();
    }

    if (await prowlarrPage.$('body > div > div > div.panel > div.panel-body > div') !== null) {
        console.log('Login detected');
        await prowlarrPage.waitForSelector('body > div > div > div.panel > div.panel-body > form > div:nth-child(1) > input');
        await prowlarrPage.type('body > div > div > div.panel > div.panel-body > form > div:nth-child(1) > input', username);
        await prowlarrPage.type('body > div > div > div.panel > div.panel-body > form > div:nth-child(2) > input', password);
        await prowlarrPage.click('body > div > div > div.panel > div.panel-body > form > button');
    }
    await prowlarrPage.goto(prowlarrUrl + '/settings/general', { waitUntil: 'networkidle2' });
    const inputs = await prowlarrPage.$$('input');
    let apiKey = await (await inputs[5].getProperty('value')).jsonValue();
    console.log(apiKey);
    let keys = JSON.parse(fs.readFileSync('./keys.json'));
    keys.Prowlarr = apiKey;
    fs.writeFileSync('./keys.json', JSON.stringify(keys));
    await prowlarrPage.close();



})();