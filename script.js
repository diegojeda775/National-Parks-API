// put your own value below!
const apiKey = 'aPjigtJoe4D6aS2IlPEefPpKgutVOtZiiA89CrgI';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    // for each video object in the items
    // array, add a list item to the results
    // list with the video title, description,
    // and thumbnail
    const address = responseJson.data[i].addresses[0];
    let mail = '';
    if (address.line1) {
      mail += `${address.line1}, `;
    }
    if (address.line2) {
      mail += `${address.line2}, `;
    }
    if (address.line3) {
      mail += `${address.line3}, `;
    }
    if (address.city) {
      mail += `${address.city}, `;
    }
    if (address.stateCode) {
      mail += `${address.stateCode} `;
    }
    if (address.postalCode) {
      mail += `${address.postalCode}.`;
    }

    $('#results-list').append(
      `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        <p><a href="${responseJson.data[i].directionsUrl}">${mail}</a></p>
        </li>`,
    );
  }
  // display the results section
  $('#results').removeClass('hidden');
}

function getParks(query, maxResults = 10) {
  const params = {
    api_key: apiKey,
    q: query,
    // stateCode: ,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
  const url = `${searchURL}?${queryString}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit((event) => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);
