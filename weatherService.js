const obtenerDatosMeteo = async (latitude, longitude) => {
  const baseUrl = "https://api.open-meteo.com/v1/forecast";
  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fallo al obtener datos meteorológicos: ${error.message}`);
  }
};

const interpretarCodigoTiempo = (codigo) => {
  const codigos = {
    0: { descripcion: "Despejado", emoji: "☀️" },
    1: { descripcion: "Principalmente despejado", emoji: "🌤️" },
    2: { descripcion: "Parcialmente nublado", emoji: "⛅" },
    3: { descripcion: "Nublado", emoji: "☁️" },
    45: { descripcion: "Niebla", emoji: "🌫️" },
    48: { descripcion: "Niebla", emoji: "🌫️" },
    51: { descripcion: "Llovizna", emoji: "🌦️" },
    53: { descripcion: "Llovizna", emoji: "🌦️" },
    55: { descripcion: "Llovizna", emoji: "🌦️" },
    61: { descripcion: "Lluvia", emoji: "🌧️" },
    63: { descripcion: "Lluvia", emoji: "🌧️" },
    65: { descripcion: "Lluvia", emoji: "🌧️" },
    71: { descripcion: "Nieve", emoji: "❄️" },
    73: { descripcion: "Nieve", emoji: "❄️" },
    75: { descripcion: "Nieve", emoji: "❄️" },
    80: { descripcion: "Chubascos", emoji: "🌧️" },
    81: { descripcion: "Chubascos", emoji: "🌧️" },
    82: { descripcion: "Chubascos", emoji: "🌧️" },
    95: { descripcion: "Tormenta", emoji: "⛈️" },
    96: { descripcion: "Tormenta", emoji: "⛈️" },
    99: { descripcion: "Tormenta", emoji: "⛈️" },
  };

  return codigos[codigo] || { descripcion: "Desconocido", emoji: "❓" };
};

const interpretarDireccionViento = (grados) => {
  // Normalizar grados a 0-360
  const deg = ((grados % 360) + 360) % 360;

  if (deg >= 337.5 || deg < 22.5) return { direccion: "N", emoji: "⬆️" };
  if (deg >= 22.5 && deg < 67.5) return { direccion: "NE", emoji: "↗️" };
  if (deg >= 67.5 && deg < 112.5) return { direccion: "E", emoji: "➡️" };
  if (deg >= 112.5 && deg < 157.5) return { direccion: "SE", emoji: "↘️" };
  if (deg >= 157.5 && deg < 202.5) return { direccion: "S", emoji: "⬇️" };
  if (deg >= 202.5 && deg < 247.5) return { direccion: "SW", emoji: "↙️" };
  if (deg >= 247.5 && deg < 292.5) return { direccion: "W", emoji: "⬅️" };
  if (deg >= 292.5 && deg < 337.5) return { direccion: "NW", emoji: "↖️" };

  return { direccion: "?", emoji: "❓" };
};

const formatearDatosMeteo = (datos, latitude, longitude) => {
  const current = datos.current;
  const units = datos.current_units;

  const weather = interpretarCodigoTiempo(current.weather_code);
  const wind = interpretarDireccionViento(current.wind_direction_10m);
  const fecha = new Date().toLocaleString();

  return `
🌍 PRONÓSTICO DEL TIEMPO
=======================

📍 Ubicación: ${latitude}°N, ${longitude}°W
🕐 Fecha: ${fecha}

🌡️  TEMPERATURA
-----------------------
Actual:         ${current.temperature_2m}${units.temperature_2m}
Sensación:      ${current.apparent_temperature}${units.apparent_temperature}
Humedad:        ${current.relative_humidity_2m}${units.relative_humidity_2m} 💧

☁️  CONDICIONES
-----------------------
Estado:         ${weather.emoji} ${weather.descripcion}
Precipitación:  ${current.precipitation_probability}${units.precipitation_probability} 🌧️
Acumulada:      ${current.precipitation} ${units.precipitation}

💨 VIENTO
-----------------------
Velocidad:      ${current.wind_speed_10m} ${units.wind_speed_10m}
Dirección:      ${wind.emoji}  ${wind.direccion} (${current.wind_direction_10m}°)
`;
};
module.exports = {
  obtenerDatosMeteo,
  interpretarCodigoTiempo,
  interpretarDireccionViento,
  formatearDatosMeteo,
};
