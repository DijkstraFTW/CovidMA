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
    document.getElementById("dose1").innerHTML = response['vaccine'] + " " + (100 * (response['vaccine'] / obj)).toFixed(2) + "<br></br>"; // dose 1
    document.getElementById("dose2").innerHTML = response['fullyVaccined'] + " " + (100 * (response['fullyVaccined'] / obj)).toFixed(2) + "<br></br>"; // dose 2
    document.getElementById("reste").innerHTML = (obj - response['vaccine']) + " " + (100 * ((obj - response['vaccine']) / obj)).toFixed(2) + "<br></br>"; // dose 3
}

getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/vaccination.json", setVaxPct);