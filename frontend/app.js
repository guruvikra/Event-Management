// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// State
let timezones = [];

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

async function initializeApp() {
  await loadTimezones();
  setupEventListeners();
  loadCurrentTimes();
  setDefaultDateTime();
}

// Set default datetime to current time
function setDefaultDateTime() {
  const now = new Date();
  const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  document.getElementById("utc-datetime").value = localISOTime;
  document.getElementById("local-datetime").value = localISOTime;
}

// Load timezones from API
async function loadTimezones() {
  try {
    const response = await fetch(`${API_BASE_URL}/timezones`);
    const data = await response.json();

    if (data.success) {
      timezones = data.data;
      populateTimezoneSelects();
    } else {
      showError("Failed to load timezones");
    }
  } catch (error) {
    console.error("Error loading timezones:", error);
    showError(
      "Failed to connect to server. Make sure the backend is running on port 3000."
    );
  }
}

// Populate timezone select dropdowns
function populateTimezoneSelects() {
  const timezoneSelect = document.getElementById("timezone-select");
  const sourceTimezoneSelect = document.getElementById(
    "source-timezone-select"
  );

  const options = timezones
    .map((tz) => `<option value="${tz.id}">${tz.label} (${tz.offset})</option>`)
    .join("");

  timezoneSelect.innerHTML = `<option value="">Select a timezone...</option>${options}`;
  sourceTimezoneSelect.innerHTML = `<option value="">Select a timezone...</option>${options}`;

  // Set default selections
  timezoneSelect.value = "America/New_York";
  sourceTimezoneSelect.value = "America/New_York";
}

// Setup event listeners
function setupEventListeners() {
  document
    .getElementById("convert-btn")
    .addEventListener("click", convertUTCToTimezone);
  document
    .getElementById("reverse-convert-btn")
    .addEventListener("click", convertTimezoneToUTC);
  document
    .getElementById("refresh-times")
    .addEventListener("click", loadCurrentTimes);
  document.getElementById("clear-result").addEventListener("click", () => {
    document.getElementById("result-container").classList.add("hidden");
  });
  document
    .getElementById("clear-reverse-result")
    .addEventListener("click", () => {
      document
        .getElementById("reverse-result-container")
        .classList.add("hidden");
    });
}

// Convert UTC to Timezone
async function convertUTCToTimezone() {
  const utcDateTime = document.getElementById("utc-datetime").value;
  const timezone = document.getElementById("timezone-select").value;

  if (!utcDateTime) {
    showError("Please select a UTC date and time");
    return;
  }

  if (!timezone) {
    showError("Please select a target timezone");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/timezones/convert/utc-to-timezone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utcDateTime: new Date(utcDateTime).toISOString(),
          timezone: timezone,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      displayConversionResult(data.data);
    } else {
      showError(data.error);
    }
  } catch (error) {
    console.error("Error converting time:", error);
    showError("Failed to convert time");
  }
}

// Convert Timezone to UTC
async function convertTimezoneToUTC() {
  const localDateTime = document.getElementById("local-datetime").value;
  const timezone = document.getElementById("source-timezone-select").value;

  if (!localDateTime) {
    showError("Please select a local date and time");
    return;
  }

  if (!timezone) {
    showError("Please select a source timezone");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/timezones/convert/timezone-to-utc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          localDateTime: localDateTime,
          timezone: timezone,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      displayReverseConversionResult(data.data);
    } else {
      showError(data.error);
    }
  } catch (error) {
    console.error("Error converting time:", error);
    showError("Failed to convert time");
  }
}

// Display conversion result
function displayConversionResult(result) {
  const resultContainer = document.getElementById("result-container");
  const resultContent = document.getElementById("result-content");

  resultContent.innerHTML = `
    <div class="result-item">
      <span class="result-label">Timezone</span>
      <span class="result-value">${result.timezoneLabel}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Converted Time</span>
      <span class="result-value highlight">${result.display}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Abbreviation</span>
      <span class="result-value">${result.abbreviation}</span>
    </div>
    <div class="result-item">
      <span class="result-label">UTC Offset</span>
      <span class="result-value">${result.offset}</span>
    </div>
    <div class="result-item">
      <span class="result-label">ISO Format</span>
      <span class="result-value">${result.datetime}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Timestamp</span>
      <span class="result-value">${result.timestamp}</span>
    </div>
  `;

  resultContainer.classList.remove("hidden");
}

// Display reverse conversion result
function displayReverseConversionResult(result) {
  const resultContainer = document.getElementById("reverse-result-container");
  const resultContent = document.getElementById("reverse-result-content");

  resultContent.innerHTML = `
    <div class="result-item">
      <span class="result-label">Source Timezone</span>
      <span class="result-value">${result.sourceTimezoneLabel}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Local Time</span>
      <span class="result-value">${new Date(
        result.local
      ).toLocaleString()}</span>
    </div>
    <div class="result-item">
      <span class="result-label">UTC Time</span>
      <span class="result-value highlight">${result.utcFormatted}</span>
    </div>
    <div class="result-item">
      <span class="result-label">ISO Format</span>
      <span class="result-value">${result.utc}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Timestamp</span>
      <span class="result-value">${result.timestamp}</span>
    </div>
  `;

  resultContainer.classList.remove("hidden");
}

// Load current times
async function loadCurrentTimes() {
  const grid = document.getElementById("current-times-grid");
  grid.innerHTML = '<div class="loading">Loading current times...</div>';

  try {
    const response = await fetch(`${API_BASE_URL}/timezones/current`);
    const data = await response.json();

    if (data.success) {
      displayCurrentTimes(data.data);
    } else {
      showError("Failed to load current times");
    }
  } catch (error) {
    console.error("Error loading current times:", error);
    grid.innerHTML =
      '<div class="loading">Failed to load current times. Make sure the backend is running.</div>';
  }
}

// Display current times
function displayCurrentTimes(times) {
  const grid = document.getElementById("current-times-grid");

  const timeCards = times
    .map(
      (time) => `
    <div class="time-card" onclick="selectTimezone('${time.timezone}')">
      <div class="time-card-header">
        <span class="time-zone-name">${time.timezoneLabel}</span>
        <span class="time-zone-abbr">${time.abbreviation}</span>
      </div>
      <div class="time-display">${new Date(time.datetime).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )}</div>
      <div class="date-display">${new Date(time.datetime).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )}</div>
      <div class="time-offset">UTC ${time.offset}</div>
    </div>
  `
    )
    .join("");

  grid.innerHTML = timeCards;
}

// Select timezone from current times
function selectTimezone(timezoneId) {
  document.getElementById("timezone-select").value = timezoneId;
  document
    .getElementById("timezone-select")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

// Show error message
function showError(message) {
  alert(message);
}
