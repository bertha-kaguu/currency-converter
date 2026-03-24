const amount = document.getElementById("amount");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const historyList = document.getElementById("historyList");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const themeToggle = document.getElementById("themeToggle");
const tickerContent = document.getElementById("tickerContent");
const moversList = document.getElementById("moversList");
const heatmapContainer = document.getElementById("heatmapContainer");
const pairSelect = document.getElementById("pairSelect");
const clearHistoryBtn = document.getElementById("clearHistory");

const fromCurrencySearch = document.getElementById("fromCurrencySearch");
const toCurrencySearch = document.getElementById("toCurrencySearch");
const fromCurrencyList = document.getElementById("fromCurrencyList");
const toCurrencyList = document.getElementById("toCurrencyList");

// Hidden selects for internal use
const fromCurrency = document.createElement("select");
const toCurrency = document.createElement("select");

let chart;

// ======================= Load Currencies ===========================
async function loadCurrencies() {
    try {
        const res = await fetch(`http://localhost:3000/api/rates/USD`);
        const data = await res.json();

        if (!data.conversion_rates) {
            console.error("API failed:", data);
            alert("Backend/API not working. Check server.");
            return;
        }

        const currencies = Object.keys(data.conversion_rates);

        currencies.forEach(code => {
            const opt1 = document.createElement("option");
            opt1.value = code;
            fromCurrency.appendChild(opt1);

            const opt2 = document.createElement("option");
            opt2.value = code;
            toCurrency.appendChild(opt2);
        });

        populateCurrencyList(currencies);

        fromCurrency.value = "USD";
        toCurrency.value = "KES";

        fromCurrencySearch.value = "USD";
        toCurrencySearch.value = "KES";

        updateFlags();
        loadChart();
        updateTicker();
        updateMovers();
        updateHeatmap();

    } catch (err) {
        console.error("Load currencies error:", err);
    }
}
loadCurrencies();

function populateCurrencyList(currencies) {
    fromCurrencyList.innerHTML = "";
    toCurrencyList.innerHTML = "";

    currencies.forEach(cur => {
        const div1 = document.createElement("div");
        div1.textContent = cur;
        div1.addEventListener("click", () => {
            fromCurrency.value = cur;
            fromCurrencySearch.value = cur;
        
            pairSelect.value = `${cur}_${toCurrency.value}`;
        
            fromCurrencyList.style.display = "none";
        
            updateFlags();
            loadChart();
        });
        fromCurrencyList.appendChild(div1);

        const div2 = document.createElement("div");
        div2.textContent = cur;
        div2.addEventListener("click", () => {
            toCurrency.value = cur;
            toCurrencySearch.value = cur;
        
            pairSelect.value = `${fromCurrency.value}_${cur}`;
        
            toCurrencyList.style.display = "none";
        
            updateFlags();
            loadChart();
        });
        toCurrencyList.appendChild(div2);
    });
}

// ======================= Update Flags ===========================
function updateFlags() {
    fromFlag.src = `https://flagsapi.com/${fromCurrency.value.slice(0, 2)}/flat/32.png`;
    toFlag.src = `https://flagsapi.com/${toCurrency.value.slice(0, 2)}/flat/32.png`;
}

fromCurrencySearch.addEventListener("change", () => {
    fromCurrency.value = fromCurrencySearch.value.toUpperCase();
    updateFlags();
});

toCurrencySearch.addEventListener("change", () => {
    toCurrency.value = toCurrencySearch.value.toUpperCase();
    updateFlags();
});

fromCurrencySearch.addEventListener("blur", () => {
    if (!Array.from(fromCurrency.options).some(opt => opt.value === fromCurrencySearch.value)) {
        fromCurrencySearch.value = fromCurrency.value;
    }
});

document.addEventListener("click", (e) => {
    if (!fromCurrencySearch.contains(e.target)) fromCurrencyList.style.display = "none";
    if (!toCurrencySearch.contains(e.target)) toCurrencyList.style.display = "none";
});

// ======================= Swap Button ===========================
swapBtn.addEventListener("click", () => {

    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    fromCurrencySearch.value = fromCurrency.value;
    toCurrencySearch.value = toCurrency.value;

    pairSelect.value = `${fromCurrency.value}_${toCurrency.value}`;

    updateFlags();

    // refresh everything
    loadChart();
    updateTicker();
    updateMovers();
    updateHeatmap();
});

fromCurrencySearch.addEventListener("blur", () => {
    if (!fromCurrency.value) {
        fromCurrency.value = "USD";
        fromCurrencySearch.value = "USD";
    }
});

toCurrencySearch.addEventListener("blur", () => {
    if (!toCurrency.value) {
        toCurrency.value = "KES";
        toCurrencySearch.value = "KES";
    }
});

// ======================= Conversion ===========================
convertBtn.addEventListener("click", convertCurrency);

async function convertCurrency() {
    try {
        const amountValue = parseFloat(amount.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        if (!amountValue || amountValue <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const res = await fetch(`http://localhost:3000/api/rates/${from}`);
        const data = await res.json();
        if (!data.conversion_rates) throw new Error("Exchange rates not found");

        const rate = data.conversion_rates[to];
        if (!rate) throw new Error("Currency rate unavailable");

        const convertedAmount = (amountValue * rate).toFixed(2);
        document.getElementById("result").innerText = `${amountValue} ${from} = ${convertedAmount} ${to}`;

        addToHistory(`${amountValue} ${from} → ${convertedAmount} ${to}`);

// update pair selector automatically
pairSelect.value = `${from}_${to}`;

loadChart();
    } catch (e) {
        console.error(e);
        alert("Failed to fetch exchange rate. Try again.");
    }
}

// ======================= History ===========================
function addToHistory(text) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.unshift(text);
    history = history.slice(0, 10);
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}
displayHistory();

clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
    localStorage.removeItem("history");
});

// ======================= Theme Toggle ===========================
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ======================= Live Ticker ===========================
const popularCurrencies = ["USD", "EUR", "GBP", "KES", "JPY", "AUD", "CAD"];

async function updateTicker() {
    const res = await fetch(`http://localhost:3000/api/rates/${fromCurrency.value}`);
    const data = await res.json();
    let html = "";
    popularCurrencies.forEach(cur => {
        const rate = data.conversion_rates[cur].toFixed(2);
        html += `<span>USD → ${cur}: ${rate} &nbsp;&nbsp;|&nbsp;&nbsp; </span>`;
    });
    tickerContent.innerHTML = html;
}
updateTicker();
setInterval(updateTicker, 10000);

// ======================= Top Movers ===========================
async function updateMovers() {
    const res = await fetch(`http://localhost:3000/api/rates/${fromCurrency.value}`);
    const data = await res.json();
    const rates = data.conversion_rates;

    let changes = [];
    for (let cur in rates) {
        let prev = rates[cur] * (1 + (Math.random() - 0.5) / 10);
        let change = ((rates[cur] - prev) / prev * 100).toFixed(2);
        changes.push({ cur, change });
    }
    changes.sort((a, b) => b.change - a.change);

    moversList.innerHTML = "";
    changes.slice(0, 5).forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.cur}: ${item.change}%`;
        moversList.appendChild(li);
    });
}
updateMovers();
setInterval(updateMovers, 15000);

// ======================= Heatmap ===========================
async function updateHeatmap() {
    const res = await fetch(`http://localhost:3000/api/rates/${fromCurrency.value}`);
    const data = await res.json();
    const rates = data.conversion_rates;
    const sortedRates = Object.entries(rates).sort((a, b) => b[1] - a[1]);
    const values = sortedRates.map(item => item[1]);
    const min = Math.min(...values);
    const max = Math.max(...values);

    heatmapContainer.innerHTML = "";
    sortedRates.forEach(([cur, val]) => {
        let ratio = (val - min) / (max - min);
        let r = Math.floor(255 * (1 - ratio));
        let g = Math.floor(255 * ratio);
        let color = `rgba(${r},${g},50,0.8)`;

        let div = document.createElement("div");
        div.style.background = color;
        div.innerHTML = `
        <img src="https://flagsapi.com/${cur.slice(0,2)}/flat/24.png">
        <br>
        ${cur}: ${val}
        `;

// when clicked, use it as the "TO" currency
        div.addEventListener("click", () => {

        toCurrency.value = cur
        toCurrencySearch.value = cur

    // update pair dropdown
        pairSelect.value = `${fromCurrency.value}_${cur}`

        updateFlags()
        loadChart()

})

heatmapContainer.appendChild(div)
    });
}
updateHeatmap();
setInterval(updateHeatmap, 20000);

// ======================= Chart ===========================
async function loadChart() {
    if (!pairSelect.value) return; // ✅ prevent crash

    const pair = pairSelect.value.split("_");

    if (pair.length < 2) return; // ✅ safety

    const base = pair[0];
    const target = pair[1];

    try {
        const res = await fetch(`http://localhost:3000/api/rates/${base}`);
        const data = await res.json();

        if (!data.conversion_rates || !data.conversion_rates[target]) return;

        const rate = data.conversion_rates[target];

        const history = [rate * 0.95, rate * 0.97, rate * 0.99, rate];

        const ctx = document.getElementById("trendChart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["3 days ago", "2 days ago", "Yesterday", "Today"],
                datasets: [{
                    label: `${base}/${target}`,
                    data: history,
                    borderWidth: 2,
                    tension: 0.3
                }]
            }
        });

    } catch (err) {
        console.error("Chart error:", err);
    }
}
pairSelect.addEventListener("change", loadChart);