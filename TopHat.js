import puppeteer from "puppeteer";
import notifier from "node-notifier";





                
async function launchBrowser(headless) {

    const browser = await puppeteer.launch({
        headless: headless,
        userDataDir: "./tophat-login"
     });
    const page = await browser.newPage();
    console.log("Browser Launched");
    return { browser, page };
}


async function connectToPage(page,url) {
    await page.goto(url, {waitUntil: 'networkidle2'});
    return page;
}

async function checkTophatQuestions(page) { 
    if(!page){
        console.log("Page is undefined")
        return -1;
    }
   return await page.evaluate (() => {
        let question = document.getElementsByClassName("Pillstyles__PillStyled-sc-1insw4v-0 fCyCyw UnansweredQuestionCountstyles__UnansweredCountBadge-sc-uipna7-1 fhWXuf")
        
        if(!question[0]){
            console.log("Question not found")
            return 0;
        }
        console.log(question[0].innerText);

        return parseInt(question[0].innerText);
       
    })
}

async function getHeaderText(page) {
    return await page.evaluate (() => {
        let header = document.getElementsByClassName("Breadcrumbstyles__BreadcrumbCurrent-sc-aqreso-1 bgVGYq");
        if(!header[0]){
            console.log("Header not found")
            return "";
        }
        return header[0].innerText;
    })
}

async function tophatEngine(url,interval,headless) {
    const {browser, page} = await launchBrowser(headless);
    await connectToPage(page, url);
    let previousQCount = await checkTophatQuestions(page);
    console.log("previousQcount: " + previousQCount);
    setInterval( async () =>
    {
        let header = await getHeaderText(page);
        console.log(header);
        let currentQCount = await checkTophatQuestions(page);
        console.log("currentQcount: " + currentQCount);
        if (currentQCount > previousQCount) {
            notifier.notify({
                title: "Tophat ENGINE",
                message: "NEW TOPHAT POSTED"
            })
            previousQCount = currentQCount;
    }
     }, interval)
    
}


    // CHANGE THESE VALUES FOR UR TOPHAT URL AND WHATEVER INTERVAL U WANT. INTERVAL IS IN MS. CHANGE BOOL TO TRUE AFTER YOU LOGGED IN FIRST TIME
    console.log("Starting TopHat Engine...");
    let url = ""
    let interval = 2000
    let loggedIn = false; //SET TO TRUE ONCE YOU LOGGED IN
    tophatEngine(url, interval, loggedIn).catch((error) => {
        console.error("Error in TopHat Engine: ", error);
    });
   

// DEPENDS ON node-notifier PACKAGE AND PUPPETEER PACKAGE
// TO INSTALL PACKAGES, RUN THE FOLLOWING COMMANDS IN YOUR TERMINAL:
// npm install node-notifier
// npm install puppeteer
