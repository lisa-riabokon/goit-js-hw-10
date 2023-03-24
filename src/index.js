// підключення бібліотек
// npm i --save lodash.debounce
// npm i notiflix
import Notiflix from 'notiflix';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import debounce from 'lodash.debounce';

import './css/styles.css';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const cardEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onFormSearch, DEBOUNCE_DELAY));

const fetchCountries = name => {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=,name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
};

function onFormSearch(evt) {
  evt.preventDefault();

  const trimmedValue = inputEl.value.trim();
  onCleanHtml();

  if (trimmedValue !== '') {
    fetchCountries(trimmedValue).then(foundData => {
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        renderCountryList(foundData);
      } else if (foundData.length === 1) {
        renderOneCountry(foundData);
      }
    });
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<div>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <p>${country.name.official}</p>
                </div>`;
    })
    .join('');
  listEl.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<div>
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <p>${country.name.official}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </div>`;
    })
    .join('');

  listEl.innerHTML = markup;
}

// функція очищує назву країни та інфо про неї
function onCleanHtml() {
  listEl.innerHTML = '';
  cardEl.innerHTML = '';
}
