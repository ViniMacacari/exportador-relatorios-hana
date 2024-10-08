import fs from 'fs'
import path from 'path'
import ExcelJS from 'exceljs'
import { MultiBar, SingleBar, Presets } from 'cli-progress'

class ExportarExcel {
    static async exportarExcel(dados: any[], nomeArquivo: string): Promise<void> {
        console.log('Iniciando a conversão para xlsx...')

        const excel = new ExcelJS.Workbook()
        const planilha = excel.addWorksheet('Resultado')

        const cabecalho = Object.keys(dados[0])
        const linhaCabecalho = planilha.addRow(cabecalho)

        linhaCabecalho.eachCell((celula) => {
            celula.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
            }
            celula.font = { bold: true }
            celula.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            }
        })

        planilha.autoFilter = `A1:${String.fromCharCode(65 + cabecalho.length - 1)}1`

        const progressBarDados = new SingleBar({
            ...Presets.shades_classic,
            format: 'Exportando dados | {bar} | {percentage}% | {value}/{total} linhas',
            hideCursor: true
        })

        progressBarDados.start(dados.length, 0)

        const chunkSize = 1000
        for (let i = 0; i < dados.length; i += chunkSize) {
            const chunk = dados.slice(i, i + chunkSize)
            for (const dado of chunk) {
                planilha.addRow(Object.values(dado))
                progressBarDados.increment()
            }
        }

        progressBarDados.stop()

        console.log('Planilha preparada!')

        const progressBarFormatacao = new SingleBar({
            ...Presets.shades_classic,
            format: 'Formatando planilha | {bar} | {percentage}% | {value}/{total} linhas',
            hideCursor: true
        })

        progressBarFormatacao.start(dados.length, 0)

        for (let i = 1; i <= dados.length; i++) {
            const linha = planilha.getRow(i + 1)
            linha.eachCell((celula) => {
                if (typeof celula.value === 'number') {
                    celula.numFmt = '#,##0.00'
                }

                celula.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                }
                celula.alignment = { horizontal: 'left', vertical: 'middle' }
            })
            progressBarFormatacao.increment()
        }

        progressBarFormatacao.stop()

        console.log('Formatação da planilha concluída!')

        planilha.columns.forEach(col => {
            if (!col.values || col.values.length === 0) {
                col.width = 10
                return
            }

            const maxLength = col.values
                .filter(val => val !== null && val !== undefined)
                .reduce((max: number, val: any) => {
                    const length = String(val).length
                    return Math.max(max, length)
                }, 0)

            col.width = maxLength > 0 ? maxLength + 2 : 10
        })

        const caminho = path.resolve('./out')

        if (!fs.existsSync(caminho)) {
            fs.mkdirSync(caminho)
        }

        nomeArquivo = nomeArquivo.replace(/"/g, '').trim() + '.xlsx'
        const caminhoFinal = path.join(caminho, nomeArquivo)

        console.log('Salvando o arquivo Excel isso pode levar um tempo...')

        const progressBarSalvar = new SingleBar({
            ...Presets.shades_classic,
            format: 'Salvando arquivo | {bar} | {percentage}% completo',
            hideCursor: true
        })

        progressBarSalvar.start(100, 0)

        let currentProgress = 0
        const incrementProgress = () => {
            if (currentProgress < 100) {
                currentProgress++
                progressBarSalvar.update(currentProgress)
            }
            if (currentProgress < 99) {
                setTimeout(incrementProgress, 50)
            } else {
                progressBarSalvar.stop()
            }
        }

        incrementProgress()

        try {
            await excel.xlsx.writeFile(caminhoFinal)
        } catch (err) {
            console.error(err)
            throw new Error('Erro ao salvar arquivo.')
        }

        progressBarSalvar.update(100)
        progressBarSalvar.stop()

        console.log(`Arquivo salvo em: ${caminhoFinal}`)
    }
}

export default ExportarExcel