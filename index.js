'use strict'

const apiKey = 'nplT9QdvpFqvlE1XRa6jLEKsdQIsTqMNPFvwIMqo';
const searchUrl = "https://api.nps.gov/api/v1/parks";

function displayParks(response, max){
    $('#results').empty();
    console.log(response);
    for (let i = 0; i < max && i < response.length; i++){
        let park = response[i];
        $('#results').append(`
            <h3>${park.fullName}</h3>
            <p>${park.description}</p>
            <p><a href="${park.url}">${park.url}</a></p>`
        )
    };
    $('#results').removeClass('hidden');
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

function formatStates(query) {
    let states = [];
    query = query.split(", ");
    query.forEach(state => {
        states.push(`stateCode=${state}`);
    });
    return states.join('&');
}

function getNationalParks(query, max) {
    let stateCode = formatStates(query);
    const params = {
        limit: max,
        key: apiKey
    }
    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + stateCode + '&' + queryString;
    fetch(url)
    .then (response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then (responseJson => displayParks(responseJson.data, max))
    .catch (error => alert(`Error! ${error.message}`));
}

function watchForm() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const searchTerms = $('#js-state-code').val();
        const maxResults = $('#js-max-results').val();
        getNationalParks(searchTerms, maxResults);
    })
}

$(watchForm);