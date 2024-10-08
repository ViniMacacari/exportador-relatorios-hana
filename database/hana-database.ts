import dotenv from 'dotenv'
import hanaClient from '@sap/hana-client'
import { MultiBar, Presets } from 'cli-progress'

dotenv.config()

interface ConnectionParams {
    serverNode: string
    uid: string
    pwd: string
    currentSchema: string
}

class HanaDatabase {
    private connection: hanaClient.Connection | null = null

    constructor() { }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection = hanaClient.createConnection()

            const connParams: ConnectionParams = {
                serverNode: process.env.HANA_SERVER || '',
                uid: process.env.HANA_USER || '',
                pwd: process.env.HANA_PASSWORD || '',
                currentSchema: process.env.HANA_SCHEMA || ''
            }

            this.connection.connect(connParams, (err: Error | null) => {
                if (err) {
                    return reject(`Erro de conexão: ${err.message}`)
                }

                resolve()
            })
        })
    }

    disconnect(): void {
        if (this.connection) {
            this.connection.disconnect()
            console.log('Conexão encerrada.')
        }
    }

    execQuery<T extends object = any>(query: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject('Conexão não está aberta.')
            }

            const progressBar = new MultiBar({ ...Presets.shades_classic, format: 'Consultando dados | {bar} | {percentage}% | {value}/{total}' })
            const progress = progressBar.create(100, 0)

            let currentProgress = 0

            const interval = setInterval(() => {
                currentProgress += 1
                progress.increment(1)

                if (currentProgress >= 99) {
                    clearInterval(interval)
                    progressBar.stop()
                }
            }, 2)

            this.connection.exec(query, params, (err: Error | null, result: T[]) => {
                clearInterval(interval)
                progress.update(100)
                progressBar.stop()
                if (err) {
                    console.error(query, params, 'erro: ', err)
                    return reject(`Erro de execução: ${err}`)
                }

                const resultado = result.map(row => {
                    Object.keys(row).forEach(key => {
                        if (typeof row[key] === 'string') {
                            const num = Number(row[key])
                            if (!isNaN(num)) {
                                if (Number.isInteger(num)) {
                                    row[key] = num
                                } else {
                                    row[key] = num
                                }
                            }
                        }
                    })
                    return row
                })

                resolve(resultado)
            })
        })
    }
}

export default HanaDatabase