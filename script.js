'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const printMove = function (movements, short = false) {
  const movs = short ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>;`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

function upadate(acc) {
  printMove(acc.movements);
  displyBalance(acc);
  displaySummary(acc);
}

const createUsername = function (accs) {
  accs.forEach(function (user) {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(un => un[0])
      .join('');
  });
};
createUsername(accounts);

const displyBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cal) => acc + cal, 0);
  labelBalance.textContent = acc.balance;
};

//console.log(movements.reduce((acc, mov) => (acc > mov ? acc : mov)));

const displaySummary = function (mov) {
  const income = mov.movements
    .filter(mo => mo > 0)
    .reduce((acc, cal) => acc + cal);
  const out = mov.movements
    .filter(mo => mo < 0)
    .reduce((acc, cal) => acc + cal);
  const interest = mov.movements
    .filter(mo => mo > 0)
    .map(dp => (dp * mov.interestRate) / 100)
    .reduce((acc, cal) => acc + cal);
  labelSumIn.textContent = income;
  labelSumOut.textContent = out;
  labelSumInterest.textContent = interest;
};

let currentAcc;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //const un = inputLoginUsername.value;
  //console.log(currentAcc);
  //console.log(inputLoginPin.value, un);

  /*function findUsername() {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].username === un) {
        console.log(accounts[i].owner);
        return accounts[i];
      }
    }
  }*/

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  // currentAcc = findUsername();
  console.log(currentAcc);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome ,${currentAcc.owner}`;
    containerApp.style.opacity = 100;
    upadate(currentAcc);
    inputLoginPin.value = inputLoginUsername.value = ' ';
    inputLoginPin.blur();
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = inputTransferAmount.value;
  let transferAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount < currentAcc.balance &&
    transferAcc &&
    currentAcc.username != inputTransferTo.value
  ) {
    transferAcc.movements.push(Number(amount));
    currentAcc.movements.push(-Number(amount));
    upadate(currentAcc);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAcc.username === inputClose.value &&
    currentAcc.pin == Number(inputClosePin.value)
  ) {
    const i = accounts.findIndex(acc => acc.username === inputClosePin.value);
    accounts.splice(i, 1);
  }
  containerApp.style.opacity = 0;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(acc => acc >= amount * 0.1)) {
    currentAcc.movements.push(amount);
  }
  upadate(currentAcc);
});
let state = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  printMove(currentAcc.movements, !state);
  state = !state;
  //upadate(currentAcc);
});
