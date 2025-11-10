let summaryChart;
let categoryChart;
let monthlyChart;

function renderChart(income, expenses) {
  const ctx = document.getElementById('summaryChart').getContext('2d');

  // Destroi gráfico anterior antes de recriar para evitar sobreposição
  if (summaryChart) {
    summaryChart.destroy();
  }

  summaryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        data: [income, expenses],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ddd',
            font: {
              size: 14,
              family: 'Arial'
            }
          }
        },
        title: {
          display: true,
          text: 'Resumo financeiro',
          color: '#fff',
          font: {
            size: 20,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      }
    }
  });
}

function renderCategoryChart(transactions) {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  if (categoryChart) categoryChart.destroy();

  const categoryTotals = {};
  transactions
    .filter(t => t.type === 'despesa')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#ddd', font: { size: 14, family: 'Arial' } }
        },
        title: {
          display: true,
          text: 'Gasto por categorias',
          color: '#fff',
          font: {
            size: 20,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      }
    }
  });
}

function renderMonthlyChart(transactions) {
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  if (monthlyChart) monthlyChart.destroy();

  // Detecta se há filtro de data ativo
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;

  const now = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(now.getFullYear() - 1);

  let filtered = [...transactions];

  // Se não houver filtro manual, aplica corte de 12 meses
  if (!startDate && !endDate) {
    filtered = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= lastYear && date <= now;
    });
  }

  // Agrupa por mês/ano
  const months = {};
  filtered.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!months[key]) months[key] = { receita: 0, despesa: 0 };
    months[key][t.type] += t.amount;
  });

  // Ordena os meses cronologicamente
  const sortedKeys = Object.keys(months).sort();

  const labels = sortedKeys.map(k => {
    const [y, m] = k.split('-');
    const date = new Date(y, m - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  });

  const receitas = sortedKeys.map(k => months[k].receita);
  const despesas = sortedKeys.map(k => months[k].despesa);

  // Renderiza o gráfico
  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Receitas', data: receitas, backgroundColor: '#34d399' },
        { label: 'Despesas', data: despesas, backgroundColor: '#f87171' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#ddd', font: { size: 14, family: 'Arial' } }
        },
        title: {
          display: true,
          text: startDate || endDate
            ? 'Resumo mensal'
            : 'Resumo mensal (últimos 12 meses)',
          color: '#fff',
          font: {
            size: 20,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
          ticks: { color: '#ccc' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}

// Disponibiliza a função globalmente
window.renderChart = renderChart;
