import puppeteer from "puppeteer";
import notifier from "node-notifier";


let url = ""

                
async function launchBrowser(headless) {
    const browser = await puppeteer.launch({
        headless: headless,
        userDataDir: "./tophat-login"
     });
    console.log("Browser Launched");
    const page = await browser.pages().then(pages => pages[0]);
    return { browser, page };
}


async function connectToPage(page,url) {
    await page.goto(url, {waitUntil: 'networkidle2'});
    return page;
}

async function checkConnected(page,browser,url) {
    if(page.url().includes("login")){
        console.log("not logged in");

        let pages = await browser.pages();
        for(page in pages){
            await pages[page].close();
        }
        await browser.close();

        ({browser, page} = await launchBrowser(false));
        await connectToPage(page,url);
        while(page.url().includes("login")){
            console.log("waiting for login...");
            await new Promise(resolve => setTimeout(resolve, 3000));
            if(browser.isConnected() == false){
                throw new Error("Browser disconnected");
            }
        }
        await browser.close();
        ({browser, page} = await launchBrowser(true));
        await connectToPage(page,url);
        console.log("logged in");
        return await checkConnected(page,browser,url);
    }
    else{
        console.log("logged in");
        return {browser, page};
    }
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
            return 0;
        }
        let count = parseInt(unansweredQuestions.innerText);
        if (isNaN(count)) {
            console.log("Question count not found");
            return 0;
        }
        return count;
        //
    })
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

async function tophatEngine(url,interval,headless) {
    let {browser, page} = await launchBrowser(headless);
    await connectToPage(page, url);
    ({browser, page} = await checkConnected(page,browser,url));
    let previousQCount = await checkTophatQuestions(page);
    console.log("previousQcount: " + previousQCount);
    setInterval( async () =>
    {
        await page.reload({waitUntil: 'networkidle2'});
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
     }, interval)
    
}


    // CHANGE THESE VALUES FOR UR TOPHAT URL AND WHATEVER INTERVAL U WANT. INTERVAL IS IN MS. 
    console.log("Starting TopHat Engine...");
     url = ""
    let interval = 30000
    let loggedIn = true; 
    tophatEngine(url, interval, loggedIn).catch((error) => {
        console.error("Error in TopHat Engine: ", error);
    });
    /*
   process.on('exit', async() => {
    await browser.close()
   }
)
*/
// DEPENDS ON node-notifier PACKAGE AND PUPPETEER PACKAGE
// TO INSTALL PACKAGES, RUN THE FOLLOWING COMMANDS IN YOUR TERMINAL:
// npm install node-notifier
// npm install puppeteer
