// =========================
// Archivo: ui.js
// Objetivo general:
// Este archivo controla todo lo visual de la app.
// Aquí se decide cómo mostrar el clima, errores,
// estados de carga y la nueva recomendación climática.
// =========================

/* ========================================
   FUNCIÓN: getWeatherIcon
   ----------------------------------------
   ¿Qué hace?
   Devuelve un ícono SVG según el código del clima.

   ¿Cuándo tocarla?
   Cuando quieras cambiar el estilo visual de los íconos.
======================================== */
function getWeatherIcon(code) {
  if ([0, 1].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="#FFD54F"/>
        <g stroke="#FFD54F" stroke-width="1.6" stroke-linecap="round">
          <line x1="12" y1="2.5" x2="12" y2="5.2"/>
          <line x1="12" y1="18.8" x2="12" y2="21.5"/>
          <line x1="2.5" y1="12" x2="5.2" y2="12"/>
          <line x1="18.8" y1="12" x2="21.5" y2="12"/>
          <line x1="5.1" y1="5.1" x2="7.1" y2="7.1"/>
          <line x1="16.9" y1="16.9" x2="18.9" y2="18.9"/>
          <line x1="16.9" y1="7.1" x2="18.9" y2="5.1"/>
          <line x1="5.1" y1="18.9" x2="7.1" y2="16.9"/>
        </g>
      </svg>
    `;
  }

  if ([2, 3, 45, 48].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#E3F2FD">
          <ellipse cx="11" cy="10" rx="5.5" ry="3.2"/>
          <ellipse cx="15.5" cy="11.5" rx="4.8" ry="2.9" opacity="0.88"/>
        </g>
      </svg>
    `;
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#CFD8E3">
          <ellipse cx="12" cy="9.5" rx="6" ry="3.3"/>
        </g>
        <g stroke="#4FC3F7" stroke-width="1.5" stroke-linecap="round">
          <line x1="8" y1="14.5" x2="7" y2="17.5"/>
          <line x1="12" y1="14.5" x2="11" y2="17.5"/>
          <line x1="16" y1="14.5" x2="15" y2="17.5"/>
        </g>
      </svg>
    `;
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#E7EDF5">
          <ellipse cx="12" cy="9.5" rx="6" ry="3.3"/>
        </g>
        <g stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round">
          <line x1="8" y1="15" x2="8" y2="18"/>
          <line x1="6.7" y1="16.5" x2="9.3" y2="16.5"/>
          <line x1="12" y1="15" x2="12" y2="18"/>
          <line x1="10.7" y1="16.5" x2="13.3" y2="16.5"/>
          <line x1="16" y1="15" x2="16" y2="18"/>
          <line x1="14.7" y1="16.5" x2="17.3" y2="16.5"/>
        </g>
      </svg>
    `;
  }

  if ([95, 96, 99].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#CFD8E3">
          <ellipse cx="12" cy="9.5" rx="6" ry="3.3"/>
        </g>
        <path d="M12 13.5L9.8 17.3H12L10.9 20.5L15 15.8H12.7L14 13.5H12Z" fill="#FFD54F"/>
      </svg>
    `;
  }

  return `
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#90CAF9"/>
    </svg>
  `;
}

/* ========================================
   FUNCIÓN: formatLocalTime
   ----------------------------------------
   ¿Qué hace?
   Convierte la zona horaria recibida en una hora local legible.
======================================== */
function formatLocalTime(timezone) {
  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone
  }).format(new Date());
}

/* ========================================
   FUNCIÓN: getWeatherLabel
   ----------------------------------------
   ¿Qué hace?
   Traduce el weather_code de la API a un texto entendible.
======================================== */
function getWeatherLabel(code) {
  if ([0].includes(code)) return "Despejado";
  if ([1, 2].includes(code)) return "Poco nublado";
  if ([3].includes(code)) return "Nublado";
  if ([45, 48].includes(code)) return "Neblina";
  if ([51, 53, 55, 56, 57].includes(code)) return "Llovizna";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Lluvia";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Nieve";
  if ([95, 96, 99].includes(code)) return "Tormenta";
  return "Variable";
}

/* ========================================
   FUNCIÓN NUEVA: getWeatherAdvice
   ----------------------------------------
   ¿Qué hace?
   Interpreta los datos del clima actual y crea recomendaciones
   útiles para el usuario.

   ¿Por qué se agregó?
   Para que la app no solo muestre datos, sino también una ayuda
   práctica basada en temperatura, viento y estado del clima.

   ¿Dónde modificarla?
   Aquí mismo, si quieres cambiar el tono de los mensajes o agregar
   nuevas reglas como humedad, UV o sensación térmica.
======================================== */
function getWeatherAdvice(data) {
  const recommendations = [];

  if (data.temperature <= 10) {
    recommendations.push("🧥 Lleva abrigo porque está heladito.");
  } else if (data.temperature >= 28) {
    recommendations.push("🧴 Usa bloqueador y toma agua, está fuerte el calor.");
  } else {
    recommendations.push("😌 Temperatura relativamente cómoda para salir.");
  }

  if (data.windspeed >= 25) {
    recommendations.push("🌬️ Ojo con el viento, podría sentirse más frío.");
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(data.weathercode)) {
    recommendations.push("☔ Lleva paraguas o chaqueta impermeable.");
  }

  if ([95, 96, 99].includes(data.weathercode)) {
    recommendations.push("⛈️ Mejor evita salir si no es necesario.");
  }

  return recommendations;
}

/* ========================================
   FUNCIÓN: showLoading
   ----------------------------------------
   ¿Qué hace?
   Muestra un estado de carga mientras la app consulta la API.
======================================== */
export function showLoading() {
  const result = document.getElementById("result");

  result.innerHTML = `
    <div class="weather-card">
      <p class="loading-text">⏳ Buscando reporte meteorológico...</p>
    </div>
  `;
}

/* ========================================
   FUNCIÓN PRINCIPAL DE RENDER: showWeather
   ----------------------------------------
   ¿Qué hace?
   Dibuja el clima actual y la recomendación climática.

   ¿Importante?
   Aquí es donde realmente se muestra la función nueva en pantalla.
   Si la recomendación no aparece, este es el primer lugar a revisar.
======================================== */
export function showWeather(data) {
  const result = document.getElementById("result");
  const icon = getWeatherIcon(data.weathercode);
  const localTime = formatLocalTime(data.timezone);
  const recommendations = getWeatherAdvice(data);

  const adviceMarkup = recommendations
    .map((item) => `<li>${item}</li>`)
    .join("");

  result.innerHTML = `
    <div class="weather-card main-weather-card">
      <h2 class="weather-city">${data.city}, ${data.country}</h2>
      <div class="weather-icon">${icon}</div>
      <p class="weather-status weather-condition">${getWeatherLabel(data.weathercode)}</p>
      <p class="weather-temp">${data.temperature}°C</p>
      <p class="weather-extra">💨 Viento: ${data.windspeed} km/h</p>
      <p class="weather-status">🕒 Hora local: ${localTime}</p>

      <div class="inline-advice-box">
        <h3 class="section-title">🌦️ Recomendación climática</h3>
        <ul class="advice-list">${adviceMarkup}</ul>
      </div>
    </div>
  `;
}

/* ========================================
   FUNCIÓN: showError
   ----------------------------------------
   ¿Qué hace?
   Muestra un mensaje cuando algo falla.
======================================== */
export function showError(message) {
  const result = document.getElementById("result");

  result.innerHTML = `
    <div class="weather-card">
      <p class="error-text">${message}</p>
    </div>
  `;
}

/* ========================================
   FUNCIÓN: renderTicker
   ----------------------------------------
   ¿Qué hace?
   Pinta la barra inferior con ciudades del mundo.
======================================== */
export function renderTicker(cities) {
  const ticker = document.getElementById("ticker");

  if (!cities?.length) {
    ticker.innerHTML = `<span class="ticker-item">🌍 No se pudieron cargar ciudades globales</span>`;
    return;
  }

  const html = cities
    .map((item) => {
      const icon = getWeatherIcon(item.weathercode);
      const localTime = formatLocalTime(item.timezone);

      return `
        <span class="ticker-item">
          <span class="ticker-mini-icon">${icon}</span>
          <span>${item.city}, ${item.country} · ${item.temperature}°C · 🕒 ${localTime}</span>
        </span>
      `;
    })
    .join("");

  ticker.innerHTML = html + html;
}
