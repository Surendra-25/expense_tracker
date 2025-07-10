
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const expenseList = document.getElementById("expenseList");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");

function openModal() {
  modal.classList.add("show");
  overlay.classList.add("show");
  document.getElementById("date").valueAsDate = new Date();
}

function closeModal() {
  modal.classList.remove("show");
  overlay.classList.remove("show");
}

function submitTransaction() {
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const desc = document.getElementById("desc").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (amount && desc && category && date) {
    const transaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      type,
      desc,
      category,
      date
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    closeModal();
    document.getElementById("amount").value = "";
    document.getElementById("desc").value = "";
  } else {
    alert("Please fill in all fields.");
  }
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
}

function renderTransactions() {
  const filterCategory = document.getElementById("filterCategory").value;
  const filterDate = document.getElementById("filterDate").value;

  expenseList.innerHTML = "";
  let income = 0, expense = 0;

  transactions
    .filter(t =>
      (!filterCategory || t.category === filterCategory) &&
      (!filterDate || t.date === filterDate)
    )
    .forEach(t => {
      const div = document.createElement("div");
      div.classList.add("transaction", t.type);
      div.innerHTML = \`
        <span>\${t.date} | \${t.category}: ₹\${t.amount.toFixed(2)} - \${t.desc}</span>
        <button onclick="deleteTransaction(\${t.id})">🗑️</button>
      \`;
      expenseList.appendChild(div);

      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

  document.getElementById("totalIncome").innerText = income.toFixed(2);
  document.getElementById("totalExpense").innerText = expense.toFixed(2);
  document.getElementById("balance").innerText = \`₹\${(income - expense).toFixed(2)}\`;
}

function exportCSV() {
  const csv = ['Date,Type,Amount,Category,Description'];
  transactions.forEach(t => {
    csv.push(\`\${t.date},\${t.type},\${t.amount},\${t.category},"\${t.desc}"\`);
  });
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'transactions.csv';
  link.click();
}

document.getElementById("filterCategory").addEventListener("change", renderTransactions);
document.getElementById("filterDate").addEventListener("change", renderTransactions);

renderTransactions();
