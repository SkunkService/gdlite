const axios = require("axios"); // Axios to allow. You can Install with: (npm i axios)

async function searchLevel(nameOrId) {
  try {
    const response = await axios.get(`https://gdbrowser.com/api/search/${nameOrId}`);
    return response.data; // Devuelve los resultados de la búsqueda.
  } catch (error) {
    console.error('Error buscando el nivel:', error);
    return null;
  }
}

async function fetchLevel(id, data) {
  try {
    const response = await axios.get(`https://gdbrowser.com/api/level/${id}`, {
      params: data // Enviar data como parámetros query.
    });
    return response.data; // Devuelve los datos del nivel.
  } catch (error) {
    console.error('Error obteniendo el nivel:', error);
    return null;
  }
}

async function fetchLevelForJSON(id) {
  try {
    const response = await axios.get(`https://gdbrowser.com/api/level/${id}`);
    return JSON.stringify(response.data); // Convierte los datos a una cadena JSON.
  } catch (error) {
    console.error('Error obteniendo el nivel como JSON:', error);
    return null;
  }
}

module.exports = [
  fetchLevel,
  searchLevel,
  fetchLevelForJSON
] // Export Functions.
