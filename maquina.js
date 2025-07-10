const readline = require("readline");

// =============================================
// MÁQUINA DE TURING - Implementação em JavaScript
// =============================================
// Uma Máquina de Turing é um modelo matemático de computação que consiste em:
// 1. Uma fita infinita dividida em células
// 2. Um cabeçote que lê/escreve símbolos na fita
// 3. Um conjunto de estados que controlam o comportamento
// 4. Uma tabela de transições que define as ações

// Classe da Máquina de Turing
class MaquinaDeTuring {
  // Construtor: inicializa a máquina com os parâmetros necessários
  constructor(fita, tabelaDeTransicoes, estadoInicial, simboloBranco = "_") {
    this.fita = fita.split(""); // Converte a string em array de caracteres
    this.cabecote = 0; // Posição atual do cabeçote (começa na posição 0)
    this.estado = estadoInicial; // Estado atual da máquina (começa no estado inicial)
    this.tabelaDeTransicoes = tabelaDeTransicoes; // Regras que definem o comportamento
    this.simboloBranco = simboloBranco; // Símbolo que representa uma célula vazia
  }

  // Executa um único passo da máquina de Turing
  passo() {
    // Lê o símbolo atual da fita (ou símbolo branco se estiver fora dos limites)
    const simboloAtual = this.fita[this.cabecote] || this.simboloBranco;

    // Busca a ação correspondente na tabela de transições
    // Formato: tabelaDeTransicoes[estado_atual][simbolo_lido] = [novo_simbolo, direcao, novo_estado]
    const acao = this.tabelaDeTransicoes[this.estado]?.[simboloAtual];

    // Exibe informações do estado atual para debug/visualização
    console.log(`\n📍 Estado atual: ${this.estado}`);
    console.log(`📄 Símbolo lido: "${simboloAtual}"`);
    console.log(`📍 Posição do cabeçote: ${this.cabecote}`);
    console.log(`🧠 Fita atual: ${this.fita.join("")}`);

    // Se não há transição definida para este estado+símbolo, a máquina para
    if (!acao) {
      console.log("\n🚫 Nenhuma transição encontrada. Máquina parou.");
      return false; // Indica que a execução deve parar
    }

    // Desestrutura a ação em seus componentes
    const [novoSimbolo, direcao, novoEstado] = acao;

    // Exibe as ações que serão executadas
    console.log(`✍️ Escrevendo "${novoSimbolo}" na fita`);
    console.log(
      `➡️ Movendo para "${direcao === "D" ? "direita" : "esquerda"}"`
    );
    console.log(`🔁 Indo para o estado "${novoEstado}"`);

    // EXECUTA AS TRÊS AÇÕES FUNDAMENTAIS:

    // 1. Escreve o novo símbolo na posição atual da fita
    this.fita[this.cabecote] = novoSimbolo;

    // 2. Move o cabeçote conforme a direção especificada
    if (direcao === "D") this.cabecote++; // Direita: incrementa posição
    else if (direcao === "E") this.cabecote--; // Esquerda: decrementa posição

    // 3. Atualiza o estado da máquina
    this.estado = novoEstado;

    return true; // Indica que a execução pode continuar
  }

  // Executa a máquina passo a passo até parar ou atingir o limite
  async executar(maximoDePassos = 100) {
    let passos = 0; // Contador de passos executados

    console.log("\n🚀 Iniciando execução da Máquina de Turing");
    console.log("💡 Pressione Enter para executar cada passo...\n");

    // Loop principal de execução
    while (passos < maximoDePassos) {
      // Executa um passo da máquina
      const continuarExecucao = this.passo();

      // Se a máquina parou (não há transição), sai do loop
      if (!continuarExecucao) {
        break;
      }

      passos++; // Incrementa contador de passos

      // Pausa para o usuário ver o resultado e continuar manualmente
      await this.esperarEnter();
    }

    // Exibe resultados finais
    console.log("\n✅ Execução finalizada.");
    console.log("📄 Fita final:", this.fita.join(""));
    console.log(`📊 Total de passos executados: ${passos}`);
  }

  // Função auxiliar que pausa e espera o usuário pressionar Enter
  esperarEnter() {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question("\n⏳ Pressione Enter para continuar...", () => {
        rl.close();
        resolve();
      });
    });
  }
}

// =============================================
// TABELA DE TRANSIÇÕES - Define o comportamento da máquina
// =============================================
// Formato: { estado: { simbolo_lido: [novo_simbolo, direcao, novo_estado] } }
//
// Esta máquina específica faz uma operação simples:
// - Converte todos os 1s em 0s
// - Mantém os 0s como estão
// - Para quando encontra uma célula vazia (_)

const tabelaDeTransicoes = {
  q0: {
    // Estado inicial e único estado de processamento
    1: ["0", "D", "q0"], // Se lê 1: escreve 0, move direita, continua em q0
    0: ["0", "D", "q0"], // Se lê 0: escreve 0, move direita, continua em q0
    _: ["_", "D", "PARAR"], // Se lê vazio: escreve vazio, move direita, vai para PARAR
  },
};

// ============================
// INTERFACE DO USUÁRIO - Coleta entrada e executa a máquina
// ============================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Solicita a fita inicial do usuário
rl.question("Digite a fita inicial (ex: 10101): ", async (entradaFita) => {
  // Solicita o número máximo de passos
  rl.question("Digite o número máximo de passos: ", async (entradaPassos) => {
    const passos = parseInt(entradaPassos, 10); // Converte string para número

    // Cria uma nova instância da máquina com os parâmetros fornecidos
    const maquina = new MaquinaDeTuring(entradaFita, tabelaDeTransicoes, "q0");

    rl.close(); // Fecha o readline inicial

    // Executa a máquina de Turing
    await maquina.executar(passos);

    console.log("\n👋 Programa finalizado!");
    process.exit(0); // Encerra o programa
  });
});
