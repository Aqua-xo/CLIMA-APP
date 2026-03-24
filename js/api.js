// =========================
// Archivo: api.js
// Objetivo:
// Centralizar toda la comunicación con Open-Meteo.
// =========================

const CACHE_DURATION_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "clima-app-cache";
const memoryCache = new Map();

const SANTIAGO_CHILE = {
  latitude: -33.4489,
  longitude: -70.6693,
  name: "Santiago",
  country: "Chile",
  timezone: "America/Santiago"
};

const TICKER_CITIES = [
  { label: "Santiago", query: "Santiago", countryCode: "CL" },
  { label: "Madrid", query: "Madrid", countryCode: "ES" },
  { label: "Buenos Aires", query: "Buenos Aires", countryCode: "AR" },
  { label: "Tokyo", query: "Tokyo", countryCode: "JP" },
  { label: "London", query: "London", countryCode: "GB" }
];

function isSantiagoChile(city) {
  const normalizedCity = city.trim().toLowerCase();
  return ["santiago", "santiago de chile", "santiago, chile"].includes(normalizedCity);
}

function getStorage() {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

function buildCacheKey(type, city) {
  return `${CACHE_PREFIX}:${type}:${city.trim().toLowerCase()}`;
}

function removeCacheKey(key) {
  const storage = getStorage();

  if (storage) {
    storage.removeItem(key);
    return;
  }

  memoryCache.delete(key);
}

function getCachedData(key) {
  const storage = getStorage();
  const rawValue = storage ? storage.getItem(key) : memoryCache.get(key) || null;

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION_MS;

    if (isExpired) {
      removeCacheKey(key);
      return null;
    }

    return parsed.data;
  } catch {
    removeCacheKey(key);
    return null;
  }
}

function setCachedData(key, data) {
  const payload = JSON.stringify({
    timestamp: Date.now(),
    data
  });

  const storage = getStorage();

  if (storage) {
    storage.setItem(key, payload);
    return;
  }

  memoryCache.set(key, payload);
}

async function fetchJson(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

async function fetchCoordinates(city) {
  const cleanCity = city.trim();

  if (!cleanCity) {
    throw new Error("Debes escribir una ciudad");
  }

  if (isSantiagoChile(cleanCity)) {
    return SANTIAGO_CHILE;
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=es`;
  const geoData = await fetchJson(geoUrl, "No se pudo buscar la ciudad");

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Ciudad no encontrada");
  }

  return geoData.results[0];
}

async function fetchCurrentWeather(place) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${place.latitude}` +
    `&longitude=${place.longitude}` +
    `&current=temperature_2m,wind_speed_10m,weather_code` +
    `&timezone=auto`;

  const weatherData = await fetchJson(weatherUrl, "No se pudo obtener el clima");

  if (!weatherData.current) {
    throw new Error("La API no devolvió datos del clima");
  }

  return {
    city: place.name,
    country: place.country || "Sin país",
    timezone: place.timezone || weatherData.timezone || "UTC",
    temperature: weatherData.current.temperature_2m,
    windspeed: weatherData.current.wind_speed_10m,
    weathercode: weatherData.current.weather_code,
    time: weatherData.current.time
  };
}

async function getWeatherFromPlace(place) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${place.latitude}` +
    `&longitude=${place.longitude}` +
    `&current=temperature_2m,weather_code` +
    `&timezone=auto`;

  const weatherData = await fetchJson(weatherUrl, "No se pudo obtener el clima del ticker");

  if (!weatherData.current) {
    return null;
  }

  return {
    city: place.name,
    country: place.country || "Sin país",
    timezone: place.timezone || weatherData.timezone || "UTC",
    temperature: weatherData.current.temperature_2m,
    weathercode: weatherData.current.weather_code
  };
}

export async function getWeather(city) {
  const cacheKey = buildCacheKey("current", city);
  const cached = getCachedData(cacheKey);

  if (cached) {
    return cached;
  }

  const place = await fetchCoordinates(city);
  const weather = await fetchCurrentWeather(place);

  setCachedData(cacheKey, weather);
  return weather;
}

export async function getTickerCitiesWeather() {
  const results = await Promise.all(
    TICKER_CITIES.map(async (item) => {
      try {
        const place = item.label === "Santiago"
          ? SANTIAGO_CHILE
          : await fetchCoordinates(`${item.query}`);

        return await getWeatherFromPlace(place);
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean);
}
