const fs = require('fs');

let data = fs.readFileSync('data/consejos.json')

let preguntas = JSON.parse(data)
let output = ''
for (let pregunta of preguntas) {
    output += `pregunta: ${pregunta['pregunta']}\n`
    output += `respuesta: ${pregunta['respuesta']}\n\n`
}

try {
  fs.writeFileSync('data/consejos.txt', output);
} catch (err) {
  console.error(err);
}


data = fs.readFileSync('data/consultas_comerciales.json')
preguntas = JSON.parse(data)
output = ''
for (let pregunta of preguntas) {
    output += `pregunta: ${pregunta['pregunta']}\n`
    output += `respuesta: ${pregunta['respuesta']}\n\n`
}

try {
  fs.writeFileSync('data/consultas_comerciales.txt', output);
} catch (err) {
  console.error(err);
}


data = fs.readFileSync('data/faq.json')
preguntas = JSON.parse(data)

output = ''

for (let pregunta of preguntas) {
    output += `pregunta: ${pregunta['pregunta']}\n`
    output += `respuesta: ${pregunta['respuesta']}\n\n`
}

try {
  fs.writeFileSync('data/faq.txt', output);
} catch (err) {
  console.error(err);
}
