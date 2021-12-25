let cases, deaths, tests, r0, pos, n_cases, n_deaths, n_tests;

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

function setCumulData(status, response) {

    data = response["MAR"];

    n_cases = data["new_cases"];
    n_deaths = data["new_deaths"];
    n_tests = data["new_tests"];
    cases = data["total_cases"];
    deaths = data["total_deaths"];
    tests = data["total_tests"];
    r0 = data["reproduction_rate"];
    pos = data["positive_rate"]

    console.log(n_tests);

    document.getElementById("total-cases-data").innerHTML = cases.toLocaleString();
    document.getElementById("total-deaths-data").innerHTML = deaths.toLocaleString();
    document.getElementById("total-tests-data").innerHTML = tests.toLocaleString();
    document.getElementById("r0-data").innerHTML = r0;
    document.getElementById("p-data").innerHTML = pos;
    document.getElementById("new-cases-data").innerHTML = " +" + n_cases.toLocaleString() + " cases";
    document.getElementById("new-deaths-data").innerHTML = " +" + n_deaths.toLocaleString() + " deaths";
    document.getElementById("new-tests-data").innerHTML = " +" + n_tests.toLocaleString() + " tests";



}

getJSON("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json", setCumulData);