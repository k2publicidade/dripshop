# Design: Instalação e Integração do Beads (bd)

**Data:** 2026-01-07
**Objetivo:** Substituir parcialmente o TodoWrite por beads para rastreamento persistente de tarefas

## Visão Geral

Implementar um sistema híbrido de rastreamento de tarefas que combina:
- **beads (bd)**: Para tarefas principais, milestones e persistência entre sessões
- **TodoWrite**: Para sub-tarefas durante execução e feedback visual em tempo real

## 1. Instalação e Estrutura

### Instalação Global
```bash
npm install -g @beads/bd
```

### Projetos a Inicializar
Inicializar beads nos seguintes projetos existentes:
- `vibeoffice/` - (modificado, rastreado no git)
- `condomtrack/` - (não rastreado)
- `saas-ar-condicionado/` - (não rastreado)
- `anapereira-main/` - (não rastreado)

### Processo de Inicialização
Para cada projeto:
1. `cd <projeto>`
2. `bd init` - cria configuração local
3. Verificar arquivos criados
4. Retornar ao diretório raiz

## 2. Integração no Fluxo de Trabalho

### Sistema Híbrido

**Usar bd para:**
- Tarefas principais e milestones do projeto
- Tasks que persistem entre sessões
- Planejamento de alto nível
- Histórico auditável de progresso

**Usar TodoWrite para:**
- Sub-tarefas durante execução ativa
- Feedback visual em tempo real
- Tarefas efêmeras/temporárias
- Mostrar progresso detalhado ao usuário

### Estrutura Típica de Uso

```bash
# Task principal no bd
bd add "Implementar sistema de notificações"

# Sub-tarefas no TodoWrite para execução
TodoWrite: [
  "Criar modelo Notification",
  "Implementar serviço de envio",
  "Adicionar testes unitários"
]

# Ao concluir tudo
bd done "Implementar sistema de notificações"
```

### Gatilhos para Usar bd
- Features completas
- Bugs importantes
- Refatorações significativas
- Milestones de projeto
- Qualquer tarefa que leve >30 minutos

## 3. Documentação e Configuração

### Arquivo AGENTS.md por Projeto

Criar em cada projeto inicializado:

```markdown
# Instruções para Agentes/Assistentes

## Rastreamento de Tarefas

Este projeto usa **beads (bd)** para gerenciamento de tarefas.

### Comandos Principais
- `bd add "descrição"` - Adicionar nova tarefa
- `bd list` - Listar tarefas pendentes
- `bd done "descrição"` - Marcar como concluída
- `bd show` - Ver detalhes de uma tarefa

### Fluxo de Trabalho
- Use `bd` para tarefas principais e milestones
- Use TodoWrite para sub-tarefas durante execução
- Sempre informe ao usuário quando criar tasks no bd

### Inicialização
Este projeto já foi inicializado com `bd init`.
```

### Configuração Global (CLAUDE.md)

Adicionar ao `CLAUDE.md` do diretório raiz:
- Instrução para sempre inicializar bd em novos projetos
- Referência ao sistema híbrido (bd + TodoWrite)
- Comando rápido: `bd list`

## 4. Plano de Implementação

### Passo 1: Instalação Global
```bash
npm install -g @beads/bd
bd --version  # Verificar instalação
```

### Passo 2: Inicialização dos Projetos
Para cada projeto (vibeoffice, condomtrack, saas-ar-condicionado, anapereira-main):
1. `cd <projeto>`
2. `bd init`
3. Criar `AGENTS.md` com instruções
4. Verificar arquivos de configuração

### Passo 3: Documentação Global
1. Atualizar `CLAUDE.md` no diretório raiz
2. Adicionar seção sobre beads e sistema híbrido
3. Documentar processo para novos projetos

### Passo 4: Verificação Final
1. Testar criação de tarefa de exemplo
2. Confirmar `bd list` funciona
3. Validar persistência da configuração

## 5. Regra para Novos Projetos

**IMPORTANTE:** Todos os novos projetos criados neste diretório devem ter `bd init` executado automaticamente durante a criação.

## Arquivos Afetados

- `CLAUDE.md` (modificado)
- `vibeoffice/AGENTS.md` (novo)
- `condomtrack/AGENTS.md` (novo)
- `saas-ar-condicionado/AGENTS.md` (novo)
- `anapereira-main/AGENTS.md` (novo)
- Arquivos de configuração do bd em cada projeto

## Tempo Estimado

5-10 minutos para implementação completa

## Benefícios

✅ Persistência de tarefas entre sessões
✅ Visibilidade em tempo real durante execução
✅ Histórico auditável de progresso
✅ Sistema pragmático que usa cada ferramenta para o que faz melhor
✅ Escalável para novos projetos
