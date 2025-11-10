// Referências aos elementos do DOM
const modal = document.getElementById('transactionModal');
const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');
const form = document.getElementById('transactionForm');

// Abrir o modal ao clicar no "+"
btnAdd.addEventListener('click', () => {
  document.getElementById('modalTitle').textContent = 'Nova transação';
  form.reset();
  modal.showModal();
});

// Fechar modal ao clicar em "Cancelar"
btnCancel.addEventListener('click', () => {
  modal.close();
});


