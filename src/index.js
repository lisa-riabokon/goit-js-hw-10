// підключення бібліотек
// npm i --save lodash.debounce
import debounce from 'lodash.debounce';
// npm i notiflix
import Notiflix from 'notiflix';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  cardEl: document.querySelector('.country-info'),
};

// console.log(refs.inputEl);

refs.inputEl.addEventListener('input', debounce(onFormSearch, DEBOUNCE_DELAY));

// отримання значення з інпуту
function onFormSearch(evt) {
  evt.preventDefault();
  // отримуєм значення інпут і очищуєм пробіли по боках
  const searchQuery = evt.target.value.trim();

  // перевіряєм чи не пустий інпут
  if (searchQuery !== '') {
    fetchList(searchQuery).then(chackList).catch(onFetchError);
  } else {
    //   очищуємо список і картку
    refs.listEl.innerHTML = '';
    refs.cardEl.innerHTML = '';
  }
  // проміс отримання списку країн з сайту
  function fetchList(countryID) {
    return fetch(`https://restcountries.com/v3.1/name/${countryID}`)
      .then(response => {
        return response.json();
      })
      .catch(onListError);
  }

  function chackList(countryID) {
    let listValue = '';

    if (countryID.length >= 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countryID.length === 0) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.listEl.innerHTML = '';
      refs.cardEl.innerHTML = '';
    } else if (countryID.length >= 2 && countryID.length <= 10) {
      refs.cardEl.innerHTML = '';
      renderCountryList(countryID);
    } else if (countryID.length === 1) {
      refs.listEl.innerHTML = '';
      renderOneCountry(countryID);
    } else {
      refs.listEl.innerHTML = '';
      refs.cardEl.innerHTML = '';
    }

    function renderCountryList(ID) {
      for (let i = 0; i < ID.length; i += 1) {
        let markup = `
        <div class="country-info country-item">
        <img class="flag" src="${ID[i].flags.svg}" alt="" width="90">
        <h2 class="title">${ID[i].name.official}<h/2>
        </div>`;
        listValue += markup;
      }
      refs.listEl.innerHTML = listValue;
    }
  }
}

function renderOneCountry() {}

function onFetchError(error) {}

function onListError(error) {}
