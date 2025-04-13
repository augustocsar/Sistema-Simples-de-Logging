# Sistema Simples de Logging em Node.js

## Descrição

Este projeto implementa um sistema básico de logging em Node.js como parte de um exercício. Ele demonstra:
1.  Como registrar mensagens em um arquivo (`log.txt`) com diferentes níveis de severidade (INFO, WARN, ERROR).
2.  Como ler o conteúdo do arquivo de log utilizando Streams.
3.  Como adicionar um argumento de linha de comando (`--clear`) para limpar o arquivo de log antes de registrar novas mensagens.
4.  O uso básico dos módulos nativos `fs` (File System) e `path` do Node.js.
5.  A criação e utilização de módulos customizados (`logger.js`).

## Funcionalidades

*   **Registro de Logs com Nível:** A função `registrarLog` aceita uma mensagem e um nível (`INFO`, `WARN`, `ERROR`), formatando e adicionando a entrada ao arquivo `log.txt` com um timestamp.
*   **Append de Logs:** Novos logs são sempre adicionados ao final do arquivo `log.txt`, preservando o histórico anterior (a menos que a opção `--clear` seja usada).
*   **Leitura com Stream:** A função `lerLogsComStream` lê o arquivo `log.txt` de forma eficiente usando `fs.createReadStream` e exibe seu conteúdo no console.
*   **Limpeza de Logs:** Ao executar o script com o argumento `--clear` (`node app.js --clear`), o conteúdo do arquivo `log.txt` é apagado antes que qualquer nova mensagem seja registrada na sessão atual.

## Como Funciona

O sistema é dividido em dois arquivos principais:

1.  **`logger.js`**:
    *   Responsável por toda a interação direta com o arquivo `log.txt`.
    *   Utiliza `path.join(__dirname, 'log.txt')` para garantir que o caminho para o arquivo de log seja correto, independentemente de onde o script é executado.
    *   Cria um `fs.createWriteStream` com a flag `flags: 'a'` (append) para adicionar conteúdo ao final do arquivo sem sobrescrevê-lo a cada escrita.
    *   **`registrarLog(mensagem, nivel)`**:
        *   Recebe a mensagem e o nível (padrão 'INFO').
        *   Formata a string de log incluindo a data/hora atual (`toISOString`), o nível e a mensagem.
        *   Escreve a string formatada no `streamEscrita`.
    *   **`limparLogs()`**:
        *   É chamada quando o argumento `--clear` é detectado.
        *   Primeiro, tenta fechar o `streamEscrita` existente para liberar o arquivo.
        *   Usa `fs.writeFileSync(caminhoDoArquivo, '')` para sobrescrever o arquivo com conteúdo vazio, efetivamente limpando-o. O `writeFileSync` é usado aqui pela simplicidade de garantir que a operação seja concluída antes de prosseguir.
    *   Exporta as funções `registrarLog` e `limparLogs` usando `module.exports`.

2.  **`app.js`**:
    *   É o script principal que orquestra as operações.
    *   Importa as funções `registrarLog` e `limparLogs` do módulo `./logger` usando desestruturação: `const { registrarLog, limparLogs } = require('./logger');`.
    *   **Verificação de Argumentos**:
        *   Acessa os argumentos da linha de comando usando `process.argv`.
        *   Usa `process.argv.slice(2)` para obter apenas os argumentos passados pelo usuário (ignorando o executável do Node e o nome do script).
        *   Verifica se o array de argumentos (`args`) inclui a string `"--clear"`.
    *   **Execução Condicional**:
        *   Se `"--clear"` estiver presente, chama `await limparLogs()` **antes** de qualquer outra coisa. O `await` garante que a limpeza termine antes de continuar.
    *   **`simularEventos()`**:
        *   Chama `registrarLog` várias vezes com mensagens diferentes e especificando os níveis `INFO`, `WARN` e `ERROR`, conforme solicitado no exercício.
    *   **`lerLogsComStream()`**:
        *   Chama a função para ler o conteúdo do log (após a simulação de eventos) e exibi-lo no console.
    *   **`main()`**:
        *   Função `async` que organiza a ordem de execução: verificar argumentos, limpar (se necessário), simular eventos, ler logs.
        *   Chama `main()` no final para iniciar a execução e inclui um `.catch()` para capturar erros inesperados.

## Como Usar

### Pré-requisitos

*   Ter o [Node.js](https://nodejs.org/) instalado na sua máquina. (Isso inclui o NPM, embora não estejamos instalando dependências externas neste projeto).

### Instalação

1.  Clone este repositório ou baixe os arquivos `app.js` e `logger.js`.
2.  Coloque ambos os arquivos na mesma pasta (ex: `trabalho_web`).
3.  (Opcional, mas boa prática para projetos Node) Abra o terminal na pasta do projeto e execute `npm init -y` para criar um arquivo `package.json`.

### Execução

Abra o terminal na pasta onde os arquivos estão localizados e execute um dos seguintes comandos:

1.  **Para registrar os eventos e adicionar ao log existente:**
    ```bash
    node app.js
    ```
    *   Isso executará a simulação de eventos, adicionando as novas linhas ao final do `log.txt`. Em seguida, exibirá o conteúdo completo do `log.txt` no console. Execute várias vezes para ver o arquivo crescer.

2.  **Para limpar o log antes de registrar os novos eventos:**
    ```bash
    node app.js --clear
    ```
    *   Isso primeiro apagará todo o conteúdo do `log.txt`. Depois, executará a simulação de eventos, registrando as novas linhas no arquivo agora vazio. Por fim, exibirá o conteúdo (apenas os logs recém-adicionados) no console.

### Arquivo de Log

*   Um arquivo chamado `log.txt` será criado ou atualizado na mesma pasta dos scripts. Ele conterá as mensagens de log formatadas.

## Conceitos Chave do Node.js Utilizados

*   **Módulos Nativos:** `fs` (operações de arquivo), `path` (manipulação de caminhos).
*   **Sistema de Módulos CommonJS:** `require` para importar módulos e `module.exports` para exportar funcionalidades.
*   **Streams:** `fs.createWriteStream` para escrita eficiente (especialmente para arquivos grandes ou escrita contínua) e `fs.createReadStream` para leitura eficiente. Flags como `'a'` (append). Eventos de stream (`data`, `end`, `error`).
*   **`process.argv`:** Array que fornece acesso aos argumentos passados pela linha de comando.
*   **`__dirname`:** Variável global que contém o caminho absoluto do diretório onde o script atual está localizado.
*   **Operações Assíncronas e `async/await`:** Embora a escrita no stream seja assíncrona por natureza, usamos `async/await` na função `main` para controlar a ordem de execução (garantir que `limparLogs` termine antes de `simularEventos`).
*   **Manipulação de Arquivos Síncrona:** `fs.writeFileSync` usado em `limparLogs` para simplicidade ao garantir que o arquivo esteja vazio. `fs.existsSync` e `fs.statSync` usados para verificações antes da leitura.
