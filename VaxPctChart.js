let vaccine, fullvaccine;

var vax1, vax2, remainder
var pctVax1, pctVax2, pctRemainder


var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


function setVaxPct(status, response) {

    obj = 30000000;

    vax1 = response['vaccine'].toLocaleString();
    vax2 = response['fullyVaccined'].toLocaleString();
    remainder = (obj - vax2).toLocaleString();

    pctVax1 = (100 * (response['vaccine'] / obj)).toFixed(2);
    pctVax2 = (100 * (response['fullyVaccined'] / obj)).toFixed(2);
    pctRemainder = (100 * ((obj - response['vaccine']) / obj)).toFixed(2);

}


function setWaffleChart() {
    // TO-DO
}


getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/vaccination.json", setVaxPct);