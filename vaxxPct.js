let vaccine, fullvaccine;

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
    vax3 = (obj - response['vaccine']).toLocaleString();

    pctvax1 = (100 * (response['vaccine'] / obj)).toFixed(2);
    pctvax2 = (100 * (response['fullyVaccined'] / obj)).toFixed(2);
    remainder = (100 * ((obj - response['vaccine']) / obj)).toFixed(2);


    document.getElementById("dose1-data").innerHTML = response['vaccine'].toLocaleString() + "<br></br>"; // dose 1
    document.getElementById("dose2-data").innerHTML = response['fullyVaccined'].toLocaleString() + "<br></br>"; // dose 2

    document.getElementById("dose1-pct").innerHTML = (100 * (response['vaccine'] / obj)).toFixed(2) + " %";
    document.getElementById("dose2-pct").innerHTML = (100 * (response['fullyVaccined'] / obj)).toFixed(2) + " %";

    //setVaxDonut();
}


getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/vaccination.json", setVaxPct);