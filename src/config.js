const URL = process.env.REACT_APP_API_URL || 'http://localhost';
const PORT = process.env.REACT_APP_API_PORT || 3000
const BASE_URL = `${URL}:${PORT}`

export { BASE_URL };