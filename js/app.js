document.addEventListener('DOMContentLoaded', async () => {
  await PlanFinanceDB.initDB();

  const btnAdd = document.getElementById('btnAdd');
  const modal = document.getElementById('transactionModal');
  const form = document.getElementById('transactionForm');
  const btnCancel = document.getElementById('btnCancel');
  const transactionsTable = document.getElementById('transactions');
  const balanceEl = document.getElementById('balance');
  const incomeEl = document.getElementById('income');
  const expensesEl = document.getElementById('expenses');

  let editingTransaction = null; // Guarda o registro que está sendo editado

  /* ---------- MODAL ---------- */

  btnAdd.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Nova transação';
    form.reset();
    editingTransaction = null; // Sai do modo de edição
    modal.showModal();
  });

  btnCancel.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      modal.close();
    }
  });

  /* ---------- FORM SUBMIT ---------- */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (!category || isNaN(amount) || !date) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(), // Mantém o ID se for edição
      type,
      category,
      description,
      amount,
      date
    };

    if (editingTransaction) {
      await PlanFinanceDB.updateTransaction(transaction); // Atualiza
    } else {
      await PlanFinanceDB.addTransaction(transaction); // Novo registro
    }

    modal.close();
    loadTransactions();
  });

  /* ---------- CARREGAR E RENDERIZAR ---------- */

  async function loadTransactions() {
    const transactions = await PlanFinanceDB.getAllTransactions();
    renderTransactions(transactions);
    updateSummary(transactions);
  }

  // Estado global das transações
  let allTransactions = [];

  async function loadTransactions() {
    allTransactions = await PlanFinanceDB.getAllTransactions();
    applyFilters();
  }

  function applyFilters() {
    const type = document.getElementById('filterType').value;
    const category = document.getElementById('filterCategory').value.toLowerCase();
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;

    let filtered = allTransactions;

    if (type) filtered = filtered.filter(t => t.type === type);
    if (category) filtered = filtered.filter(t => t.category.toLowerCase().includes(category));

    // Filtro por intervalo de datas
    if (startDate || endDate) {
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && tDate < start) return false;
        if (end && tDate > end) return false;
        return true;
      });
    }

    renderTransactions(filtered);
    updateSummary(filtered);
  }


  // Eventos de filtro
  document.getElementById('filterType').addEventListener('change', applyFilters);
  document.getElementById('filterCategory').addEventListener('input', applyFilters);
  document.getElementById('filterStartDate').addEventListener('change', applyFilters);
  document.getElementById('filterEndDate').addEventListener('change', applyFilters);


  // Limpar filtros
  document.getElementById('btnClearFilters').addEventListener('click', () => {
    document.getElementById('filterForm').reset();
    applyFilters();
  });

  function formatDateLocaleSafe(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    // Cria a data no fuso local, não em UTC
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(navigator.language || 'pt-BR');
  }

  let visibleCount = 20; // controla quantos itens aparecem por vez

  function renderTransactions(transactions) {
    // Ordena por data decrescente
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    transactionsTable.innerHTML = '';

    if (transactions.length === 0) {
      transactionsTable.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhuma transação registrada.</td></tr>`;
      return;
    }

    // Mostra apenas até o limite atual
    const visibleTransactions = transactions.slice(0, visibleCount);

    visibleTransactions.forEach((t) => {
      const row = document.createElement('tr');
      const formattedDate = formatDateLocaleSafe(t.date);

      row.innerHTML = `
        <td>${t.type === 'receita' ? 'Receita' : 'Despesa'}</td>
        <td>${t.category}</td>
        <td>${t.description || '-'}</td>
        <td>R$ ${t.amount.toFixed(2)}</td>
        <td>${formattedDate}</td>
        <td style="text-align:center;">
          <button class="secondary edit-btn" data-id="${t.id}">✏️</button>
          <button class="secondary delete-btn" data-id="${t.id}">🗑</button>
        </td>
      `;
      transactionsTable.appendChild(row);
    });

    // Remove botão anterior se existir
    const oldBtn = document.getElementById('loadMoreBtn');
    if (oldBtn) oldBtn.remove();

    // Adiciona botão "Carregar mais" se ainda houver mais registros
    if (visibleCount < transactions.length) {
      const loadMoreRow = document.createElement('tr');
      loadMoreRow.innerHTML = `
        <td colspan="6" style="text-align:center;">
          <button id="loadMoreBtn" class="secondary btn-round">➕</button>
        </td>
      `;
      transactionsTable.appendChild(loadMoreRow);

      document.getElementById('loadMoreBtn').addEventListener('click', () => {
        visibleCount += 20;
        renderTransactions(transactions);
      });
    }

    // Botões de exclusão
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.dataset.id);
        await PlanFinanceDB.deleteTransaction(id);
        visibleCount = 20; // reseta a visualização
        loadTransactions();
      });
    });

    // Botões de edição
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.dataset.id);
        const transactions = await PlanFinanceDB.getAllTransactions();
        const t = transactions.find((item) => item.id === id);
        if (!t) return;

        document.getElementById('type').value = t.type;
        document.getElementById('category').value = t.category;
        document.getElementById('description').value = t.description;
        document.getElementById('amount').value = t.amount;
        document.getElementById('date').value = t.date;

        document.getElementById('modalTitle').textContent = 'Editar transação';
        editingTransaction = t;
        modal.showModal();
      });
    });
  }

  /* ---------- RESUMO ---------- */

  function updateSummary(transactions) {
    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.type === 'receita') income += t.amount;
      else expenses += t.amount;
    });

    const balance = income - expenses;

    incomeEl.textContent = `R$ ${income.toFixed(2)}`;
    expensesEl.textContent = `R$ ${expenses.toFixed(2)}`;
    balanceEl.textContent = `R$ ${balance.toFixed(2)}`;

    // Pega todos os cards de gráfico
    const chartContainers = document.querySelectorAll('.chart');

    // Se não houver dados, remove totalmente os cards
    if (income === 0 && expenses === 0) {
      chartContainers.forEach(c => c.style.display = 'none');
      if (summaryChart) {
        summaryChart.destroy();
        summaryChart = null;
      }
      return;
    }

    // Caso tenha dados, exibe os cards e renderiza os gráficos
    chartContainers.forEach(c => c.style.display = '');
    renderChart(income, expenses);
    renderCategoryChart(transactions);
    renderMonthlyChart(transactions);
  }


  loadTransactions();
});
