const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

let jellyseerrUrl = 'http://localhost:5055';

let jellyfinUsername = '#jellyfinUsername#'; // SED THIS BEFORE RUNNING
let jellyfinPassword = '#jellyfinPassword#'; // SED THIS BEFORE RUNNING
let path = '#path#'; // NEED TO SED THIS BEFORE RUNNING


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


(async () => {

    const browser = await puppeteer.launch();

    const jellyseer = await browser.newPage();
    await jellyseer.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jellyseer.goto(jellyseerrUrl, { waitUntil: 'networkidle2' });
    const setupbuttons = await jellyseer.$$('button');
    for (const button of setupbuttons) {
        const buttonText = await jellyseer.evaluate(button => button.innerText, button);
        // console.log(buttonText);
        if (buttonText == 'Use your Jellyfin account') {
            await button.click();
        }
    }
    const setupinputs = await jellyseer.$$('input');
    for (const input of setupinputs) {
        const placeholderText = await jellyseer.evaluate(input => input.placeholder, input);
        // console.log(placeholderText);
        if (placeholderText == 'Jellyfin URL') {
            await input.type('http://jellyfin:8096');
        }
        if (placeholderText == 'Email Address') {
            await input.type('admin@admin.com');
        }
        if (placeholderText == 'Username') {
            await input.type(jellyfinUsername);
        }
        if (placeholderText == 'Password') {
            await input.type(jellyfinPassword);
        }
    }
    const setupbuttons2 = await jellyseer.$$('button');
    for (const button of setupbuttons2) {
        const buttonText = await jellyseer.evaluate(button => button.innerText, button);
        console.log(buttonText);
    }
    await setupbuttons2[4].click();
    console.log('[Jellyseer] Passage du login');
    await delay(4000);
    const librarybuttons = await jellyseer.$$('button');
    await librarybuttons[1].click();
    await delay(4000);
    const spans = await jellyseer.$$('li > div > div > span');
    spans[0].click();
    await delay(2000);
    spans[1].click();
    await delay(2000);
    const setupbuttons3 = await jellyseer.$$('button');
    await setupbuttons3[2].click();
    await delay(2000);
    const setupbuttons4 = await jellyseer.$$('button');
    await setupbuttons4[2].click();
    await delay(2000);
    const setupbuttons5 = await jellyseer.$$('button');
    await setupbuttons5[3].click();
    await delay(6000);
    const radarrsonnarbuttons = await jellyseer.$$('button');
    await radarrsonnarbuttons[3].click();
    await delay(4000);

    await jellyseer.goto(jellyseerrUrl + '/settings', { waitUntil: 'networkidle2' });
    let apikey = await jellyseer.evaluate(() => document.querySelector('#apiKey').value);
    console.log('[Jellyseer] Clé api: ' + apikey);
    let keys = JSON.parse(fs.readFileSync(process.env.HOME + '/seedflix/autosetup/keys.json'));
    keys.Jellyseer = apikey;
    fs.writeFileSync(process.env.HOME + '/seedflix/autosetup/keys.json', JSON.stringify(keys));

    keys = JSON.parse(fs.readFileSync(process.env.HOME + '/seedflix/autosetup/keys.json'));
    let RadarrApiKey = keys.Radarr;
    console.log('[Radarr] Clé api: ' + RadarrApiKey);

    keys = JSON.parse(fs.readFileSync(process.env.HOME + '/seedflix/autosetup/keys.json'));
    let SonarrApiKey = keys.Sonarr;
    console.log('[Sonarr] Clé api: ' + SonarrApiKey);

    const radarrData = {
        "name": "Radarr",
        "hostname": "radarr",
        "port": 7878,
        "apiKey": RadarrApiKey,
        "useSsl": false,
        "activeProfileId": 1,
        "activeProfileName": "Any",
        "activeDirectory": path + "/movies",
        "is4k": false,
        "minimumAvailability": "released",
        "tags": [],
        "isDefault": true,
        "syncEnabled": false,
        "preventSearch": false
    };
    await axios.post(jellyseerrUrl + '/api/v1/settings/radarr', radarrData, { headers: { 'x-api-key': apikey } })
        .then(function (response) {
            console.log('[Jellyseer] Radarr ajouté');
        })
        .catch(function (error) {
            console.log(error);
        });

    const sonarrData = {
        "name": "Sonarr",
        "hostname": "sonarr",
        "port": 8989,
        "apiKey": SonarrApiKey,
        "useSsl": false,
        "activeProfileId": 1,
        "activeLanguageProfileId": 2,
        "activeProfileName": "Any",
        "activeDirectory": path + "/tv",
        "tags": [],
        "animeTags": [],
        "is4k": false,
        "isDefault": true,
        "enableSeasonFolders": false,
        "syncEnabled": false,
        "preventSearch": false
    }
    await axios.post(jellyseerrUrl + '/api/v1/settings/sonarr', sonarrData, { headers: { 'x-api-key': apikey } })
        .then(function (response) {
            console.log('[Jellyseer] Sonarr ajouté');
        })
        .catch(function (error) {
            console.log(error);
        });

    await jellyseer.close();
    await browser.close();


})();