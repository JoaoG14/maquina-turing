const readline = require("readline");

// Classe da Máquina de Turing
class MaquinaDeTuring {
  constructor(fita, tabelaDeTransicoes, estadoInicial, simboloBranco = "_") {
    this.fita = fita.split("");
    this.cabecote = 0; // posição atual do cabeçote
    this.estado = estadoInicial;
    this.tabelaDeTransicoes = tabelaDeTransicoes;
    this.simboloBranco = simboloBranco;
  }

  passo() {
    const simboloAtual = this.fita[this.cabecote] || this.simboloBranco;
    const acao = this.tabelaDeTransicoes[this.estado]?.[simboloAtual];

    console.log(`\n📍 Estado atual: ${this.estado}`);
    console.log(`📄 Símbolo lido: "${simboloAtual}"`);
    console.log(`📍 Posição do cabeçote: ${this.cabecote}`);
    console.log(`🧠 Fita atual: ${this.fita.join("")}`);

    if (!acao) {
      console.log("\n🚫 Nenhuma transição encontrada. Máquina parou.");
      return false;
    }

    const [novoSimbolo, direcao, novoEstado] = acao;

    console.log(`✍️ Escrevendo "${novoSimbolo}" na fita`);
    console.log(
      `➡️ Movendo para "${direcao === "D" ? "direita" : "esquerda"}"`
    );
    console.log(`🔁 Indo para o estado "${novoEstado}"`);

    // Escreve novo símbolo
    this.fita[this.cabecote] = novoSimbolo;

    // Move o cabeçote
    if (direcao === "D") this.cabecote++;
    else if (direcao === "E") this.cabecote--;

    // Atualiza estado
    this.estado = novoEstado;

    return true;
  }

  async executar(maximoDePassos = 100) {
    let passos = 0;

    console.log("\n🚀 Iniciando execução da Máquina de Turing");
    console.log("💡 Pressione Enter para executar cada passo...\n");

    while (passos < maximoDePassos) {
      // Executa um passo
      const continuarExecucao = this.passo();

      if (!continuarExecucao) {
        break; // Máquina parou
      }

      passos++;

      // Espera o usuário pressionar Enter para continuar
      await this.esperarEnter();
    }

    console.log("\n✅ Execução finalizada.");
    console.log("📄 Fita final:", this.fita.join(""));
    console.log(`📊 Total de passos executados: ${passos}`);
  }

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

// Define a tabela de transições
const tabelaDeTransicoes = {
  q0: {
    1: ["0", "D", "q0"],
    0: ["0", "D", "q0"],
    _: ["_", "D", "PARAR"],
  },
};

// ============================
// Interface de entrada (readline)
// ============================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a fita inicial (ex: 10101): ", async (entradaFita) => {
  rl.question("Digite o número máximo de passos: ", async (entradaPassos) => {
    const passos = parseInt(entradaPassos, 10);
    const maquina = new MaquinaDeTuring(entradaFita, tabelaDeTransicoes, "q0");

    rl.close(); // Fecha o readline inicial

    await maquina.executar(passos);

    console.log("\n👋 Programa finalizado!");
    process.exit(0);
  });
});
