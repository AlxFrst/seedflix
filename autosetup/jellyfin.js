const puppeteer = require('puppeteer');
const fs = require('fs');

let jellyfinUrl = 'http://localhost:8096';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    const browser = await puppeteer.launch();
    let jellyfinUsername = '#username#'; // SED THIS BEFORE RUNNING
    let jellyfinPassword = '#password#'; // SED THIS BEFORE RUNNING
    let path = '#path#'; // NEED TO SED THIS BEFORE RUNNING

    // debug
    // jellyfinUrl = 'http://192.168.1.xxxx:8096';
    // jellyfinUsername = 'admin';
    // jellyfinPassword = 'adminadmin';
    // path = '/data';

    const jellyfinPage = await browser.newPage();
    await jellyfinPage.setViewport({ width: 1920, height: 1080 }); // DEBUG
    await jellyfinPage.goto(jellyfinUrl, { waitUntil: 'networkidle2' });
    await jellyfinPage.waitForSelector('#selectLocalizationLanguage');
    await jellyfinPage.select('#selectLocalizationLanguage', 'fr');
    await jellyfinPage.waitForSelector('#wizardStartPage > div > div > form > div.wizardNavigation > button');
    await jellyfinPage.click('#wizardStartPage > div > div > form > div.wizardNavigation > button');
    console.log('[Jellyfin] Langue changée en français');
    await delay(6000);


    await jellyfinPage.waitForSelector('#txtUsername');
    await jellyfinPage.click('#txtUsername');
    await jellyfinPage.click('#txtUsername');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtUsername', jellyfinUsername);
    await jellyfinPage.waitForSelector('#txtManualPassword');
    await jellyfinPage.click('#txtManualPassword');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtManualPassword', jellyfinPassword);
    await jellyfinPage.waitForSelector('#txtPasswordConfirm');
    await jellyfinPage.click('#txtPasswordConfirm');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtPasswordConfirm', jellyfinPassword);
    await jellyfinPage.waitForSelector('#wizardUserPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardUserPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await delay(6000);

    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('#selectCollectionType');
    await jellyfinPage.select('#selectCollectionType', 'movies');
    await jellyfinPage.waitForSelector('#txtValue');
    await jellyfinPage.click('#txtValue');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtValue', 'Films');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('#selectLanguage', 'fr');
    await jellyfinPage.waitForSelector('#selectCountry');
    await jellyfinPage.select('#selectCountry', 'FR');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await delay(6000);
    await jellyfinPage.click('#txtDirectoryPickerPath');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtDirectoryPickerPath', path + '/movies');
    await jellyfinPage.waitForSelector('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await jellyfinPage.click('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogFooter > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogFooter > button');
    await delay(6000);


    await jellyfinPage.click('#addLibrary > div > div.cardScalable.visualCardBox-cardScalable > div.cardContent > div');
    await jellyfinPage.waitForSelector('#selectCollectionType');
    await jellyfinPage.select('#selectCollectionType', 'tvshows');
    await jellyfinPage.waitForSelector('#txtValue');
    await jellyfinPage.click('#txtValue');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtValue', 'Séries');
    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('#selectLanguage', 'fr');
    await jellyfinPage.waitForSelector('#selectCountry');
    await jellyfinPage.select('#selectCountry', 'FR');
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogContent.scrollY > div > div.folders > div:nth-child(1) > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('#txtDirectoryPickerPath');
    await jellyfinPage.click('#txtDirectoryPickerPath');
    await jellyfinPage.keyboard.down('Control');
    await jellyfinPage.keyboard.press('A');
    await jellyfinPage.keyboard.up('Control');
    await jellyfinPage.keyboard.press('Backspace');
    await jellyfinPage.type('#txtDirectoryPickerPath', path + '/tv');
    await jellyfinPage.waitForSelector('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await jellyfinPage.click('body > div:nth-child(15) > div > div.formDialogContent.scrollY > div > form > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('body > div.dialogContainer > div > div.formDialogFooter > button');
    await jellyfinPage.click('body > div.dialogContainer > div > div.formDialogFooter > button');
    await delay(6000);
    await jellyfinPage.waitForSelector('#wizardLibraryPage > div > div > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardLibraryPage > div > div > div.wizardNavigation > button.raised.button-submit.emby-button');

    await jellyfinPage.waitForSelector('#selectLanguage');
    await jellyfinPage.select('#selectLanguage', 'fr');
    await jellyfinPage.waitForSelector('#selectCountry');
    await jellyfinPage.select('#selectCountry', 'FR');
    await jellyfinPage.waitForSelector('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');
    await jellyfinPage.click('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');

    await jellyfinPage.waitForSelector('#wizardSettingsPage > div > div > form > div.wizardNavigation > button.raised.button-submit.emby-button');

    const elements = await jellyfinPage.$$("#wizardSettingsPage>div>div>form>div.wizardNavigation>button.raised.button-submit.emby-button"); if (elements.length > 1) { await elements[1].click(); console.log("Clic effectué sur le deuxième élément."); } else { console.log("Deuxième élément non trouvé."); }

    // await jellyfinPage.waitForSelector('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');
    // await jellyfinPage.click('#wizardFinishPage > div > div > div > button.raised.btnWizardNext.button-submit.emby-button');

    // await jellyfinPage.close();
    // await browser.close();

})();