import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(handleInputSearchBoxValue, DEBOUNCE_DELAY)
);

function handleInputSearchBoxValue(event) {
  const value = event.target.value.trim();
  cleanMarkup();

  if (!value) {
    return;
  }

  fetchCountries(value).then(getMarkupByQueryCondition).catch(makeErrorMessage);
}

function createMarkupCountry({
  flags: { svg },
  name: { official },
  capital,
  population,
  languages,
} = {}) {
  const countryLanguages = Object.values(languages).join(',');

  return `
  <div class="country__wrap">
  <img class='country__flag' src="${svg}" alt="offical ${official} flag" />
  <h1 class='country__name'>${official}</h1>
  </div>
  <p class='country__capital'>Capital: <span class='country__value'>${capital}</span></p> 
  <p class='country__population'>Population: <span class='country__value'>${population}</span></p>
  <p class='country__language'>Languages: <span class='country__value'>${countryLanguages}</span></p>
  `;
}

function createMarkupCountriesList({
  flags: { svg },
  name: { official },
} = {}) {
  return `
  <li><img class='country__flag' src="${svg}" alt="offical ${official} flag" id='${official}'/>
    <p class='countries__name'>${official}</p>
  </li>
  `;
}

function appendMarkupCountry(countries) {
  const markup = countries.map(createMarkupCountry).join('');
  refs.countryInfo.innerHTML = markup;
}

function appendMarkupCountriesList(countries) {
  const markup = countries.map(createMarkupCountriesList).join('');
  refs.countryList.innerHTML = markup;
}

function getMarkupByQueryCondition(countries) {
  if (countries.length > 10) {
    makeinfoMessage(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length >= 2 && countries.length <= 10) {
    appendMarkupCountriesList(countries);

    return;
  }

  appendMarkupCountry(countries);
}

function cleanMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function makeErrorMessage(err) {
  Notify.failure(err.message);
}

function makeinfoMessage(message) {
  Notify.info(message);
}