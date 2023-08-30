const mod = 28;

function encryptMessage(message, a, b) {
  let encrypted = "";
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    if (char === " ") {
      encrypted += " ";
    } else {
      const charCode = char.charCodeAt(0) - 97;
      const encryptedCharCode = (a * charCode + b) % mod + 97;
      encrypted += String.fromCharCode(encryptedCharCode);
    }
  }
  return encrypted;
}

function modInverse(a, m) {
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) {
      return i;
    }
  }
  return -1;
}

function calculateFrequencyStats(text) {
  const frequencies = new Array(26).fill(0);
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    if (char >= "a" && char <= "z") {
      frequencies[char.charCodeAt(0) - 97]++;
    }
  }
  return frequencies;
}

const colorPalette = [
  
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#C9DE55",
  "#FF9F40",
  "#FFD700",
  "#8A2BE2",
  "#3CB371",
  "#E9967A",
  "#7B68EE",
  "#32CD32",
  "#FF4500",
  "#87CEEB",
  "#FF6347",
  "#1E90FF",
  "#DAA520",
  "#FF69B4",
  "#00FA9A",
  "#9400D3",
  "#008080",
  "#FF1493",
  "#00BFFF",
  "#FFD700",
  "#9932CC",
  "#2E8B57",
  "#FF8C00",
  "#6A5ACD",
];

function updateChart(data) {
  const frequencyChart = document.getElementById("frequencyChart").getContext("2d");

  // Filtrar letras con frecuencia mayor a cero
  const labels = [];
  const filteredData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      labels.push(String.fromCharCode(97 + i));
      filteredData.push(data[i]);
    }
  }

  new Chart(frequencyChart, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: filteredData,
          backgroundColor: colorPalette,
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const label = data.labels[tooltipItem.index];
            const value = data.datasets[0].data[tooltipItem.index];
            const letterCount = value === 1 ? "1 repetición" : `${value} repeticiones`;
            return `${label}: ${letterCount}`;
          },
        },
      },
    },
  });
}

document.getElementById("encryptButton").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value;
  const a = parseInt(document.getElementById("a").value);
  const b = parseInt(document.getElementById("b").value);
  const encryptedText = encryptMessage(inputText, a, b);
  document.getElementById("encryptedText").textContent = encryptedText;
  updateFrequencyStats(encryptedText);
});

document.getElementById("decryptButton").addEventListener("click", () => {
  const encryptedInput = document.getElementById("encryptedInput").value;
  
  const frequencies = calculateFrequencyStats(encryptedInput);
  const maxFrequencyIndex = frequencies.indexOf(Math.max(...frequencies));
  const eCharCode = maxFrequencyIndex + 97;

  const possibleSolutions = [];

  for (let a = 1; a < mod; a++) {
    const aInverse = modInverse(a, mod);
    if (aInverse !== -1) {
      for (let b = 0; b < mod; b++) {
        const decryptedText = decryptMessage(encryptedInput, a, b);
        possibleSolutions.push({ a: a, b: b, decrypted: decryptedText });
      }
    }
  }

  const decryptedResultsElement = document.getElementById("decryptedResults");
  decryptedResultsElement.innerHTML = "";

  for (let i = 0; i < Math.min(5, possibleSolutions.length); i++) {
    const solutionElement = document.createElement("p");
    const solutionText = `a = ${possibleSolutions[i].a}, b = ${possibleSolutions[i].b}: ${possibleSolutions[i].decrypted}`;
    solutionElement.textContent = solutionText;
    decryptedResultsElement.appendChild(solutionElement);
  }

  if (possibleSolutions.length > 5) {
    const readMoreButton = document.getElementById("readMoreButton");
    readMoreButton.style.display = "block";
    readMoreButton.addEventListener("click", () => {
      for (let i = 5; i < possibleSolutions.length; i++) {
        const solutionElement = document.createElement("p");
        const solutionText = `a = ${possibleSolutions[i].a}, b = ${possibleSolutions[i].b}: ${possibleSolutions[i].decrypted}`;
        solutionElement.textContent = solutionText;
        decryptedResultsElement.appendChild(solutionElement);
      }
      readMoreButton.style.display = "none";
    });
  }
  // Mostrar el análisis de frecuencia del mensaje cifrado en el gráfico de pastel
  updateFrequencyStats(encryptedInput);
});

function decryptMessage(encrypted, a, b) {
  const aInverse = modInverse(a, mod);
  let decrypted = "";
  for (let i = 0; i < encrypted.length; i++) {
    const char = encrypted[i];
    if (char === " ") {
      decrypted += " ";
    } else {
      const charCode = char.charCodeAt(0) - 97;
      const decryptedCharCode = (aInverse * (charCode - b)) % mod;
      decrypted += String.fromCharCode((decryptedCharCode + mod) % mod + 97);
    }
  }
  return decrypted;
}

// Rest of the code remains unchanged


function updateFrequencyStats(text) {
  const frequencyStats = calculateFrequencyStats(text);
  updateChart(frequencyStats);
}