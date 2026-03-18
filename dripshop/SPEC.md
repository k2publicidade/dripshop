# SPEC.md - Clone Lolja.com.br

## 1. Visão Geral do Projeto

**Nome do Projeto:** DripShop - Clone Lolja  
**Tipo:** E-commerce de roupas e acessórios (marketplace de creators)  
**Stack Sugerida:** Next.js 14 + TypeScript + Tailwind CSS + Shadcn/UI  
**Plataforma Original:** VNDA (agora Olist)  
**URL Original:** https://www.lolja.com.br/

---

## 2. Análise de Cores e Estilos

### Paleta de Cores Principal

| Nome | Hex | Uso |
|------|-----|-----|
| Preto | `#000000` | Texto principal, botões |
| Branco | `#ffffff` | Fundos, header |
| Cinza Escuro | `#424242` | Textos secundários |
| Cinza Médio | `#828282` | Placeholders, borders |
| Cinza Claro | `#f2f2f2` | Fundos de seções |
| Laranja Vibrante | `#ff5733` | Destaques, promoções |
| Laranja Escuro | `#fc612e` | Hover em botões laranja |
| Verde Sucesso | `#00b081` | Frete grátis, mensagens |
| Azul Link | `#094ee4` | Links |

### Tipografia

- **Fonte Principal:** Dosis (Google Fonts) - headings e navegação
- **Fonte Secundária:** Roboto (Google Fonts) - corpo de texto
- **Tamanhos:**
  - H1: 32px-48px
  - H2: 24px-32px
  - H3: 18px-24px
  - Body: 14px-16px
  - Small: 12px

### Espaçamento

- Container max-width: 1400px
- Padding padrão: 16px
- Gaps: 8px, 16px, 24px, 32px

---

## 3. Estrutura de Navegação

### Header (Sticky - 73px)

```
┌─────────────────────────────────────────────────────────┐
│ Logo │ Coleções ▼ │ Licenciados ▼ │ Camisetas ▼ │ ... │ ... │ Conta │ Carrinho │
└─────────────────────────────────────────────────────────┘
```

**Elementos do Header:**
- Logo (imagem SVG)
- Menu de navegação principal com dropdowns
- Ícones de conta e carrinho
- Banner de benefícios (6x sem juros, entrega Brasil)

### Menu de Navegação Principal

1. **COLEÇÕES** (dropdown mega menu)
   - ASTROCORE, CREEPY CUTE, CURSED ABYSS, DARK MOOD
   - DIRECTORS CUT, FUTURE CHAOS, FREESTYLE
   - GODS OF OLYMPUS, HALLOWEEN, IDENTIDADE
   - LOLJA STREET, METARU, OLD SKULL, RUÍNAS
   - SELF DATA, LANÇAMENTOS

2. **LICENCIADOS**
   - ASSASSINS CREED, BAGDÉX, BRAWLHALLA
   - RAINBOW SIX, WORLD OF WARCRAFT

3. **CAMISETAS** (com subcategorias)
   - ANIMES, CAVEIRAS, FILMES E SÉRIES, GAMES
   - LITERATURA, MÚSICAS, HUMOR, TERROR
   - Tipos: Oversized, Regata, Manga Longa, Cropped

4. **MOLETOM** (com subcategorias)
   - Mesmas categorias + COM CAPUZ, SEM CAPUZ, INFANTIL

5. **PARCEIROS** (mega menu com +150 creators)
   - Felipe Neto, Cellbit, Saiko, Imaginago, etc.

6. **ARTISTAS**
   - Andre Consoli, Art Corvus, Carlos Ruas, etc.

7. **ACESSÓRIOS**
   - CANECAS, ECOBAG, TOUCA, CHAVEIROS E PINS

8. **PROMOÇÃO** (link direto)

---

## 4. Estrutura de Páginas

### 4.1 Homepage (Página Inicial)

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (sticky)                                        │
├─────────────────────────────────────────────────────────┤
│ Banner principal (hero section)                        │
├─────────────────────────────────────────────────────────┤
│ Carrossel: Creators favoritos                           │
│ [Felipe Neto] [Cellbit] [Saiko] [Imaginago] ...        │
├─────────────────────────────────────────────────────────┤
│ Seção: Destaques                                        │
│ [Produto] [Produto] [Produto] [Produto]                │
├─────────────────────────────────────────────────────────┤
│ Coleções em destaque:                                   │
│ [SELF-DATA] [DROPS] [STREET] [DIRECTORS CUT] ...       │
├─────────────────────────────────────────────────────────┤
│ Seção: Lançamentos                                      │
│ [Produto] [Produto] [Produto] [Produto] ...             │
├─────────────────────────────────────────────────────────┤
│ Seção: Mais Vendidos                                    │
│ [Mole tons] [Camisetas] [Oversized] [Manga Longa]     │
├─────────────────────────────────────────────────────────┤
│ Newsletter signup                                        │
├─────────────────────────────────────────────────────────┤
│ Footer                                                  │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Página de Coleção/Categoria

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
├──────────────┬──────────────────────────────────────────┤
│ SIDEBAR      │ RESULTADOS                               │
│              │                                          │
│ Filtros:     │ [Produto] [Produto] [Produto]          │
│ - Categorias │ [Produto] [Produto] [Produto]          │
│ - Preço      │ [Produto] [Produto] [Produto]          │
│ - Tamanho    │ ...                                      │
│ - Cor        │                                          │
│ - Tema       │                                          │
│              │ PAGINAÇÃO                                │
└──────────────┴──────────────────────────────────────────┘
```

### 4.3 Página de Produto

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
├───────────────────────┬────────────────────────────────┤
│ GALERIA DE IMAGENS   │ INFORMAÇÕES DO PRODUTO         │
│                       │                                │
│ [Thumb 1] [Thumb 2]  │ Nome do produto                │
│ [Thumb 3] [Thumb 4]  │ Preço: R$ 79,90                │
│                       │ -20%                            │
│ ┌─────────────────┐  │ 6x de R$ 13,32 sem juros       │
│ │   Imagem       │  │                                │
│ │   Principal    │  │ Selecione o tamanho:           │
│ └─────────────────┘  │ [P] [M] [G] [GG]               │
│                       │                                │
│                       │ [COMPRAR]                      │
│                       │                                │
│                       │ Descrição:                     │
│                       │ O cropped oversized da Lolja...│
└───────────────────────┴────────────────────────────────┘
```

---

## 5. Componentes UI

### 5.1 ProductCard

```tsx
interface ProductCard {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  colors?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}
```

**Estrutura:**
```
┌─────────────────────┐
│ [IMAGEM]            │
│ [badge: -20%]      │
├─────────────────────┤
│ NOME DO PRODUTO    │
│ R$ 79,90           │
│ 6x sem juros       │
└─────────────────────┘
```

### 5.2 Header Component

- Logo (SVG)
- NavigationMenu (com dropdowns)
- SearchBar (opcional)
- UserMenu (conta)
- CartIcon (com badge de quantidade)

### 5.3 Footer Component

**Cols:**
1. Institucional (links)
2. Ajuda (links)
3. Termos de uso
4. Mais Buscados
5. Redes Sociais

### 5.4 FilterSidebar

- Accordion groups
- Checkbox filters
- Range slider para preço
- Apply/Clear buttons

---

## 6. Funcionalidades Principais

### 6.1 Catálogo de Produtos

- [x] Listagem de produtos em grid
- [x] Filtros por categoria, preço, tamanho, cor, tema
- [x] Ordenação (menor preço, maior preço, mais vendidos, newest)
- [x] Paginação
- [x] Busca

### 6.2 Produto Individual

- [x] Galeria de imagens com thumbnails
- [x] Seleção de tamanho
- [x] Seleção de cor
- [x] Preço com desconto
- [x] Parcelamento (6x sem juros)
- [x] Descrição do produto
- [x] Frete cálculo (simulação)

### 6.3 Carrinho

- [x] Adicionar produto
- [x] Remover produto
- [x] Atualizar quantidade
- [x] Atualizar tamanho/cor
- [x] Subtotal

### 6.4 Checkout

- [x] Informações de entrega
- [x] Informações de pagamento
- [x] Resumo do pedido

### 6.5 Usuário

- [x] Login/Cadastro
- [x] Meus pedidos
- [x] Endereços
- [x] Dados pessoais

---

## 7. Sitemap Extraído

### Páginas Principais

```
/                           - Home
/camiseta-lolja            - Todas as Camisetas
/moletom-lolja             - Todos os Moletons
/promocao                  - Promoções
/lancamentos               - Lançamentos
/parceiros                 - Parceiros (creators)
/sobre-nos                 - Sobre Nós
/fale-conosco              - Fale Conosco
/p/ajuda                   - Ajuda/FAQ
/p/trocas                  - Trocas e Devoluções
```

### Coleções

```
/astrocore                 - Astrocore
/creepy-cute              - Creepy Cute
/cursed-abyss             - Cursed Abyss
/dark-mood                - Dark Mood
/directors-cut            - Directors Cut
/future-chaos             - Future Chaos
/freestyle                - Freestyle
/gods-of-olympus          - Gods of Olympus
/halloween                - Halloween
/identidade                - Identidade
/street                   - Lolja Street
/metaru                   - Metaru
/old-skull                - Old Skull
/ruinas                   - Ruínas
/self-data                - Self Data
```

### Categorias de Produtos

```
/animes                    - Camisetas de Animes
/caveiras                  - Camisetas de Caveiras
/filmes-e-series          - Filmes e Séries
/games                    - Games
/literatura               - Literatura
/musica                   - Música
/humor                    - Humor
/terror                   - Terror

/camiseta-oversized       - Camiseta Oversized
/regata-oversized         - Regata Oversized
/manga-longa-lolja        - Manga Longa
/cropped-oversized        - Cropped Oversized

/promocao-moletom         - Moletons em Promoção
/moletom-animes           - Moletons Animes
/moletom-caveiras         - Moletons Caveiras
/moleton-filmes-e-series - Moletons Filmes e Séries

/caneca                   - Canecas
/ecobag                   - Ecobags
/touca                    - Toucas
/chaveiro-pins            - Chaveiros e Pins
```

### Páginas de Produto

```
/produto/{slug-id}        - Página de produto individual
```

---

## 8. Implemetação Sugerida

### Stack Técnica

1. **Frontend:** Next.js 14 (App Router)
2. **Estilização:** Tailwind CSS + Shadcn/UI
3. **Estado:** Zustand ou React Context
4. **Dados:** Mock data ou API simulada

### Estrura de Diretórios

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── produtos/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── categorias/
│   │   └── [categoria]/
│   │       └── page.tsx
│   └── checkout/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   └── ProductInfo.tsx
│   ├── filters/
│   │   ├── FilterSidebar.tsx
│   │   └── FilterAccordion.tsx
│   └── cart/
│       ├── CartDrawer.tsx
│       └── CartItem.tsx
├── lib/
│   ├── data/
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   └── creators.ts
│   └── utils.ts
├── styles/
│   └── globals.css
└── types/
    └── index.ts
```

---

## 9. Considerações de Design

### Pontos de Quebra (Breakpoints)

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Padrões Observados

1. Bordas sutis (1px cinza)
2. Border-radius: 2px-4px (não arredondado)
3. Sombras leves em cards
4. Preços em negrito
5. Descontos em destaque com cor laranja
6. Imagens de produtos com fundo branco
7. Layout responsivo com grid adaptativo

---

## 10. Próximos Passos

1. Criar projeto Next.js com TypeScript
2. Configurar Tailwind CSS com as cores extraídas
3. Implementar componentes base (Header, Footer, ProductCard)
4. Criar dados mock para produtos
5. Implementar páginas principais
6. Adicionar interatividade (filtros, carrinho)
7. Testar responsividade
