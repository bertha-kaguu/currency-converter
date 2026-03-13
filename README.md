# Currency Converter 💱

A modern **web-based currency converter** that provides real-time exchange rates, interactive charts, forex market insights, and a dynamic currency heatmap. The application allows users to convert currencies instantly while visualizing market trends and movements.

---

## 🚀 Features

### 💰 Real-Time Currency Conversion

* Convert between **150+ global currencies** using live exchange rates.
* Powered by the ExchangeRate API for reliable and accurate data.
* Instant conversion with a clean and intuitive interface.

### 🔎 Searchable Currency Selection

* Quickly find currencies using **searchable dropdown inputs**.
* Flags automatically update based on the selected currency.

### 🔄 Currency Swap

* Swap **From** and **To** currencies instantly with a single button.

### 📜 Conversion History

* Stores the last **10 conversions** in local storage.
* Easily clear history with the **Clear History** button.

### 📊 Currency Pair Trend Chart

* Displays exchange rate trends using **Chart.js**.
* Select a pair (e.g., USD/KES, USD/EUR) to view rate changes over time.
* Automatically updates after conversions or currency swaps.

### 📈 Live Forex Ticker

* Displays continuously scrolling **live forex rates**.
* Updates automatically every few seconds.

### 🏆 Top Movers

* Shows the currencies with the **largest changes against USD**.

### 🌍 Currency Heatmap

* Visual heatmap displaying relative currency strength.
* Color-coded indicators:

  * 🔴 Weak currencies
  * 🟡 Neutral currencies
  * 🟢 Strong currencies
* Clicking a currency in the heatmap automatically selects it in the converter.
* Includes country flags for quick recognition.

### 🌙 Dark Mode

* Toggle between light and dark interface styles.

---

## 🛠 Technologies Used

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla JS)**
* **Chart.js** for trend visualization
* **ExchangeRate API** for live forex data
* **FlagsAPI** for country flags
* **LocalStorage** for saving conversion history

---

## 📂 Project Structure

```
currency-converter/
│
├── index.html      # Main webpage structure
├── style.css       # Application styling
├── script.js       # Application logic and API calls
└── README.md       # Project documentation
```

---

## ⚙️ How It Works

1. User enters an amount.
2. Selects the **From** and **To** currencies.
3. Clicks **Convert**.
4. The app fetches live rates from the API.
5. Converted result appears instantly.
6. The conversion is stored in history.
7. The chart updates to show the selected currency pair trend.

---

## 🌐 APIs Used

### Exchange Rate API

Provides real-time currency exchange rates.

```
https://www.exchangerate-api.com
```

### Flags API

Used to display country flags for currencies.

```
https://flagsapi.com
```

🔹 Demo

You can see it live here

https://bertha-kaguu.github.io/currency-converter/

👨‍💻 Author

Created by Ash

Developed as a **frontend project to practice API integration, data visualization, and modern UI design**.

---

⭐ If you like this project, consider starring the repository!
