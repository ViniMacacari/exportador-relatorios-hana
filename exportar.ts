import readline from "readline"
import ConsultaHana from "./services/consultas/consulta-hana.js"
import ExportarExcel from "./services/excel/excel.js"

console.log("Este script requer de 16gb de memória RAM.")

if (process.execArgv.indexOf('--max-old-space-size=16384') === -1) {
    process.execArgv.push('--max-old-space-size=16384')
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
