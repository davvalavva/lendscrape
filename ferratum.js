const TEST = true
const puppeteer = require('puppeteer')
const {TimeoutError} = require('puppeteer/Errors')
const DUMMY_URLS = [
    'http://bravio.se',
    'http://bravio.se/kostnadsfria-l%C3%A5n/',
    'http://bravio.se/vanliga-fr%C3%A5gor/'
]
const FERRATUM_URLS = [
    'https://www.ferratum.se/snabbl%C3%A5n/',
    'https://www.ferratum.se/l%C3%A5na-1000-kr-direkt',
    'https://www.ferratum.se/l%C3%A5na-2000-direkt',
    'https://www.ferratum.se/l%C3%A5na-3000-kr-direkt',
    'https://www.ferratum.se/l%C3%A5na-4000-kr',
    'https://www.ferratum.se/l%C3%A5na-5000-kr',
    'https://www.ferratum.se/l%C3%A5na-10000-direkt',
    'https://www.ferratum.se/l%C3%A5na-20-000-kr'
]
const SRC_URLS = TEST ? DUMMY_URLS : FERRATUM_URLS

const scrape = async () => {
    const VIEWPORT_WIDTH = 1024
    const VIEWPORT_HEIGHT = 768
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const result = {}

    await page.setViewport({width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT})

    let data_found, i = 0
    while (true) {
        try {
            await page.goto(SRC_URLS[i])
            await page.waitForSelector('.foo', {timeout: 5000})
            data_found = true
            break
        } catch (error) {
            i++
            if (error instanceof TimeoutError) {
                if (i >= SRC_URLS.length) {
                    data_found = false
                    break
                }
            }
        }
    }
    if (data_found) {
        result.success = true
        // TODO: Parse and extract data

    } else {
        result.success = false
        // TODO: Handling the situation where no url with data is found
    }
    
    browser.close()
    return result
};

scrape().then((value) => {
    console.log(value)
    // TODO: 1) Clean and transform data
    // TODO: 2) Serialize and store data
})