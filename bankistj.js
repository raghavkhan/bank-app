'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

 containerApp.style.opacity = '100';
// containerMovements.style.opacity = '100';

const displayMovements = function(acc, sorted = false) {
containerMovements.innerHTML = '';
const moves = sorted ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;
//console.log(acc.movements);
//console.log(moves);
moves.forEach(function(mov, i, arr) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`
  containerMovements.insertAdjacentHTML('afterbegin',html);
} );   
}



const displayBalance = function(acc) {
acc.balance =   acc.movements.reduce((acc,mov) => acc + mov,0)
labelBalance.textContent = `${acc.balance} Euro`;  
}


const displaySummary = function(acc) {
const incomes = acc.movements.filter(mov => mov > 0).reduce((acc,mov) =>acc+mov ,0);
labelSumIn.textContent = `${incomes} Euro`;

const out = acc.movements.filter(mov => mov<0).reduce((acc,mov) => acc + mov, 0);
labelSumOut.textContent = `${Math.abs(out)} Euro`;

const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * account1.interestRate/100 ).filter(mov => mov>1)
.reduce((acc,mov)=> acc+mov, 0);
labelSumInterest.textContent = `${interest} Euro`;
}



const createUsernames = function(accs){
accs.forEach(function(acc) { acc.username =  acc.owner.split(' ').map(name => name[0]).join('').toLowerCase() });
}
createUsernames(accounts);

const startLogOutTimer = function() {
  let time = 80;
  let minute;
  let second;
  const hello = function() {
  labelTimer.textContent = ` ${minute} : ${second}`;
    time--;
   // console.log(time);
   minute = String(Math.trunc(time / 60)).padStart(2,0);
   second = String((time % 60)).padStart(2,0);
  if(time < 0)
  {
    clearInterval(timer);
   // containerApp.style.opacity = '0';
  }
  
  }
  hello();
  const timer = setInterval(hello, 1000);
  
  //const timer = setInterval(function(){console.log('raghav')}, 1000);
  return timer;
  }
  //startLogOutTimer();

const updateUI = function(acc) {
  displayMovements(acc);
  displaySummary(acc);
  displayBalance(acc);
}

let currentAccount, timer ;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
console.log(currentAccount);
if(currentAccount?.pin === Number(inputLoginPin.value))
{
labelWelcome.textContent = `Welcome back, ${currentAccount?.owner.split(' ')[0]}`;
containerApp.style.opacity = '100';
updateUI(currentAccount);
inputLoginUsername.value = inputLoginPin.value = '';
inputLoginPin.blur();
if(timer) clearInterval(timer);
timer = startLogOutTimer();
}

});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
const amountTransfer = Number(inputTransferAmount.value);
const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
if(receiverAccount && amountTransfer > 0 
   && receiverAccount ?.username !== currentAccount.username
   && currentAccount.balance >= amountTransfer)
   {
currentAccount.movements.push(-amountTransfer);
receiverAccount.movements.push(amountTransfer);
updateUI(currentAccount);
inputTransferTo.value = inputTransferAmount.value ='';
} 
clearInterval(timer);
timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if(loanAmount > 0 && currentAccount.movements.some(mov => loanAmount*0.1 <= mov)) {
  setTimeout(function(){ currentAccount.movements.push(loanAmount);
  updateUI(currentAccount);
  clearInterval(timer);
  timer = startLogOutTimer();
  },3000);
  inputLoanAmount.value = '';
}
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value))
{
  const index = accounts.findIndex(acc => acc.username === currentAccount.username);
  console.log(index);
  accounts.splice(index,1);
  containerApp.style.opacity = '0';
  
}inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
e.preventDefault();  
displayMovements(currentAccount, !sorted);
sorted = !sorted;
//console.log(currentAccount)
//console.log(sorted);
});

