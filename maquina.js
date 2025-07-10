const readline = require("readline");

class MaquinaDeTuring {
  constructor(fita, tabelaDeTransicoes, estadoInicial, simboloBranco = "_") {
    this.fita = fita.split("");
    this.cabecote = 0;
    this.estado = estadoInicial;
    this.tabelaDeTransicoes = tabelaDeTransicoes;
    this.simboloBranco = simboloBranco;
  }

  passo() {
    const simboloAtual = this.fita[this.cabecote] || this.simboloBranco;

    const acao = this.tabelaDeTransicoes[this.estado]?.[simboloAtual];

    console.log(`\n> Estado atual: ${this.estado}`);
    console.log(`> Símbolo lido: "${simboloAtual}"`);
    console.log(`> Posição do cabeçote: ${this.cabecote}`);
    console.log(`\n${"─".repeat(50)}`);
    console.log(`> FITA ATUAL: [ ${this.fita.join(" | ")} ]`);
    console.log(`${"─".repeat(50)}`);

    if (!acao) {
      console.log("\n[!] Nenhuma transição encontrada. Máquina parou.");
      return false;
    }

    const [novoSimbolo, direcao, novoEstado] = acao;

    console.log(`* Escrevendo "${novoSimbolo}" na fita`);
    console.log(`* Movendo para "${direcao === "D" ? "direita" : "esquerda"}"`);
    console.log(`* Indo para o estado "${novoEstado}"`);

    this.fita[this.cabecote] = novoSimbolo;

    if (direcao === "D") this.cabecote++;
    else if (direcao === "E") this.cabecote--;

    this.estado = novoEstado;

    return true;
  }

  async executar(maximoDePassos = 100) {
    let passos = 0;

    console.log("\nIniciando execução da Máquina de Turing");
    console.log("Pressione Enter para executar cada passo...\n");

    while (passos < maximoDePassos) {
      const continuarExecucao = this.passo();

      if (!continuarExecucao) {
        break;
      }

      passos++;

      await this.esperarEnter();
    }

    console.log("\nExecução finalizada.");
    console.log("\n" + "=".repeat(50));
    console.log("RESULTADO FINAL:");
    console.log("=".repeat(50));
    console.log(`FITA FINAL: [ ${this.fita.join(" | ")} ]`);
    console.log("=".repeat(50));
    console.log(`Total de passos executados: ${passos}`);
  }

  esperarEnter() {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question("\nPressione Enter para continuar...", () => {
        rl.close();
        resolve();
      });
    });
  }
}

const tabelaDeTransicoes = {
  q0: {
    1: ["0", "D", "q0"],
    0: ["0", "D", "q0"],
    _: ["_", "D", "PARAR"],
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("=".repeat(60));
console.log("                    MÁQUINA DE TURING");
console.log("=".repeat(60));
console.log("");

rl.question("Digite a fita inicial (ex: 10101): ", async (entradaFita) => {
  rl.question("Digite o número máximo de passos: ", async (entradaPassos) => {
    const passos = parseInt(entradaPassos, 10);

    const maquina = new MaquinaDeTuring(entradaFita, tabelaDeTransicoes, "q0");

    rl.close();

    await maquina.executar(passos);

    console.log("\n[EXIT] Programa finalizado!");
    process.exit(0);
  });
});
