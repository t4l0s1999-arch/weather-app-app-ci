const {
  interpretarCodigoTiempo,
  interpretarDireccionViento,
  formatearDatosMeteo,
  obtenerDatosMeteo,
} = require("./weatherService");

describe("interpretarCodigoTiempo", () => {
  test("debe retornar despejado para código 0", () => {
    const resultado = interpretarCodigoTiempo(0);
    expect(resultado.descripcion).toBe("Despejado");
    expect(resultado.emoji).toBe("☀️");
  });

  test("debe retornar lluvia para código 61", () => {
    const resultado = interpretarCodigoTiempo(61);
    expect(resultado.descripcion).toBe("Lluvia");
    expect(resultado.emoji).toBe("🌧️");
  });

  test("debe manejar códigos desconocidos", () => {
    const resultado = interpretarCodigoTiempo(999);
    expect(resultado.descripcion).toBe("Desconocido");
    expect(resultado.emoji).toBe("❓");
  });
});

describe("interpretarDireccionViento", () => {
  test("debe retornar N y emoji correcto para 0 grados", () => {
    const resultado = interpretarDireccionViento(0);
    expect(resultado.direccion).toBe("N");
    expect(resultado.emoji).toBe("⬆️");
  });

  test("debe retornar E y emoji correcto para 90 grados", () => {
    const resultado = interpretarDireccionViento(90);
    expect(resultado.direccion).toBe("E");
    expect(resultado.emoji).toBe("➡️");
  });

  test("debe retornar S y emoji correcto para 180 grados", () => {
    const resultado = interpretarDireccionViento(180);
    expect(resultado.direccion).toBe("S");
    expect(resultado.emoji).toBe("⬇️");
  });

  test("debe retornar W y emoji correcto para 270 grados", () => {
    const resultado = interpretarDireccionViento(270);
    expect(resultado.direccion).toBe("W");
    expect(resultado.emoji).toBe("⬅️");
  });

  test("debe retornar NE y emoji correcto para 45 grados", () => {
    const resultado = interpretarDireccionViento(45);
    expect(resultado.direccion).toBe("NE");
    expect(resultado.emoji).toBe("↗️");
  });

  test("debe retornar SE y emoji correcto para 135 grados", () => {
    const resultado = interpretarDireccionViento(135);
    expect(resultado.direccion).toBe("SE");
    expect(resultado.emoji).toBe("↘️");
  });

  test("debe retornar SW y emoji correcto para 225 grados", () => {
    const resultado = interpretarDireccionViento(225);
    expect(resultado.direccion).toBe("SW");
    expect(resultado.emoji).toBe("↙️");
  });

  test("debe retornar NW y emoji correcto para 315 grados", () => {
    const resultado = interpretarDireccionViento(315);
    expect(resultado.direccion).toBe("NW");
    expect(resultado.emoji).toBe("↖️");
  });

  test("debe retornar ? para entrada inválida", () => {
    const resultado = interpretarDireccionViento(NaN);
    expect(resultado.direccion).toBe("?");
    expect(resultado.emoji).toBe("❓");
  });
});

describe("formatearDatosMeteo", () => {
  const mockDatos = {
    current: {
      temperature_2m: 20,
      relative_humidity_2m: 50,
      apparent_temperature: 19,
      precipitation_probability: 0,
      precipitation: 0,
      weather_code: 0,
      wind_speed_10m: 10,
      wind_direction_10m: 180,
    },
    current_units: {
      temperature_2m: "°C",
      relative_humidity_2m: "%",
      apparent_temperature: "°C",
      precipitation_probability: "%",
      precipitation: "mm",
      wind_speed_10m: "km/h",
      wind_direction_10m: "°",
    },
  };

  test("debe retornar un string", () => {
    const resultado = formatearDatosMeteo(mockDatos, 40, -3);
    expect(typeof resultado).toBe("string");
  });

  test("debe incluir las coordenadas", () => {
    const resultado = formatearDatosMeteo(mockDatos, 40, -3);
    expect(resultado).toContain("40°N");
    expect(resultado).toContain("-3°W");
  });

  test("debe incluir emojis en el formato", () => {
    const resultado = formatearDatosMeteo(mockDatos, 40, -3);
    expect(resultado).toContain("☀️"); // De código 0
    expect(resultado).toContain("⬇️"); // De viento 180
    expect(resultado).toContain("🌡️");
    expect(resultado).toContain("💨");
  });
});

describe("obtenerDatosMeteo", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("debe retornar datos meteorológicos correctos", async () => {
    const mockResponse = {
      current: { temperature_2m: 20 },
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const datos = await obtenerDatosMeteo(40, -3);
    expect(datos).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("latitude=40"),
    );
  });

  test("debe manejar errores de API", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(obtenerDatosMeteo(40, -3)).rejects.toThrow(
      "Error en la petición: 404 Not Found",
    );
  });

  test("debe manejar errores de red", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(obtenerDatosMeteo(40, -3)).rejects.toThrow(
      "Fallo al obtener datos meteorológicos: Network Error",
    );
  });
});
