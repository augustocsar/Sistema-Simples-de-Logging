const { registrarLog, limparLogs } = require('./logger'); //require para desestruturar as funções importadas
const fs = require('fs');
const path = require('path');

// Função para simular a escrita no log com níveis
async function simularEventos() {
  console.log('Simulando eventos e registrando no log...');

  // Usa a função registrarLog com os níveis
  registrarLog('Usuário fez login', 'INFO');
  registrarLog('Usuário acessou a página de produtos', 'INFO');
  registrarLog('Tentativa de acesso a recurso restrito detectada', 'WARN'); // Exemplo WARN
  registrarLog('Falha ao conectar ao serviço externo X', 'ERROR');   // Exemplo ERROR
  registrarLog('Operação Y completada com sucesso.', 'INFO');
  registrarLog('Parâmetro Z inválido recebido', 'WARN');
  registrarLog('Usuário realizou logout', 'INFO');

  console.log('Eventos registrados.');
  // Adiciona uma pequena pausa para garantir que a escrita assíncrona tenha tempo
  // Isso é mais relevante por causa do stream, para dar chance de 'flush'
  // await new Promise(resolve => setTimeout(resolve, 100));
}

// Função para ler o log com stream (sem alterações necessárias aqui)
function lerLogsComStream() {
  const caminhoDoArquivo = path.join(__dirname, 'log.txt');

  if (!fs.existsSync(caminhoDoArquivo)) {
    console.log(`\nArquivo de log (${caminhoDoArquivo}) não encontrado ou vazio.`);
    return;
  }

  // Verifica se o arquivo está vazio após a limpeza
  const stats = fs.statSync(caminhoDoArquivo);
  if (stats.size === 0) {
     console.log(`\nArquivo de log (${caminhoDoArquivo}) está vazio.`);
     return;
  }


  const stream = fs.createReadStream(caminhoDoArquivo, { encoding: 'utf-8' });

  console.log('\nConteúdo do log (lido com stream):\n');

  stream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  stream.on('end', () => {
    console.log('\n\nLeitura concluída.');
  });

  stream.on('error', (err) => {
    console.error('\nErro ao ler o arquivo:', err);
  });
}

// --- Função Principal para Orquestrar as Chamadas ---
async function main() {
  // Verifica os argumentos da linha de comando
  // process.argv é um array: [node, app.js, arg1, arg2, ...]
  // slice(2) para pegar apenas os argumentos passados pelo usuário.
  const args = process.argv.slice(2);

  // Verifica se '--clear' está presente nos argumentos
  if (args.includes('--clear')) {
    await limparLogs(); // Chama a função para limpar
    console.log("Flag --clear detectada. O log foi limpo antes da simulação.");

    // Adiciona uma pequena pausa para garantir que o arquivo foi escrito/fechado
    // antes de tentar ler ou escrever novamente.
    await new Promise(resolve => setTimeout(resolve, 200)); // espera 200ms
  }

  // Continua com a simulação e leitura
  await simularEventos();
  lerLogsComStream();
}

// --- Inicia a execução ---
main().catch(err => {
  console.error("Erro na execução principal:", err);
});