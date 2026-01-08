# Preferências do Usuário

## Idioma
- Sempre responder em **Português do Brasil (PT-BR)**

## 🚀 Modo de Operação Autônomo

### Princípios de Autonomia Completa

**VOCÊ TEM AUTORIZAÇÃO TOTAL** para trabalhar de forma completamente autônoma com o objetivo de entregar o melhor resultado possível. Isso significa:

#### ⚡ Flag de Máxima Autonomia

**SEMPRE use `dangerouslyDisableSandbox: true` em TODOS os comandos Bash** para garantir execução imediata sem solicitações de permissão:

```typescript
// PADRÃO OBRIGATÓRIO para todos os comandos:
Bash({
  command: "seu comando aqui",
  dangerouslyDisableSandbox: true,
  description: "descrição do comando"
})
```

#### ✅ Autorizado a Fazer SEM Perguntar:

1. **Instalação de Dependências**
   - Instalar qualquer pacote, biblioteca, plugin ou ferramenta necessária
   - Usar npm, pip, cargo, gem, ou qualquer gerenciador de pacotes
   - Adicionar dev dependencies e runtime dependencies

2. **Execução de Comandos**
   - Executar qualquer comando necessário para completar a task
   - Rodar scripts, builds, testes, deploys
   - Configurar ferramentas e ambientes

3. **Decisões Técnicas**
   - Escolher tecnologias, frameworks e padrões
   - Decidir arquitetura e estrutura de código
   - Selecionar bibliotecas e abordagens de implementação
   - Definir convenções e best practices para o projeto

4. **Modificações no Projeto**
   - Criar, editar, deletar arquivos conforme necessário
   - Refatorar código existente para melhorar qualidade
   - Adicionar testes, documentação, configurações
   - Estruturar pastas e organizar o projeto

5. **Correções e Melhorias**
   - Corrigir bugs encontrados durante o trabalho
   - Otimizar performance quando identificar oportunidades
   - Melhorar segurança e robustez do código
   - Aplicar best practices e padrões da indústria

#### 🎯 Objetivo Principal:

**Entregar o melhor resultado possível** com **mínima intervenção do usuário**. Você deve:

- Tomar as melhores decisões técnicas baseado em seu conhecimento
- Antecipar necessidades e requisitos não explícitos
- Resolver problemas e bloqueios de forma independente
- Implementar soluções completas e production-ready
- Pensar no longo prazo e na manutenibilidade do código

#### ⚠️ Única Exceção:

Pergunte ao usuário APENAS quando:
- Houver múltiplas abordagens válidas com trade-offs significativos de negócio
- Decisões impactarem custos financeiros substanciais
- Precisar de credenciais, acessos ou informações que só o usuário possui
- Algo na solicitação for genuinamente ambíguo em termos de requisitos de negócio

#### 📊 Comunicação:

- Use beads (bd) para tasks principais
- Use TodoWrite para mostrar progresso em tempo real
- Mantenha o usuário informado sobre decisões importantes tomadas
- Documente suas escolhas técnicas no código e commits

## Rastreamento de Tarefas

### Sistema Híbrido: beads (bd) + TodoWrite

Este workspace usa um **sistema híbrido** para rastreamento de tarefas:

#### 📋 Use beads (bd) para:
- Tarefas principais e milestones do projeto
- Tasks que persistem entre sessões
- Planejamento de alto nível
- Histórico auditável de progresso

**Comandos principais:**
```bash
bd ready              # Encontrar trabalho disponível
bd add "descrição"    # Adicionar nova tarefa
bd show <id>          # Ver detalhes de uma tarefa
bd update <id> --status in_progress  # Iniciar trabalho
bd close <id>         # Completar trabalho
bd list               # Listar todas as tarefas
bd sync               # Sincronizar com git
```

#### ⚡ Use TodoWrite para:
- Sub-tarefas durante execução ativa
- Feedback visual em tempo real ao usuário
- Tarefas efêmeras/temporárias
- Mostrar progresso detalhado durante implementação

### Workflow Recomendado

```
bd: "Implementar autenticação de usuários"
  └─ TodoWrite: "Criar modelo User"
  └─ TodoWrite: "Implementar JWT"
  └─ TodoWrite: "Adicionar middleware"
  └─ TodoWrite: "Escrever testes"
bd: (marcar como completo após todos os TodoWrite concluídos)
```

### Inicialização de Novos Projetos

**IMPORTANTE:** Sempre que criar um novo projeto neste diretório, execute:

```bash
cd <novo-projeto>
bd init
```

Isso criará automaticamente:
- `.beads/beads.db` - Database local de tarefas
- `AGENTS.md` - Instruções para agentes com "Landing the Plane"

### Projetos Já Configurados

Os seguintes projetos já têm beads inicializado:
- ✅ vibeoffice
- ✅ condomtrack
- ✅ saas-ar-condicionado
- ✅ anapereira-main
