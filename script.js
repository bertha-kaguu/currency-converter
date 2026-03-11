const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");
const swapBtn = document.getElementById("swapBtn");

const API_KEY = "https://v6.exchangerate-api.com/v6/5e281ff06b399c80c566015c/latest/USD";

const currencies = [
"USD","EUR","GBP","KES","JPY","AUD","CAD","CHF","CNY","INR",
"NZD","SGD","ZAR","HKD","KRW","SEK","NOK","DKK"
];

function populateCurrencies(){

currencies.forEach(currency =>{

let option1 = document.createElement("option");
let option2 = document.createElement("option");

option1.value = currency;
option1.textContent = currency;

option2.value = currency;
option2.textContent = currency;

fromCurrency.appendChild(option1);
toCurrency.appendChild(option2);

});

fromCurrency.value = "USD";
toCurrency.value = "KES";

}

populateCurrencies();


convertBtn.addEventListener("click", convertCurrency);

amount.addEventListener("input", convertCurrency);


swapBtn.addEventListener("click", ()=>{

let temp = fromCurrency.value;
fromCurrency.value = toCurrency.value;
toCurrency.value = temp;

convertCurrency();

});


async function convertCurrency(){

if(amount.value === ""){

result.innerText = "Enter an amount";
return;

}

let url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`;

try{

let response = await fetch(url);

let data = await response.json();

let rate = data.conversion_rates[toCurrency.value];

let convertedAmount = (amount.value * rate).toFixed(2);

result.innerText =
`${amount.value} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;

}

catch(error){

result.innerText = "Failed to fetch exchange rate";

}

}