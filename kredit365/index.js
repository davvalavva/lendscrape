const TEST = false
const extract = require('./extract')
const puppeteer = require('puppeteer')
const {TimeoutError} = require('puppeteer/Errors')
const browserAgents = require('browser-agents') // https://www.npmjs.com/package/browser-agents
const SOURCES = ['https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n']

const scrape = async () => {
    const result
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const frame = page.mainFrame()
    page.setUserAgent(browserAgents.random())
    page.setViewport({ width:1920, height:1080 })

    let i = 0, failure = false, retry = true
    do {
        try {
            await frame.goto(SOURCES[i])
            let extracted = await extract()
    
            browser.close()
    
            // TODO: Clean and transform data

            return result
    
        } catch (error) {
            if (error instanceof TimeoutError) {
                // TODO
                // failure = false|true
                // retry   = false|true
            } else {
                // TODO
                // failure = false|true
                // retry   = false|true
            }
        }
    } while (failure && retry)
    
    if (!failure) {


    } else {
        // TODO: Handle total failure
    }
    
    
};

scrape().then((data) => {
    console.log(data)
    // TODO: Serialize and store data
})