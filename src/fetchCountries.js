const refs = {
  URL_Country: 'https://restcountries.com/v3.1/name',
};

export default function fetchCountries(name) {
  return fetch(
    `${refs.URL_Country}/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error('Data fail!');
    }
    return response.json();
  });
}
