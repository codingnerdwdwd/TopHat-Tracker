import puppeteer from "puppeteer";
import notifier from "node-notifier";

const USER_DATA_DIR = "./tophat-login";
let TOPHAT_URL = "<TOPHAT_URL>" // Your TopHat URL here
const POLL_INTERVAL = 2000 // in milliseconds

async function launchBrowser(headless = true) {

    const browser = await puppeteer.launch({
        headless: headless,
        userDataDir: USER_DATA_DIR
     });

    console.log(`Browser Launched as ${headless ? "headless" : "visible"}`)
    const page = (await browser.pages())[0]
    return { browser, page }
}

async function connectToPage(page) {
    await page.goto(TOPHAT_URL, {waitUntil: 'networkidle2'});
    return page;
}

async function waitForLogin(page, browser) {
     if(page.url().includes("login")){
        console.log("not logged in");

        let pages = await browser.pages();
        for(page in pages){
            await pages[page].close();
        }
        await browser.close(); //Cant change headless mode after launch. Closes browser to relaunch.

        ({browser, page} = await launchBrowser(false));
        await connectToPage(page);
        while(page.url().includes("login")){
            console.log("waiting for login...");
            await new Promise(resolve => setTimeout(resolve, 3000));
            if(browser.isConnected() == false){
                throw new Error("Browser disconnected");
            }
        }
        await browser.close(); //After login close browser to relaunch as headless.
        ({browser, page} = await launchBrowser(true));
        await connectToPage(page);
        console.log("logged in");
        return await waitForLogin(page,browser);
    }
    else{
        console.log("logged in");
        return {browser, page};
    }
}

async function getHeaderText(page) {
    return await page.evaluate (() => {
        let courseHeader = document.getElementsByClassName("Breadcrumbstyles__BreadcrumbCurrent-sc-aqreso-1 bgVGYq");
        if(!courseHeader[0]){
            console.log("Course header not found")
            return "";
        }
        return courseHeader[0].innerText;
    })
}

async function checkTophatQuestions(page) { 
    if(!page){
        console.log("Page is undefined")
        return -1;
    }


   return await page.evaluate (() => {
        let unansweredQuestions = document.querySelector('span[class*="UnansweredQuestionCountstyles__UnansweredCountBadge"]')

        if(!unansweredQuestions){
            console.log("Unanswered Questions element not found");
            return -1;
        }
        let count = parseInt(unansweredQuestions.innerText);
        if (isNaN(count)) {
            console.log("Question count not found");
            return -1;
        }
        return count;
        //
    })
}

async function tophatEngine() {
    if(!TOPHAT_URL){
        throw new Error("TOPHAT_URL is not defined");
    }
    else if(TOPHAT_URL.includes("app.tophat.com/e/")){
        console.log("Starting TopHat Notifier for URL: " + TOPHAT_URL);
    } else {
        throw new Error("Invalid TopHat URL");
    }
    if(TOPHAT_URL.endsWith("assigned-for-grades") == false){
        console.log("Incorrect TopHat page. Attemping to fix URL...")
        TOPHAT_URL =  TOPHAT_URL.replace(/[^/]+$/,'assigned-for-grades');
        console.log("New TopHat URL: " + TOPHAT_URL);
    }

    
    let {browser, page} = await launchBrowser();
    await connectToPage(page);
    ({browser, page} = await waitForLogin(page,browser));
    let previousQCount = await checkTophatQuestions(page);
    console.log("previousQcount: " + previousQCount);
    
    setInterval( async () =>
    {
        let courseHeader = await getHeaderText(page);
        console.log(courseHeader);
        let currentQCount = await checkTophatQuestions(page);
        console.log("currentQcount: " + currentQCount);
        if (currentQCount > previousQCount) {
            notifier.notify({
                title: "Tophat ENGINE",
                message: "NEW TOPHAT POSTED"
            })
            previousQCount = currentQCount;
    }
     }, POLL_INTERVAL);
    
}

tophatEngine().catch((error) => {
    console.error("Error in TopHat Engine: ", error);
});