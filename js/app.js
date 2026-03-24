// =========================
// Archivo: app.js
// Objetivo general:
// Este archivo conecta toda la app.
// - escucha el formulario
// - llama a la API
// - manda los datos a la interfaz
// =========================

import { getWeather, getTickerCitiesWeather } from "./api.js";
import { renderTicker, showError, showLoading, showWeather } from "./ui.js";

// ========================================
// BLOQUE: referencias del DOM
// ----------------------------------------
// Aquí tomamos los elementos HTML que vamos a usar.
// Si cambia el id en index.html, se debe actualizar aquí también.
// ========================================
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");

// ========================================
// FUNCIÓN: loadTicker
// ----------------------------------------
// Carga el ticker inferior con varias ciudades.
// Esto se ejecuta una vez al iniciar la app.
// ========================================
async function loadTicker() {
  try {
    const cities = await getTickerCitiesWeather();
    renderTicker(cities);
  } catch {
    renderTicker([]);
  }
}

// ========================================
// FUNCIÓN PRINCIPAL: handleWeatherSearch
// ----------------------------------------
// Este es el flujo principal de la app:
// 1. toma la ciudad escrita por el usuario
// 2. muestra el estado de carga
// 3. pide el clima a la API
// 4. renderiza el resultado en pantalla
// ========================================
async function handleWeatherSearch(event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showError("Escribe una ciudad");
    return;
  }

  showLoading();

  try {
    const weather = await getWeather(city);
    showWeather(weather);
    cityInput.value = "";
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message);
      return;
    }

    showError("Ocurrió un error inesperado");
  }
}

// ========================================
// BLOQUE: eventos e inicio
// ----------------------------------------
// Conecta el submit del formulario y luego inicia el ticker.
// ========================================
form.addEventListener("submit", handleWeatherSearch);
loadTicker();
