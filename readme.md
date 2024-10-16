# Exportador de Relatórios SAP HANA

Este projeto permite consultar dados diretamente de um banco de dados (HANA) e exportá-los para um arquivo Excel de forma rápida e eficiente.

É uma ferramenta perfeita para validação de relatórios, facilitando o acesso e a análise de informações.

## Funcionalidades

- **Consulta Dinâmica**: Busque por nome de tabelas ou views no banco de dados.
- **Exportação Imediata**: Os resultados são convertidos em um arquivo Excel imediatamente tratando a tipagem dos dados automaticamente.
- **Formatação Personalizada**: O Excel gerado mantém a formatação adequada para facilitar a leitura.

## Tecnologia Utilizada

- TypeScript

## Como Usar

1. **Clone o repositório**:
   ```bash
   git clone [https://github.com/ViniMacacari/exportador-relatorios-hana.git]
2. **Crie um arquivo .env**:
   ```powershell
   cd [exportador-relatorios-hana]
   echo. > .env
3. **Adicione as variáveis de ambiente**:
    ```node .env
    HANA_SERVER=seu_host:sua_porta
    HANA_USER=seu_usuario
    HANA_PASSWORD=sua_senha
    HANA_SCHEMA=seu_schema
4. **Execute o arquivo para exportar os dados**:
   ```powershell
    exportar-hana.bat
5. **Verifique o resultado em**:
   ```powershell
    /out/

### Criador do Projeto

- Vinícius Macacari
- [LinkedIn](https://www.linkedin.com/in/vinicius-macacari-de-almeida-bb7855243/)
- macacarivinicius@gmail.com