// =========================
// Función: obtener clima de una ciudad
// Objetivo: buscar coordenadas y luego pedir clima actual
// Nota: Open-Meteo usa geocoding por nombre y forecast con current
// Aquí puedes cambiar: reglas especiales para ciudades ambiguas
// =========================
export async function getWeather(city) {
  const cleanCity = city.trim();
  const normalized = cleanCity.toLowerCase();

  // =========================
  // Sección: reglas para búsquedas ambiguas
  // Objetivo: ayudar con ciudades como Santiago
  // Aquí puedes agregar más casos si alguna ciudad se confunde mucho
  // =========================
  let geoUrl = "";

  if (
    normalized === "santiago" ||
    normalized === "santiago de chile" ||
    normalized === "santiago, chile"
  ) {
    geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent("Santiago")}&count=10&language=es&format=json&countryCode=CL`;
  } else {
    geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=10&language=es&format=json`;
  }

  const geoRes = await fetch(geoUrl);

  if (!geoRes.ok) {
    throw new Error("No se pudo buscar la ciudad");
  }

  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Ciudad no encontrada");
  }

  const place = geoData.results[0];
  const { latitude, longitude, name, country, timezone } = place;

  // =========================
  // Sección: petición de clima actual
  // Objetivo: pedir temperatura, viento y weather code
  // =========================
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`;
  const weatherRes = await fetch(weatherUrl);

  if (!weatherRes.ok) {
    throw new Error("No se pudo obtener el clima");
  }

  const weatherData = await weatherRes.json();

  if (!weatherData.current) {
    throw new Error("No se pudo obtener el clima");
  }

  return {
    city: name,
    country: country || "Sin país",
    timezone: timezone || weatherData.timezone || "UTC",
    temperature: weatherData.current.temperature_2m,
    windspeed: weatherData.current.wind_speed_10m,
    weathercode: weatherData.current.weather_code,
    time: weatherData.current.time
  };
}

// =========================
// Función: obtener clima para varias ciudades del ticker
// Objetivo: alimentar el carrusel inferior
// Aquí puedes cambiar: lista de ciudades base
// =========================
export async function getTickerCitiesWeather() {
  const cities = [
    { label: "Santiago", query: "Santiago", countryCode: "CL" },
    { label: "Madrid", query: "Madrid", countryCode: "ES" },
    { label: "Buenos Aires", query: "Buenos Aires", countryCode: "AR" },
    { label: "Tokyo", query: "Tokyo", countryCode: "JP" },
    { label: "London", query: "London", countryCode: "GB" }
  ];

  const results = await Promise.all(
    cities.map(async (item) => {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(item.query)}&count=1&language=es&format=json&countryCode=${item.countryCode}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          return null;
        }

        const place = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (!weatherData.current) {
          return null;
        }

        return {
          city: place.name,
          country: place.country,
          timezone: place.timezone || weatherData.timezone || "UTC",
          temperature: weatherData.current.temperature_2m,
          weathercode: weatherData.current.weather_code
        };
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean);
}