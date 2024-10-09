import readline from "readline"
import ConsultaHana from "./services/consultas/consulta-hana.js"
import ExportarExcel from "./services/excel/excel.js"

console.log("Este script requer no mínimo 8gb de memória RAM, 16gb são recomendados.")

if (process.execArgv.indexOf('--max-old-space-size=32768') === -1) {
    process.execArgv.push('--max-old-space-size=32768')
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Digite o nome da tabela/view que será exportada: ', (tabela: string) => {
    ConsultaHana.buscarTabela(tabela).then(result => {
        ExportarExcel.exportarExcel(result, `${tabela}`)
        rl.close()
    })
})
