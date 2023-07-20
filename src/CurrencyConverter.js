import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Currency from 'currency.js';
// import { Link } from 'react-router-dom';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [targetCountryData, setTargetCountryData] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [showTargetCountryData, setShowTargetCountryData] = useState(false);
  const [targetCurrencySymbol, setTargetCurrencySymbol] = useState('');


  useEffect(() => {
    if (baseCurrency && targetCurrency && amount) {
      axios
        .get(`https://v6.exchangerate-api.com/v6/0949e5501127dce5616b4285/latest/${baseCurrency}`)
        .then((response) => {
          const exchangeRate = response.data.conversion_rates[targetCurrency];
          const convertedValue = Currency(amount)
            .multiply(exchangeRate)
            .format({ symbol: '' });
          setConvertedAmount(convertedValue);
          
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [baseCurrency, targetCurrency, amount]);
  
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const currencies = response.data.reduce((acc, country) => {
          if (country.currencies) {
            Object.keys(country.currencies).forEach((code) => {
              acc[code] = country.currencies[code].symbol || code;
            });
          }
          return acc;
        }, {});
        setCurrencyOptions(Object.keys(currencies));
        setTargetCurrencySymbol(currencies[targetCurrency] || targetCurrency);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [targetCurrency]);

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleTargetCurrencyChange = (event) => {
    setTargetCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const fetchTargetCountryData = () => {
    axios
      .get(`https://restcountries.com/v3.1/currency/${targetCurrency}`)
      .then((response) => {
        const countries = response.data.filter(
          (country) =>
            country.currencies &&
            Object.keys(country.currencies)[0] === targetCurrency
        );
        const countryInfoList = countries.map((country) => ({
          name: country.name.common,
          capital: country.capital?.[0] || 'Unknown',
          population: country.population || 'Unknown',
          flag: country.flags.svg || '',
        }));
        setTargetCountryData(countryInfoList);
        setShowTargetCountryData(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container">
      <div className="currency-converter">
        <h2>Modern Currency Converter</h2>
        <div className="input-group">
          <label>Base Currency:</label>
          <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
            {/* Currency options */}
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Target Currency:</label>
          <select value={targetCurrency} onChange={handleTargetCurrencyChange}>
            {/* Currency options */}
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
          />
        </div>
        <div className="input-group">
          <button onClick={fetchTargetCountryData}>Get Country Data</button>
        </div>
        {convertedAmount && (
          <div className="converted-amount">
            Converted Amount Is : {targetCurrencySymbol} {convertedAmount}
          </div>
        )}
      </div>
      {showTargetCountryData && (
        <div className="country-info-container">
          {targetCountryData.map((country) => (
            <div className="country-card" key={country.name}>
              <img
                src={country.flag}
                alt={country.name}
                className="country-flag"
              />
              <div className="country-info">
                <h4>{country.name}</h4>
                <p>
                  <strong>Capital:</strong> {country.capital}
                </p>
                <p>
                  <strong>Population:</strong> {country.population}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* <div className="weather-link">
        <Link to="/weather">Weather</Link>
      </div> */}
    </div>
  );
};

export default CurrencyConverter;