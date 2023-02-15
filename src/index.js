import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries.js';

const refs = {
  inputEl: document.getElementById('search-box'),
  ulEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
  DEBOUNCE_DELAY: 300,
};

refs.inputEl.addEventListener(
  'input',
  debounce(onSearchCountry, refs.DEBOUNCE_DELAY)
);

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
      } else if (dataCountry.length <= 10 && dataCountry.length >= 2) {
        refs.inputEl.style.borderColor = 'blue';
        resMarkup(refs.ulEl);
        resMarkup(refs.divEl);
        createMarkupFlagsCountry(dataCountry);
      } else {
        resMarkup(refs.ulEl);
        resMarkup(refs.divEl);
        createMarkupInfoCountry(dataCountry);
      }
    })
    .catch(() => {
      refs.inputEl.style.borderColor = 'red';
      resMarkup(refs.ulEl);
      resMarkup(refs.divEl);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function resMarkup(data) {
  data.innerHTML = '';
}

function createMarkupFlagsCountry(nameCountry) {
  const markup = nameCountry
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" width="60" alt="flag" />
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
    <img class="country__img" src="${flags.svg}" width="150" alt="flag">
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

refs.inputEl.style.borderRadius = '10px';
refs.inputEl.style.borderColor = 'gold';
