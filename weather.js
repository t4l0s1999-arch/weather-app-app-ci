const { obtenerDatosMeteo, formatearDatosMeteo } = require("./weatherService");

const LATITUDE = 43.2833;
const LONGITUDE = -2.1667;

async function main() {
  try {
    const datos = await obtenerDatosMeteo(LATITUDE, LONGITUDE);
    const salida = formatearDatosMeteo(datos, LATITUDE, LONGITUDE);
    console.log(salida);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
