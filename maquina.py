import asyncio

class MaquinaDeTuring:
    def __init__(self, fita, tabela_de_transicoes, estado_inicial, simbolo_branco="_"):
        self.fita = list(fita)
        self.cabecote = 0
        self.estado = estado_inicial
        self.tabela_de_transicoes = tabela_de_transicoes
        self.simbolo_branco = simbolo_branco

    def passo(self):
        simbolo_atual = self.fita[self.cabecote] if self.cabecote < len(self.fita) else self.simbolo_branco
        
        acao = self.tabela_de_transicoes.get(self.estado, {}).get(simbolo_atual)
        
        print(f"\n> Estado atual: {self.estado}")
        print(f"| Símbolo lido: \"{simbolo_atual}\"")
        print(f"| Posição do cabeçote: {self.cabecote}")
        print(f"|")
        print(f"| ========== FITA ATUAL ==========")
        print(f"| >>> {''.join(self.fita)} <<<")
        print(f"| ================================")
        
        if not acao:
            print("\n[PARAR] Nenhuma transição encontrada. Máquina parou.")
            return False
        
        novo_simbolo, direcao, novo_estado = acao
        
        print(f">> Escrevendo \"{novo_simbolo}\" na fita")
        print(f"-> Movendo para \"{'direita' if direcao == 'D' else 'esquerda'}\"")
        print(f"-> Indo para o estado \"{novo_estado}\"")
        
        if self.cabecote >= len(self.fita):
            self.fita.extend([self.simbolo_branco] * (self.cabecote - len(self.fita) + 1))
        
        self.fita[self.cabecote] = novo_simbolo
        
        if direcao == "D":
            self.cabecote += 1
        elif direcao == "E":
            self.cabecote -= 1
        
        self.estado = novo_estado
        
        return True

    async def executar(self, maximo_de_passos=100):
        passos = 0
        
        print("\n[INICIO] Iniciando execução da Máquina de Turing")
        print("* Pressione Enter para executar cada passo...\n")
        
        while passos < maximo_de_passos:
            continuar_execucao = self.passo()
            
            if not continuar_execucao:
                break
            
            passos += 1
            
            await self.esperar_enter()
        
        print("\n[CONCLUIDO] Execução finalizada.")
        print("===============================")
        print(">>>>>> FITA FINAL <<<<<<")
        print(f">>> {''.join(self.fita)} <<<")
        print("===============================")
        print(f"Total de passos executados: {passos}")

    async def esperar_enter(self):
        input("\n... Pressione Enter para continuar...")

tabela_de_transicoes = {
    "q0": {
        "1": ["0", "D", "q0"],
        "0": ["0", "D", "q0"],
        "_": ["_", "D", "PARAR"]
    }
}

def mostrar_menu():
    print("=" * 25)
    print("=== Máquina de Turing ===")
    print("=" * 25)
    print()

async def main():
    mostrar_menu()
    
    entrada_fita = input("Digite a fita inicial (ex: 10101): ")
    entrada_passos = input("Digite o número máximo de passos: ")
    
    passos = int(entrada_passos)
    
    maquina = MaquinaDeTuring(entrada_fita, tabela_de_transicoes, "q0")
    
    await maquina.executar(passos)
    
    print("\nPrograma finalizado!")

if __name__ == "__main__":
    asyncio.run(main()) 