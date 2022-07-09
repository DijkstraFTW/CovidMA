let cases, deaths, tests, r0, pos, n_cases, n_deaths, n_tests;

var total_recoveries, n_recoveries;

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
    pos = data["positive_rate"];
    n_vax_smooth = data["new_vaccinations_smoothed"];
    people_vax_hundred = data["people_vaccinated_per_hundred"];



    document.getElementById("marquee").innerHTML += " +" + n_cases.toLocaleString() + " New Cases | ";
    document.getElementById("marquee").innerHTML += " +" + n_deaths.toLocaleString() + " New Deaths | ";

    if (n_tests != null) {
        document.getElementById("marquee").innerHTML += " +" + n_tests.toLocaleString() + " New Tests | ";
    } else {
        document.getElementById("marquee").innerHTML += "+N/A New Tests | ";
    }
}

function setNewData(status, response, n_recoveries, total_recoveries) {

    n_recoveries = response["features"][(response["features"].length - 1)]["attributes"]["Rétablis_par_jour"]
    total_recoveries = response["features"][(response["features"].length - 1)]["attributes"]["Retablis"]

    if (n_recoveries == null) {
        n_recoveries = response["features"][(response["features"].length - 2)]["attributes"]["Rétablis_par_jour"]
    }

    if (total_recoveries == null) {
        total_recoveries = response["features"][(response["features"].length - 2)]["attributes"]["Retablis"]
    }

    if (tests == null) {
        tests = "N/A"
    }

    document.getElementById("marquee").innerHTML += " +" + n_recoveries.toLocaleString() + " New Recoveries | ";
    document.getElementById("marquee").innerHTML += " Positivity Rate : " + pos * 100 + "% | ";
    document.getElementById("marquee").innerHTML += " Reproduction Rate : " + r0 + " | ";
    document.getElementById("marquee").innerHTML += " New Vaccinations Smoothed : " + n_vax_smooth.toLocaleString() + " | ";
    document.getElementById("marquee").innerHTML += " People Vaccinated Per Hundred : " + people_vax_hundred.toLocaleString();

    document.getElementById("cumul-cases-text").innerHTML = cases.toLocaleString();
    document.getElementById("cumul-deaths-text").innerHTML = deaths.toLocaleString();
    document.getElementById("cumul-tests-text").innerHTML = tests.toLocaleString();
    document.getElementById("cumul-recoveries-text").innerHTML = total_recoveries.toLocaleString();


}
getJSON("https://services3.arcgis.com/hjUMsSJ87zgoicvl/arcgis/rest/services/Covid_19/FeatureServer/5/query?where=1%3D1&outFields=Date,Cas_confirm%C3%A9s_par_jour,Cas_d%C3%A9c%C3%A9d%C3%A9s_par_jour,R%C3%A9tablis_par_jour,Tests_pas_jour,Retablis&returnGeometry=false&outSR=4326&f=json", setNewData);
getJSON("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json", setCumulData);