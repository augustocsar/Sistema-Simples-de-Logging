const fs = require('fs');
const path = require('path');

const caminhoDoArquivo = path.join(__dirname, 'log.txt');

// O stream é criado uma vez quando o módulo é carregado.
const streamEscrita = fs.createWriteStream(caminhoDoArquivo, { flags: 'a', encoding: 'utf-8' });

function registrarLog(mensagem, nivel = 'INFO') {
  // Validação simples do nível (opcional, mas bom)
  const niveisPermitidos = ['INFO', 'WARN', 'ERROR'];
  const nivelFormatado = niveisPermitidos.includes(nivel.toUpperCase()) ? nivel.toUpperCase() : 'INFO';

  const dataHora = new Date().toISOString();
  // Adiciona o nível ao log formatado
  const logFormatado = `[${dataHora}] [${nivelFormatado}] ${mensagem}\n`;

  // Escreve no stream
  streamEscrita.write(logFormatado, (err) => {
    if (err) {
      console.error('Erro ao escrever no stream de log:', err);
    }
  });
}


//Apaga todo o conteúdo do arquivo de log.
function limparLogs() {
  try {
    console.log(`Limpando o arquivo de log: ${caminhoDoArquivo}`);
    // Fecha o stream atual para liberar o arquivo
    streamEscrita.end(() => {
      // Recria o arquivo vazio (sobrescreve)
      // Usamos writeFileSync aqui pela simplicidade de garantir
      // que esteja vazio antes de potencialmente reabrir o stream
      // ou antes que novos logs sejam escritos.
      fs.writeFileSync(caminhoDoArquivo, '', { encoding: 'utf-8' });
      console.log('Arquivo de log limpo.');
    });


  } catch (err) {
    console.error('Erro ao limpar o arquivo de log:', err);
    // Se deu erro limpando, tenta reabrir o stream no modo append
    // para não quebrar a escrita futura, caso o stream tenha sido fechado.
    if (streamEscrita.destroyed) {
       // streamEscrita = fs.createWriteStream(caminhoDoArquivo, { flags: 'a', encoding: 'utf-8' });
       console.log("Tentativa de recriar stream de escrita após erro na limpeza (pode não ser necessário).");
    }
  }
}

// Exporta um objeto contendo as duas funções
module.exports = {
  registrarLog,
  limparLogs
};