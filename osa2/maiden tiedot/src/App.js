import { useState, useEffect } from 'react'
import axios from 'axios'

const OnlyCountry = ({country}) => {
  const apiKey = process.env.REACT_APP_API_KEY
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}&units=metric`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, [])

  return(
    <div>
      <h1> {country.name.common} </h1>
      capital {country.capital} 
      <br/>
      area {country.area}
      <br/>
      <h3> languages: </h3>
      <ul>
        {Object.keys(country.languages).map((languageCode, index) => (
          <li key={index}>{country.languages[languageCode]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} style={{ maxWidth: '140px' }} />
      <p>Temperature {weatherData?.main.temp ?? ''} Celsius</p>
      <p>Wind {weatherData?.wind.speed ?? ''} m/s</p>
      {weatherData?.weather ? <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}></img> : <p>loading...</p>}
    </div>
  )
}

const Country = (props) => {
  if (props.only)
    return(
      <div>
      <OnlyCountry country = {props.country} />
    </div>
    )
  else
    return (
      <div>
        {props.country.name.common}
        <button onClick={() => props.handleShowClick(props.country)}>show</button>
      </div>
    )
}

const CountryFilter = (props) => {
  return (
    <form>
        Find countries <input 
            value={props.value}
            onChange={props.eventHandler}
            />
    </form>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [value, setValue] = useState("")
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    console.log('effect run, country is now', countries)
    console.log('fetching country data')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })

  }, [])

  const ShowCountries = ({value}) => {
    const included = countries.filter(
      country => country.name.common.toLowerCase().includes(value.toLowerCase())
    )
    console.log('included', included)
    if (included.length > 10) {
      return (
        <div>
          Too many matches, specify another filter
        </div>
      )
    }
    else if (included.length === 1) {
      return (
        <div>
          {included.map (country =>
            < Country country = {country} only={true} />)}
        </div>
      )
    }
    else if (selected) {
      return (
        <div>
          <OnlyCountry country = {selected} />
        </div>
      )
    }
    else {
      return (
        <div>
          {included.map (country =>
            < Country key = {country.name.common} country = {country} handleShowClick = {handleShowClick}/>)}
        </div>
      )
    }
  }

  const handleShowClick = (country) => {
    console.log("country:", country)
    setSelected(country)
  }

  const HandleSearchChange = (event) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  return (
    <div>
      < CountryFilter value = {value} eventHandler = {HandleSearchChange} />
      < ShowCountries value={value} />
    </div>
  )
}

export default App