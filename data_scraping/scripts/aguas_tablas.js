const puppeteer = require('puppeteer')
const FileSystem = require('fs')

const dataFolder = 'data'

function escribirCSV(filename, data) {
    let csv = data.map(e => e.join(";")).join("\n")
    FileSystem.writeFileSync(filename, csv)
}

function sleep(ms) {    
    return new Promise(resolve => setTimeout(resolve, ms))
}

function obtenerCortes() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless: 'new'})
            const page = await browser.newPage()

            await page.goto('https://www.aguasaraucania.cl/p_1-8_datos-cortes')

            let script = await page.evaluate(() => {
                let data = [
                    ['Comuna', 'Sector afectado', 'Puntos de reparto', 'Inicio / Hora', 'Término / Hora', 'Motivo', 'Estado']
                ]
                let cortes = document.querySelectorAll('.cortes')

                for (let i = 0; i < cortes.length; i++) {
                    let row = []
                    row.push(cortes[i]
                        .querySelector('[data-content="Comuna"]')
                        .textContent
                    )
                    row.push(cortes[i]
                        .querySelector('[data-content="Sector afectado"]')
                        .textContent
                    )
                    row.push(cortes[i]
                        .querySelector('[data-content="Puntos de reparto"]')
                        .textContent
                    )
                    row.push(cortes[i]
                        .querySelector('[data-content="Inicio / Hora"]')
                        .textContent
                    )
                    row.push(cortes[i]
                        .querySelector('[data-content="Término / Hora"]')
                        .textContent
                    )
                    row.push(cortes[i]
                        .querySelector('[data-content="Motivo"]')
                        .textContent
                    )
                    row.push(cortes[i]
                        .querySelector('[data-content="Estado"]')
                        .textContent
                    )
                    data.push(row)
                }

                return data
            })

            browser.close()
            return resolve(script)
        } catch (e) {
            return reject(e)
        }
    }).catch((err) => console.error(err))
}

function obtenerOficinas() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless: 'new'})
            const page = await browser.newPage()

            await page.goto('https://www.aguasaraucania.cl/p_1-9_datos-oficinas')

            let script = await page.evaluate(() => {
                let data = [
                    ['Comuna', 'Dirección', 'Tipo de sucursal', 'Horario']
                ]
                let oficinas = document.querySelectorAll('.oficinas')

                for (let i = 0; i < oficinas.length; i++) {
                    let row = []
                    row.push(oficinas[i]
                        .querySelector('[data-content="Comuna"]')
                        .textContent
                    )
                    row.push(oficinas[i]
                        .querySelector('[data-content="Dirección"]')
                        .querySelector('p')
                        .textContent
                    )
                    row.push(oficinas[i]
                        .querySelector('[data-content="Tipo de sucursal"]')
                        .textContent
                    )
                    row.push(oficinas[i]
                        .querySelector('[data-content="Horario"]')
                        .textContent
                        .replace(/\r?\n|\r/g, " ")
                    )
                    if (row.length != 0) {
                        data.push(row)
                    }
                }

                return data
            })

            browser.close()
            return resolve(script)
        } catch (e) {
            return reject(e)
        }
    }).catch((err) => console.error(err))
}

function run() {
    obtenerCortes().then(data => {
        console.log('escribiendo info a sistema')
        escribirCSV(dataFolder + '/cortes.csv', data)
        console.log('la info fue almacenada')
    })
    obtenerOficinas().then(data => {
        console.log('escribiendo info a sistema')
        escribirCSV(dataFolder + '/oficinas.csv', data)
        console.log('la info fue almacenada')
    })
}

run()