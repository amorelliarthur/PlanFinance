const DB_NAME = 'PlanFinance_db';
const STORE_NAME = 'transactions';
const DB_VERSION = 1;

let db;

// Inicializa o banco
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Erro ao abrir o IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
}

/* ---------- Operações CRUD ---------- */

// Adicionar transação
function addTransaction(transaction) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(transaction);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}

// Obter todas as transações
function getAllTransactions() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Atualizar uma transação
function updateTransaction(transaction) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(transaction);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}

// Deletar transação
function deleteTransaction(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}

// Exportar funções
window.PlanFinanceDB = {
  initDB,
  addTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction
};
