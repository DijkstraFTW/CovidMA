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
    document.getElementById("new-tests-data").innerHTML = " +" + n_tests.toLocaleString() + " Tests";
    document.getElementById("new-cases-data").innerHTML = " +" + n_cases.toLocaleString() + " Cases";
    document.getElementById("new-deaths-data").innerHTML = " +" + n_deaths.toLocaleString() + " Deaths";
}

function setNewData(status, response) {


    n_recoveries = response["features"][(response["features"].length - 1)]["attributes"]["Rétablis_par_jour"]
    total_recoveries = response["features"][(response["features"].length - 1)]["attributes"]["Retablis"]

    document.getElementById("new-recoveries-data").innerHTML = " +" + n_recoveries.toLocaleString() + " Recoveries";
    document.getElementById("total-recoveries-data").innerHTML = total_recoveries.toLocaleString();

}

getJSON("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json", setCumulData);
getJSON("https://services3.arcgis.com/hjUMsSJ87zgoicvl/arcgis/rest/services/Covid_19/FeatureServer/5/query?where=1%3D1&outFields=Date,Cas_confirm%C3%A9s_par_jour,Cas_d%C3%A9c%C3%A9d%C3%A9s_par_jour,R%C3%A9tablis_par_jour,Tests_pas_jour,Retablis&returnGeometry=false&outSR=4326&f=json", setNewData);