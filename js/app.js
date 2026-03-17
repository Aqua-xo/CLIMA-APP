import { getWeather, getTickerCitiesWeather } from "./api.js";
import { showWeather, showError, showLoading, renderTicker } from "./ui.js";

// =========================
// Sección: referencias del DOM
// Objetivo: guardar accesos rápidos al formulario y al input
// =========================
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");

// =========================
// Función: cargar ticker global al iniciar
// Objetivo: mostrar ciudades del mundo en la barra inferior
// =========================
async function loadTicker() {
  const cities = await getTickerCitiesWeather();
  renderTicker(cities);
}

// =========================
// Evento: búsqueda de ciudad
// Objetivo: pedir y mostrar el clima de la ciudad escrita
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showError("Escribe una ciudad");
    return;
  }

  showLoading();

  try {
    const data = await getWeather(city);
    showWeather(data);
    cityInput.value = "";
  } catch (error) {
    showError(error.message);
  }
});

// =========================
// Inicio de la app
// Objetivo: cargar el ticker apenas abre la página
// =========================
loadTicker();