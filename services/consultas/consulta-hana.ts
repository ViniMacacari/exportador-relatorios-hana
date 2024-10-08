import HanaDatabase from "../../database/hana-database"

class ConsultaHana {
    static async buscarTabela(tabela: string): Promise<any> {
        const db = new HanaDatabase()
        await db.connect()
        const result = await db.execQuery(`SELECT * FROM ${tabela}`)
        db.disconnect()
        return result
    }
}

export default ConsultaHana