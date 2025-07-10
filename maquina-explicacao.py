import asyncio

class MaquinaDeTuring:
    """
    Esta classe simula uma Máquina de Turing - um computador muito simples que:
    - Tem uma fita com símbolos (como 0, 1, _)
    - Tem um ponteiro que lê e escreve na fita
    - Segue regras para decidir o que fazer
    """
    
    def __init__(self, fita, tabela_de_transicoes, estado_inicial, simbolo_branco="_"):
        """
        Prepara a máquina para funcionar
        
        fita: O texto inicial (ex: "10101")
        tabela_de_transicoes: As regras que a máquina segue
        estado_inicial: O estado em que a máquina começa
        simbolo_branco: O símbolo usado para espaços vazios
        """
        self.fita = list(fita)  # Transforma o texto em lista para poder modificar
        self.cabecote = 0  # Posição onde estamos lendo (começa na posição 0)
        self.estado = estado_inicial  # Estado atual da máquina
        self.tabela_de_transicoes = tabela_de_transicoes  # As regras
        self.simbolo_branco = simbolo_branco  # Símbolo para espaços vazios

    def passo(self):
        """
        Executa uma única operação da máquina
        
        A máquina faz isso em cada passo:
        1. Lê o símbolo na posição atual
        2. Consulta as regras para ver o que fazer
        3. Escreve um novo símbolo
        4. Move o ponteiro para esquerda ou direita
        5. Muda de estado
        
        Retorna True se deve continuar, False se deve parar
        """
        # Lê o símbolo na posição atual
        # Se passou do fim da fita, considera como espaço vazio
        simbolo_atual = self.fita[self.cabecote] if self.cabecote < len(self.fita) else self.simbolo_branco
        
        # Procura nas regras o que fazer com esse símbolo neste estado
        # As regras dizem: [que símbolo escrever, para onde mover, próximo estado]
        acao = self.tabela_de_transicoes.get(self.estado, {}).get(simbolo_atual)
        
        # Mostra o que está acontecendo agora
        print(f"\n> Estado atual: {self.estado}")
        print(f"| Símbolo lido: \"{simbolo_atual}\"")
        print(f"| Posição do cabeçote: {self.cabecote}")
        print(f"|")
        print(f"| ========== FITA ATUAL ==========")
        print(f"| >>> {''.join(self.fita)} <<<")
        print(f"| ================================")
        
        # Se não tem regra para este caso, para a máquina
        if not acao:
            print("\n[PARAR] Nenhuma transição encontrada. Máquina parou.")
            return False
        
        # Pega as instruções da regra
        novo_simbolo, direcao, novo_estado = acao
        
        # Mostra o que vai fazer
        print(f">> Escrevendo \"{novo_simbolo}\" na fita")
        print(f"-> Movendo para \"{'direita' if direcao == 'D' else 'esquerda'}\"")
        print(f"-> Indo para o estado \"{novo_estado}\"")
        
        # Se o ponteiro passou do fim da fita, aumenta a fita
        if self.cabecote >= len(self.fita):
            self.fita.extend([self.simbolo_branco] * (self.cabecote - len(self.fita) + 1))
        
        # Escreve o novo símbolo na posição atual
        self.fita[self.cabecote] = novo_simbolo
        
        # Move o ponteiro
        if direcao == "D":  # D = Direita
            self.cabecote += 1
        elif direcao == "E":  # E = Esquerda
            self.cabecote -= 1
        
        # Muda para o novo estado
        self.estado = novo_estado
        
        # Diz que a máquina deve continuar
        return True

    async def executar(self, maximo_de_passos=100):
        """
        Roda a máquina até ela parar ou atingir o limite de passos
        
        maximo_de_passos: Limite para evitar que rode para sempre
        """
        passos = 0  # Conta quantos passos já fez
        
        print("\n[INICIO] Iniciando execução da Máquina de Turing")
        print("* Pressione Enter para executar cada passo...\n")
        
        # Repete até parar ou atingir o limite
        while passos < maximo_de_passos:
            # Executa um passo
            continuar_execucao = self.passo()
            
            # Se deve parar, sai do loop
            if not continuar_execucao:
                break
            
            # Conta mais um passo
            passos += 1
            
            # Espera o usuário apertar Enter
            await self.esperar_enter()
        
        # Mostra o resultado final
        print("\n[CONCLUIDO] Execução finalizada.")
        print("===============================")
        print(">>>>>> FITA FINAL <<<<<<")
        print(f">>> {''.join(self.fita)} <<<")
        print("===============================")
        print(f"Total de passos executados: {passos}")

    async def esperar_enter(self):
        """
        Para e espera o usuário apertar Enter para continuar
        """
        input("\n... Pressione Enter para continuar...")

# Regras da máquina
# Para cada estado e símbolo, diz o que fazer
# Formato: estado -> símbolo -> [novo_símbolo, direção, novo_estado]
# Esta máquina específica troca todos os '1' por '0' e mantém os '0'
tabela_de_transicoes = {
    "q0": {  # Estado inicial
        "1": ["0", "D", "q0"],  # Se vê '1': escreve '0', vai para direita, continua no q0
        "0": ["0", "D", "q0"],  # Se vê '0': escreve '0', vai para direita, continua no q0
        "_": ["_", "D", "PARAR"]  # Se vê espaço vazio: para a máquina
    }
}

def mostrar_menu():
    """
    Mostra o título do programa
    """
    print("=" * 25)
    print("=== Máquina de Turing ===")
    print("=" * 25)
    print()

async def main():
    """
    Função principal - controla todo o programa
    
    Faz isso:
    1. Mostra o menu
    2. Pede dados do usuário
    3. Cria e roda a máquina
    """
    # Mostra o título
    mostrar_menu()
    
    # Pede os dados do usuário
    entrada_fita = input("Digite a fita inicial (ex: 10101): ")
    entrada_passos = input("Digite o número máximo de passos: ")
    
    # Converte o texto para número
    passos = int(entrada_passos)
    
    # Cria a máquina
    maquina = MaquinaDeTuring(entrada_fita, tabela_de_transicoes, "q0")
    
    # Roda a máquina
    await maquina.executar(passos)
    
    print("\nPrograma finalizado!")

# Se este arquivo for executado diretamente (não importado)
if __name__ == "__main__":
    # Roda o programa principal
    asyncio.run(main()) 