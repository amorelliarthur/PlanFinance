# 📊 PlanFinance

**PlanFinance** é uma aplicação web progressiva (PWA) de controle financeiro pessoal desenvolvida com **HTML, CSS e JavaScript puro**, utilizando **IndexedDB** como banco de dados local.
O objetivo do projeto é permitir o gerenciamento simples e visual de receitas e despesas, com gráficos dinâmicos, filtros inteligentes e funcionamento totalmente offline, sem depender de servidor.

---

## Visão Geral

O PlanFinance ajuda o usuário a ter uma visão clara da sua vida financeira através de:
- Cadastro de **transações** (receitas e despesas)
- **Filtros** por tipo, categoria e intervalo de datas
- **Resumo financeiro** com total de receitas, despesas e saldo
- **Gráficos dinâmicos** e interativos com **Chart.js**
- Armazenamento local com **IndexedDB**, sem necessidade de conexão com internet
- **Suporte PWA**, permitindo instalação como app e uso offline completo

---

## Funcionalidades Principais

### Cadastro de Transações
- Para adicionar uma nova transação, clique no botão “➕” no canto inferior direito. Isso abrirá um modal com o formulário de cadastro.
- Adicione novas transações informando tipo (receita/despesa), categoria, descrição, valor e data.
- Todas as informações são salvas localmente via IndexedDB.
- É possível **editar** ou **excluir** transações a qualquer momento.

### Listagem e Filtros
- A tabela exibe as transações mais **recentes primeiro**.
- Opções de filtro:
  - Por **tipo** (receita ou despesa)
  - Por **categoria**
  - Por **intervalo de datas**
- Botão de **"limpar filtros"** para retornar à visão geral.

### Gráficos e Resumo Visual

#### 1. **Resumo Financeiro (Gráfico 1)**
- Mostra a proporção entre receitas e despesas totais.
- Tipo: **Doughnut Chart**

#### 2. **Gasto por Categorias (Gráfico 2)**
- Mostra como as despesas estão distribuídas entre as categorias.
- Tipo: **Doughnut Chart**

#### 3. **Resumo Mensal (Gráfico 3)**
- Exibe a evolução mensal de receitas e despesas.
- Tipo: **Bar Chart**
- Mostra **os últimos 12 meses** por padrão.
- Caso o usuário aplique **filtro de data**, o gráfico se adapta dinamicamente.

Todos os gráficos são **responsivos** e atualizados em tempo real conforme as transações são alteradas.

---

## Tecnologias Utilizadas

| Tecnologia | Função |
|-------------|--------|
| **HTML5** | Estrutura e semântica da aplicação |
| **CSS3** | Estilização e layout responsivo |
| **Pico.css** | Framework CSS minimalista para design limpo e moderno |
| **JavaScript (ES6)** | Lógica de negócio, controle de dados e DOM |
| **IndexedDB** | Armazenamento local das transações |
| **Chart.js** | Visualização de dados em gráficos interativos |
| **Service Worker (PWA)** | Cache offline e instalação como aplicativo |

---

## Recursos de PWA e Cache

- O PlanFinance é uma Progressive Web App (PWA) completa:
  - Pode ser instalado no dispositivo (desktop ou mobile) como um app nativo.
  - Funciona totalmente offline após o primeiro acesso.
  - Utiliza Service Worker para gerenciar cache de arquivos e dados.
- O cache é atualizado automaticamente quando há novas versões, garantindo desempenho e acesso instantâneo mesmo sem internet.

---

## Detalhes Técnicos

- A tabela é renderizada dinamicamente via DOM.
- Na tabela, caso o número de registros ultrapasse 20, um botão “➕” é exibido na parte inferior para carregar mais 20 registros por vez.
- O cálculo do resumo e dos gráficos é feito com base nos registros visíveis (filtros aplicados).
- O gráfico mensal mantém o foco nos últimos 12 meses para evitar sobrecarga visual a menos que use filtro de data.
- Todos os gráficos são destruídos e recriados quando os dados mudam, evitando sobreposição.

---

## Funcionamento do Service Worker
O Service Worker do PlanFinance é responsável por tornar a aplicação totalmente funcional mesmo sem conexão com a internet.
Ele realiza três tarefas principais:
   1. Instalação e cache inicial:
      Durante a instalação, o service worker faz o cache de todos os arquivos essenciais (HTML, CSS, JS, ícones e dependências externas).
      Isso garante que o app possa ser aberto mesmo offline.
   2. Atualização automática de versão:
      Quando uma nova versão do PlanFinance é publicada, o service worker detecta a mudança e:
         - remove o cache antigo;
         - armazena os novos arquivos;
         - assume o controle imediato da aplicação (skipWaiting e clients.claim()).
   3. Estratégia de busca (“Network First, Cache Fallback”):
      - O app tenta buscar o conteúdo da rede sempre que possível (mantendo tudo atualizado).
      - Caso o dispositivo esteja offline, ele recupera os arquivos do cache.
      - Quando a conexão é restabelecida, o cache é atualizado automaticamente com a versão mais recente dos arquivos.

Essa abordagem garante desempenho, atualização automática e funcionamento contínuo, mesmo sem internet.

---

## Instalação

- Acesse o site do PlanFinance em um navegador (Chrome, Edge, Safari ou Firefox).
- Clique em “Adicionar à tela inicial” para instalar o app no dispositivo.
- Após a instalação, o aplicativo funcionará offline, com todos os dados salvos localmente.