const puppeteer = require('puppeteer');
const fs = require('fs');

let jellyseerrUrl = 'http://localhost:5055';


(async () => {

    const browser = await puppeteer.launch();

    const jellyseer = await browser.newPage();
    await jellyseer.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jellyseer.goto(jellyfinUrl, { waitUntil: 'networkidle2' });
    await jellyseer.close();
    await browser.close();


})();