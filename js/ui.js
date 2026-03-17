// =========================
// Función: obtener icono según weather code
// Objetivo: reemplazar emojis por iconos SVG más modernos
// Aquí puedes cambiar: diseño visual de cada clima
// =========================
function getWeatherIcon(code) {
  // Despejado
  if (code === 0) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="#FFD54F"/>
        <g stroke="#FFD54F" stroke-width="1.6" stroke-linecap="round">
          <line x1="12" y1="2.5" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="21.5"/>
          <line x1="2.5" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="21.5" y2="12"/>
          <line x1="5.2" y1="5.2" x2="6.9" y2="6.9"/>
          <line x1="17.1" y1="17.1" x2="18.8" y2="18.8"/>
          <line x1="17.1" y1="6.9" x2="18.8" y2="5.2"/>
          <line x1="5.2" y1="18.8" x2="6.9" y2="17.1"/>
        </g>
      </svg>
    `;
  }

  // Parcialmente nublado
  if ([1, 2, 3].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="4" fill="#FFD54F"/>
        <g fill="#F4F7FB">
          <ellipse cx="14" cy="14" rx="5.5" ry="3.4"/>
          <ellipse cx="10.8" cy="14.2" rx="3.5" ry="2.8"/>
          <ellipse cx="17.5" cy="14.3" rx="3.2" ry="2.5"/>
        </g>
      </svg>
    `;
  }

  // Niebla
  if ([45, 48].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#DCE3EA">
          <ellipse cx="12" cy="9" rx="5.8" ry="3.2"/>
        </g>
        <g stroke="#DCE3EA" stroke-width="1.5" stroke-linecap="round">
          <line x1="5" y1="15" x2="19" y2="15"/>
          <line x1="7" y1="18" x2="17" y2="18"/>
        </g>
      </svg>
    `;
  }

  // Llovizna / lluvia
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return `
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#D7E1EA">
          <ellipse cx="12" cy="9.5" rx="6" ry="3.3"/>
          <ellipse cx="8.7" cy="9.8" rx="3.4" ry="2.5"/>
          <ellipse cx="15.8" cy="9.8" rx="3.6" ry="2.6"/>
        </g>
        <g stroke="#4FC3F7" stroke-width="1.8" stroke-linecap="round">
          <line x1="8" y1="14.5" x2="7.3" y2="18"/>
          <line x1="12" y1="14.5" x2="11.3" y2="18"/>
          <line x1="16" y1="14.5" x2="15.3" y2="18"/>
        </g>
      </svg>
    `;
  }

  // Nieve
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

  // Tormenta
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

  // Default
  return `
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#90CAF9"/>
    </svg>
  `;
}

// =========================
// Función: formatear hora local
// Objetivo: mostrar la hora según la zona horaria de cada ciudad
// Aquí puedes cambiar: idioma o formato de hora
// =========================
function formatLocalTime(timezone) {
  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone
  }).format(new Date());
}

// =========================
// Función: mostrar estado de carga
// Objetivo: dar feedback mientras llega la API
// Aquí puedes cambiar: texto de carga
// =========================
export function showLoading() {
  const result = document.getElementById("result");

  result.innerHTML = `
    <div class="weather-card">
      <p class="loading-text">⏳ Buscando reporte meteorológico...</p>
    </div>
  `;
}

// =========================
// Función: mostrar clima principal
// Objetivo: renderizar la ciudad buscada en la tarjeta principal
// Aquí puedes cambiar: estructura visual, orden de datos, textos
// =========================
export function showWeather(data) {
  const result = document.getElementById("result");
  const icon = getWeatherIcon(data.weathercode);
  const localTime = formatLocalTime(data.timezone);

  result.innerHTML = `
    <div class="weather-card">
      <h2 class="weather-city">${data.city}, ${data.country}</h2>
      <div class="weather-icon">${icon}</div>
      <p class="weather-temp">${data.temperature}°C</p>
      <p class="weather-extra">💨 Viento: ${data.windspeed} km/h</p>
      <p class="weather-status">🕒 Hora local: ${localTime}</p>
    </div>
  `;
}

// =========================
// Función: mostrar error
// Objetivo: avisar cuando algo falla o no se encuentra la ciudad
// Aquí puedes cambiar: texto o estilo del mensaje
// =========================
export function showError(message) {
  const result = document.getElementById("result");

  result.innerHTML = `
    <div class="weather-card">
      <p class="error-text">${message}</p>
    </div>
  `;
}

// =========================
// Función: renderizar ticker global
// Objetivo: mostrar varias ciudades con temperatura y hora
// Aquí puedes cambiar: formato del texto, separadores, estilo
// =========================
export function renderTicker(cities) {
  const ticker = document.getElementById("ticker");

  if (!cities || cities.length === 0) {
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