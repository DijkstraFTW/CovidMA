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


    document.getElementById("total-cases-data").innerHTML = cases.toLocaleString();
    document.getElementById("total-deaths-data").innerHTML = deaths.toLocaleString();
    document.getElementById("total-tests-data").innerHTML = tests.toLocaleString();
    document.getElementById("r0-data").innerHTML = r0;
    document.getElementById("new-tests-data").innerHTML = " +" + n_tests.toLocaleString() + " tests";
    document.getElementById("new-cases-data").innerHTML = " +" + n_cases.toLocaleString() + " cases";
    document.getElementById("new-deaths-data").innerHTML = " +" + n_deaths.toLocaleString() + " deaths";
}

function setNewData(status, response) {

    data = response;

    n_cases = data["cases"];
    n_deaths = data["deaths"];

    //n_dose1 = data["dose_1_last_day"];
    //n_dose2 = data["dose_2_last_day"];
    //n_dose3 = data["dose_3_last_day"];
    //total_dose3 = data["dose_3_total"];


    //document.getElementById("new-dose1-data").innerHTML = " +" + n_dose1;
    // document.getElementById("new-dose2-data").innerHTML = " +" + n_dose2;
    // document.getElementById("new-dose3-data").innerHTML = " +" + n_dose3;


    //document.getElementById("remainder-data").innerHTML = total_dose3.toLocaleString();
    //document.getElementById("remainder-pct").innerHTML = (total_dose3 / 30000000).toFixed(2) + " %";

}

getJSON("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json", setCumulData);
getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/resume.json", setNewData);