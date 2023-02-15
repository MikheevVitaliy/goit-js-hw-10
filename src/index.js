import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries.js';

// const DEBOUNCE_DELAY = 300;
const refs = {
  inputEl: document.getElementById('search-box'),
  ulEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
  URL_Country: 'https://restcountries.com/v3.1/name',
  DEBOUNCE_DELAY: 300,
};

refs.inputEl.addEventListener(
  'input',
  debounce(onSearchCountry, refs.DEBOUNCE_DELAY)
);

function resMarkup(data) {
  data.innerHTML = '';
}

function onSearchCountry(event) {
  event.preventDefault();

  const inputData = event.target.value.trim();
  if (!inputData) {
    resMarkup(refs.ulEl);
    resMarkup(refs.divEl);
    return;
  }

  fetchCountries(inputData)
    .then(dataCountry => {
      if (dataCountry.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (dataCountry.length >= 2 && dataCountry.length <= 10) {
        refs.inputEl.style.borderColor = 'blue';
        resMarkup(refs.ulEl);
        createMarkupFlagsCountry(dataCountry);
        resMarkup(refs.divEl);
      } else {
        resetMarkup(refs.divEl);
        createMarkupInfoCountry(dataCountry);
        resMarkup(refs.ulEl);
      }
    })
    .catch(() => {
      refs.inputEl.style.borderColor = 'red';
      resMarkup(refs.ulEl);
      resMarkup(refs.divEl);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupFlagsCountry(nameCountry) {
  const markup = nameCountry
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" width="90" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    })
    .join('');
  return refs.ulEl.insertAdjacentHTML('beforeend', markup);
}

function createMarkupInfoCountry(infoCountry) {
  const markup = infoCountry
    .map(({ name, capital, population, flags, languages }) => {
      return `
  <div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');

  return refs.divEl.insertAdjacentHTML('beforeend', markup);
}

// liEl = document.querySelector('.country__item');
// liEl.style.color = 'blue';
// refs.inputEl.style.borderColor = 'blue';
refs.inputEl.style.borderRadius = '10px';
refs.inputEl.style.borderColor = 'gold';
