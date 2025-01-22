import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const DEBOUNCE_DELAY = 500;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('#country-list'),
  countryInfo: document.querySelector('#country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const query = event.target.value.trim();

  if (!query) {
    clearMarkup();
    return;
  }

  fetchCountries(query)
    .then(data => renderMarkup(data))
    .catch(() => {
      clearMarkup();
      error({
        text: 'Country not found. Please refine your search.',
        delay: 2000,
      });
    });
}

function renderMarkup(countries) {
  clearMarkup();

  if (countries.length > 10) {
    error({
      text: 'Too many matches found. Please refine your search.',
      delay: 2000,
    });
    return;
  }

  if (countries.length > 1 && countries.length <= 10) {
    const listMarkup = countries
      .map(({ name }) => `<li>${name}</li>`)
      .join('');
    refs.countryList.innerHTML = listMarkup;
    return;
  }

  if (countries.length === 1) {
    const { name, capital, population, flags, languages } = countries[0];
    const infoMarkup = `
      <h2>${name}</h2>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${languages.map(lang => lang.name).join(', ')}</p>
      <img src="${flags.svg}" alt="Flag of ${name}" width="100" />
    `;
    refs.countryInfo.innerHTML = infoMarkup;
  }
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}