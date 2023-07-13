const puppeteer = require('puppeteer')
const FileSystem = require('fs')

const dataFolder = 'data'

function escribirJSON(filename, data) {
    FileSystem.writeFileSync(filename, JSON.stringify(data))
}

function sleep(ms) {    
    return new Promise(resolve => setTimeout(resolve, ms))
}

function obtenerConsejo () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless: 'new'})
            const page = await browser.newPage()

            await page.goto('https://www.aguasaraucania.cl/p_1-10_datos-consejos')

            let script = await page.evaluate(() => {
                let preguntas = document.querySelectorAll('.ui-accordion-header')
                let respuestas = document.querySelectorAll('.ui-widget-content')
                let consejos = []

                for (let i = 0; i < preguntas.length; i++) {
                    let ps = respuestas[i].querySelectorAll('p')
                    let respuesta = ''
                    for (let p of ps) {
                        if (p !== '') {
                            respuesta += p.textContent
                        }
                    }
                    consejos.push({
                        pregunta: preguntas[i].textContent,
                        respuesta: respuesta
                    })
                }

                return consejos
            })

            browser.close()
            return resolve(script)
        } catch (e) {
            return reject(e)
        }
    }).catch((err) => console.error(err))
}

function obtenerFaq() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless: 'new'})
            const page = await browser.newPage()

            await page.goto('https://www.aguasaraucania.cl/p_1-11_datos-preguntas')

            let script = await page.evaluate(() => {
                let preguntas = document.querySelectorAll('.ui-accordion-header')
                let respuestas = document.querySelectorAll('.ui-widget-content')
                let faq = []

                for (let i = 0; i < preguntas.length; i++) {
                    let ps = respuestas[i].querySelectorAll('p')
                    let respuesta = ''
                    for (let p of ps) {
                        if (p !== '') {
                            respuesta += p.textContent
                        }
                    }
                    faq.push({
                        pregunta: preguntas[i].textContent,
                        respuesta: respuesta
                    })
                }

                return faq
            })

            browser.close()
            return resolve(script)
        } catch (e) {
            return reject(e)
        }
    }).catch((err) => console.error(err))
}

function obtenerConsultasComerciales() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless: 'new'})
            const page = await browser.newPage()

            await page.goto('https://www.aguasaraucania.cl/p_1-236_dudas-comerciales')

            let script = await page.evaluate(() => {
                let preguntas = document.querySelectorAll('.ui-accordion-header')
                let respuestas = document.querySelectorAll('.ui-widget-content')
                let faq = []

                for (let i = 0; i < preguntas.length; i++) {
                    let ps = respuestas[i].querySelectorAll('p')
                    let respuesta = ''
                    for (let p of ps) {
                        if (p !== '') {
                            respuesta += p.textContent
                        }
                    }
                    faq.push({
                        pregunta: preguntas[i].textContent,
                        respuesta: respuesta
                    })
                }

                return faq
            })

            browser.close()
            return resolve(script)
        } catch (e) {
            return reject(e)
        }
    }).catch((err) => console.error(err))
}


function run() {
    obtenerConsejo().then(info => {
        console.log('escribiendo info a sistema')
        escribirJSON(dataFolder + '/consejos.json', info)
        console.log('las urls fueron almacenadas')
    })
    obtenerFaq().then(info => {
        console.log('escribiendo info a sistema')
        escribirJSON(dataFolder + '/faq.json', info)
        console.log('las urls fueron almacenadas')
    })
    obtenerConsultasComerciales().then(info => {
        console.log('escribiendo info a sistema')
        escribirJSON(dataFolder + '/consultas_comerciales.json', info)
        console.log('las urls fueron almacenadas')
    })
}

run()