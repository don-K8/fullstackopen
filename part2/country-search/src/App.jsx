import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Weather = ({ capital, detailW }) => {
  if (!detailW) return null

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {detailW.main.temp} Celsius</p>
      <p>{detailW.weather[0].main}</p>
      <img
        src={`https://openweathermap.org/img/wn/${detailW.weather[0].icon}@2x.png`}
        alt={detailW.weather[0].main}
      />
      <p>Wind {detailW.wind.speed} m/s</p>
    </div>
  )
}

const Display = ({ detailC, detailW }) => {
  if (!detailC) return null

  return (
    <div>
      <h1>{detailC.name.common}</h1>
      <p>Capital {detailC.capital[0]}</p>
      <p>Area {detailC.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(detailC.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={detailC.flags.png} alt={`${detailC.name.common}'s flag`} />
      <Weather capital={detailC.capital[0]} detailW={detailW} />
    </div>
  )
}

const CountryRow = ({ name, capital, onShow }) => (
  <p>
    {name}
    <button onClick={() => onShow(name, capital)}>show</button>
  </p>
)

const Countries = ({ country, typed, displayC, displayW, onShow, toShow }) => {
  if (!typed) return null

  if (country.length > 10) return <p>Too many matches, specify another filter</p>

  return (
    <div>
      {country.map(c => {
        const isShown = country.length === 1 || toShow === c.name.common

        return (
          <div key={c.cca3}>
            {isShown
              ? <Display detailC={displayC} detailW={displayW} />
              : toShow
              ? null
              : <CountryRow name={c.name.common} capital={c.capital[0]} onShow={onShow} />
            }
          </div>
        )
      })}
    </div>
  )
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [country, setCountry] = useState('')
  const [countryDetail, setCountryDetail] = useState(null)
  const [showClicked, setShowClicked] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAll().then(data => setAllCountries(data))
  }, [])

  const filtered = allCountries.filter(c =>
    c.name.common.toLowerCase().includes(country.toLowerCase())
  )

  useEffect(() => {
    if (filtered.length === 1) {
      countryService.getCountry(filtered[0].name.common).then(data => setCountryDetail(data))
      countryService.getWeather(filtered[0].capital).then(data => setWeather(data))
    }
  }, [country])

  const handleCountryChange = e => {
    setCountry(e.target.value)
    setShowClicked(null)
  }

  const handleShow = (name, capital) => {
    setShowClicked(name)
    countryService.getCountry(name).then(data => setCountryDetail(data))
    countryService.getWeather(capital).then(data => setWeather(data))
  }

  return (
    <div>
      <p>find countries <input value={country} onChange={handleCountryChange} /></p>
      <Countries
        country={filtered}
        typed={country}
        displayC={countryDetail}
        displayW={weather}
        onShow={handleShow}
        toShow={showClicked}
      />
    </div>
  )
}

export default App