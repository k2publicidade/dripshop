# Preferências do Usuário

## Idioma
- Sempre responder em **Português do Brasil (PT-BR)**

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
