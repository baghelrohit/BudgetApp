class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //Submit budget method
  submitBudgetForm(){
    const value = this.budgetInput.value;
    if(value==="" || value<0){//value should not be empty or negative
      this.budgetFeedback.classList.add('showItem');//showItem will be invocked if value is -ve
      this.budgetFeedback.innerHTML=`<p>value should not be empty or negative</p>`
      setTimeout(() => {
        this.budgetFeedback.classList.remove('showItem');
      }, 2000);
    }
    //if input contains some +ve value the we will show it to balance or budget area
    else{
          this.budgetAmount.textContent = value;
          this.budgetInput.value ="";
          this.showBalance();
    }
  }

  //Method for Showing Balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;//will subtract expense from budget amount to show Balance
    this.balanceAmount.textContent = total;
    if(total<0){
      this.balance.classList.remove('showGreen','showBlack');
      this.balance.classList.add('showRed');
    }
    else if(total>0){
      this.balance.classList.remove('showRed','showBlack');
      this.balance.classList.add('showGreen');
    }
    if(total<0){
      this.balance.classList.remove('showGreen','showRed');
      this.balance.classList.add('showBlack');
    }
  }

  //submitExpenseForm method for dealing with Expenses input & Amount
  submitExpenseForm(){
    const expenseValue = this.expenseInput.value;//grabing Title of expense
    const amountValue =   this.amountInput.value;//grabing Amount of expense
    if(expenseValue==="" ||amountValue===""||amountValue<0){
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>value should not be empty or negative</p>`
      setTimeout(() => {
        this.expenseFeedback.classList.remove('showItem');
      }, 2000);
    }
    else{
      let amount = parseInt(amountValue);
      this.expenseInput.value="";
      this.amountInput.value="";
      //creating an object to print Expence title and expence Value
      let expense = {
        id : this.itemID,
        title : expenseValue,
        amount:amount
      } 
      this.itemID++;//incrementing the items 
      this.itemList.push(expense);//pushing the item list in the container
      this.addExpense(expense);
      this.showBalance();
    }
  }

  //method for adding Expense
  addExpense(expense){
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

    <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
      <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </div>
                    `;//We get "id" from the objext
        this.expenseList.appendChild(div)//list will Append the div as it gets incremented
  }

  //method for counting Total Expense
  totalExpense(){
    let total = 0;
    if(this.itemList.length>0){
        // console.log(this.itemList)
        //reduce method is used to itrate to the item list and on the next itration it will add the previous value to the current value
        total = this.itemList.reduce(function(acc,curr){
          acc += curr.amount;
          return acc;
        },0)//here initial value is total= Zero
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  //method to edit Expense
  editExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;//geting to the outermost parent of the edit or delete element
    //removing it from DOM
    this.expenseList.removeChild(parent);
    //removing from the arry dom list
    let expence = this.itemList.filter(function(item){//filter will return New Array
      return item.id === id;
    }) 

    // show value in the input as we click edit 
    this.expenseInput.value = expence[0].title;
    this.expenseAmount.value = expence[0].amount;


//removing from list
      let tempList = this.itemList.filter(function(){
        return item.id !== id;
      });
      this.itemList = tempList;
      this.showBalance();
    
  }

  //method to delete Expense
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;//geting to the outermost parent of the edit or delete element
    //removing it from DOM
    this.expenseList.removeChild(parent);
    //removing from list
    let tempList = this.itemList.filter(function(){
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListenters(){
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //New instance of a UI class
  const ui = new UI();

  //Budget Form Submit
  budgetForm.addEventListener('submit',function(event){
    event.preventDefault();//prevent to load page
    ui.submitBudgetForm();
  });

  //Expense Form Submit
  expenseForm.addEventListener('submit',function(event){
    event.preventDefault();//prevent to load page
    ui.submitExpenseForm();
  });

  //Expense clicking haveing Delete or Edit button
  expenseList.addEventListener('click',function(event){ 
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement);
    }
    else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement);

    }
  });
}

document.addEventListener('DOMContentLoaded',function(){
  eventListenters();
})