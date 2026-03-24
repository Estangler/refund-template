//Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Caputurando elementos da lista.
const expenseList = document.querySelector("ul")
const exepensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o  valor.
amount.oninput = () => {
  //Obtém o valor atual do input e atualiza o valor removendo qualquer string.
  let value = amount.value.replace(/\D/g, "")

  //Transformar o valor em centavos.
  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

//captura o evento do submit do formulário para obter os valores.
form.onsubmit = (event) => {
  event.preventDefault();

  //cria um objeto com os detalhes da nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)
}

function expenseAdd(newExpense) {
  try {
    //cria o elemento para adicionar na lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    //cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    expenseInfo.append(expenseName, expenseCategory)

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    expenseList.append(expenseItem)

    formClear()
    updateTotals()
  }catch (error) {
    console.log(error)
  }
}

function updateTotals() {
  try {
    //Recupera todos os itens da lista.
    const items = expenseList.children

    exepensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    let total = 0
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      //removemos caracteres não númericos e substituimos a vírgula.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      value = parseFloat(value)

      //verificar se é um número valido
      if(isNaN(value)) {
        return ("o valor não é um número.")
      }

      total += Number(value)
    }

    // expensesTotal.textContent = formatCurrencyBRL((total / 100))

    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"
    //formata o valor e remove o R$ que sera exibido pela small com o estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    expensesTotal.innerHTML = ""

    expensesTotal.append(symbolBRL, (total))
  } catch (error) {
    console.log(error)
  }
}

//Evento que captura o click nos items da lista.

expenseList.addEventListener("click", function(event) {
  if(event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense")

    item.remove()
  }

  updateTotals()
})

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}