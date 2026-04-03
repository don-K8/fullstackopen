import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const specifiedUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getCountry = (country_name) => {
    const request = axios.get(`${specifiedUrl}/${country_name}`)
    return request.then(response => response.data)
}

const getWeather = (capital) => {
    const request = axios.get(`${weatherUrl}q=${capital}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
}

export default { getAll, getCountry, getWeather }