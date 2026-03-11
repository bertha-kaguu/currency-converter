const API_KEY="5e281ff06b399c80c566015c"

const amount=document.getElementById("amount")
const fromCurrency=document.getElementById("fromCurrency")
const toCurrency=document.getElementById("toCurrency")
const result=document.getElementById("result")
const convertBtn=document.getElementById("convertBtn")
const swapBtn=document.getElementById("swapBtn")
const search=document.getElementById("searchCurrency")

const fromFlag=document.getElementById("fromFlag")
const toFlag=document.getElementById("toFlag")

const historyList=document.getElementById("historyList")

const themeToggle=document.getElementById("themeToggle")
const tickerContent = document.getElementById("tickerContent");
const popularCurrencies = ["USD","EUR","GBP","KES","JPY","AUD","CAD"];

async function updateTicker(){
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();
    let html = "";
    popularCurrencies.forEach(cur=>{
        const rate = data.conversion_rates[cur].toFixed(2);
        html += `<span>USD → ${cur}: ${rate} &nbsp;&nbsp;|&nbsp;&nbsp; </span>`;
    });
    tickerContent.innerHTML = html;
}

// Update every 10 seconds
updateTicker();
setInterval(updateTicker,10000);

let chart

async function loadCurrencies(){

const res=await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`)

const data=await res.json()

const currencies=data.supported_codes

currencies.forEach(currency=>{

const code=currency[0]

let option1=document.createElement("option")
let option2=document.createElement("option")

option1.value=code
option1.text=code

option2.value=code
option2.text=code

fromCurrency.appendChild(option1)
toCurrency.appendChild(option2)

})

fromCurrency.value="USD"
toCurrency.value="KES"

updateFlags()

}

loadCurrencies()

function updateFlags(){

const from=fromCurrency.value.slice(0,2)
const to=toCurrency.value.slice(0,2)

fromFlag.src=`https://flagsapi.com/${from}/flat/32.png`
toFlag.src=`https://flagsapi.com/${to}/flat/32.png`

}

fromCurrency.addEventListener("change",updateFlags)
toCurrency.addEventListener("change",updateFlags)

swapBtn.addEventListener("click",()=>{

let temp=fromCurrency.value
fromCurrency.value=toCurrency.value
toCurrency.value=temp

updateFlags()

})

convertBtn.addEventListener("click",convertCurrency)

amount.addEventListener("input",convertCurrency)

async function convertCurrency(){

if(amount.value==="")return

const url=`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`

const res=await fetch(url)

const data=await res.json()

const rate=data.conversion_rates[toCurrency.value]

const converted=(amount.value*rate).toFixed(2)

result.innerText=`${amount.value} ${fromCurrency.value} = ${converted} ${toCurrency.value}`

saveHistory(result.innerText)

loadChart(rate)

}

function saveHistory(text){

let history=JSON.parse(localStorage.getItem("history"))||[]

history.unshift(text)

history=history.slice(0,5)

localStorage.setItem("history",JSON.stringify(history))

displayHistory()

}

function displayHistory(){

let history=JSON.parse(localStorage.getItem("history"))||[]

historyList.innerHTML=""

history.forEach(item=>{

let li=document.createElement("li")

li.textContent=item

historyList.appendChild(li)

})

}

displayHistory()

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark")

})

search.addEventListener("input",()=>{

let filter=search.value.toUpperCase()

let options=fromCurrency.options

for(let i=0;i<options.length;i++){

let txt=options[i].text

options[i].style.display=txt.includes(filter)?"":"none"

}

})

function loadChart(rate){

const ctx=document.getElementById("trendChart")

const data=[rate*0.95,rate*0.98,rate*1.02,rate]

const labels=["3 days ago","2 days ago","Yesterday","Today"]

if(chart)chart.destroy()

chart=new Chart(ctx,{

type:"line",

data:{

labels:labels,

datasets:[{

label:"Exchange Rate Trend",

data:data,

fill:false,

tension:0.3

}]

}

})

}