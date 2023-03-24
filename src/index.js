// підключення бібліотек
// npm i --save lodash.debounce
// npm i notiflix
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const cardEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onFormSearch, DEBOUNCE_DELAY));

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
      return `<div class="country-info">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="70">
         <p class="country-name">${country.name.official}</p>
                </div>`;
    })
    .join('');
  listEl.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country-info">
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="90">
         <p class="country-name">${country.name.official}</p>
            <p class="text-info">Capital: ${country.capital}</p>
            <p class="text-info">Population: ${country.population}</p>
            <p class="text-info">Languages: ${Object.values(
              country.languages
            )} </p>
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
