let plotFirstJab = [];
let plotThirdJab = [];
let plotSecondJab = [];
let objective = [];
let datesVax = [];

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

function setVaxPlot(status, response) {

    var data = response[140]["data"];

    vax1 = data['people_vaccinated'];
    vax2 = data['people_fully_vaccinated'];
    vax3 = data["total_boosters"];


    for (let i = 0; i < data.length; i++) {

        datesVax.push(data[i]["date"])
        plotFirstJab.push(data[i]["people_fully_vaccinated"]);
        plotSecondJab.push(data[i]["people_vaccinated"]);
        plotThirdJab.push(data[i]["total_boosters"])
        objective.push(30000000);
    }

    let fix1 = [0, 0, 90000, 126000, 200081, 257291, 308398, 351723, 408235, 463966, 550149, 615181, 746116, 855318, 1112103, 1388539, 1707091, 1904169, 2081013, 2233123]

    let fix2 = [176594, 343055, 705534, 784478, 982640, 1148838, 1394802, 1464443, 1518576, 1571072, 1594291, 1602391, 1625923, 1641746, 1654400, 1758445, 1896565, 1979811, 2099402, 2303525, 2533514, 2738512, 3005363, 3184255, 3525886, 3628856, 3786619, 3921889, 4111342, 4226358, 4269522, 4376913, 4510819, 4725899, 5089940]

    for (let index = 0; index < 22; index++) {
        plotSecondJab[index] = fix1[index];
    }

    for (let index = 349; index < 385; index++) {
        plotThirdJab[index] = fix2[index - 350];
    }
    var ctx = document.getElementById('plot-vax').getContext('2d')

    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datesVax,
            datasets: [{
                borderColor: "#99bdff",
                backgroundColor: "rgba(153, 189, 255, 0.3)",
                borderWidth: 2,
                radius: 0,
                data: plotSecondJab,
                label: "1st Jab",
                fill: true
            }, {
                borderColor: '#005bff',
                backgroundColor: "rgba(0, 91, 255, 0.6)",
                borderWidth: 2,
                radius: 0,
                data: plotFirstJab,
                label: "2nd Jab",
                fill: true
            }, {
                borderColor: "#070ECE",
                backgroundColor: "rgba(7, 14, 206, 0.7)",
                borderWidth: 2,
                radius: 0,
                data: plotThirdJab,
                label: "3rd Jab",
                fill: true
            }, {
                borderColor: "#E8070c",
                backgroundColor: "rgb(232, 7, 12, 0.1)",
                borderWidth: 2,
                radius: 0,
                data: objective,
                label: "Objective",
                fill: false
            }],
        },
        options: {
            spanGaps: true,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return datesVax[value];
                        }
                    }
                },
                y: {
                    grid: {
                        display: true
                    }
                }
            },
        }
    })
}

getJSON("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json", setVaxPlot)