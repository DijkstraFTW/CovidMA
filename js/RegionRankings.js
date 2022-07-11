var sum = 0;
var index = 0;
var data = null;
var totalCases = 0;

var regions_list = [
    'Casablanca - Settat',
    'Rabat - Salé - Kénitra',
    'Tanger - Tétouan - Al Hoceima',
    'Souss - Massa',
    'Guelmim - Oued Noun',
    'Laâyoune - Sakia El Hamra',
    'Dakhla - Oued Eddahab',
    'Drâa - Tafilalet',
    'Marrakech - Safi',
    'Béni Mellal - Khénifra',
    'Fès - Meknès',
    "L'Oriental"
];
var provinces_indexes = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34],
    [35, 36, 37, 38],
    [39, 40],
    [41, 42, 43, 44, 45],
    [46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58],
    [59, 60, 61, 62, 63, 64, 65, 66],
    [67, 68, 69, 70, 71, 72, 73, 74, 75],
];

let result = [],
    regions = [],
    casesRegions = [];




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

function setRankings(status, response) {

    data = response['cases'];

    for (let index = 0; index < data.length; index++) {

        for (let i = 0; i < provinces_indexes.length; i++) {
            for (let j = 0; j < provinces_indexes[i].length; j++) {
                if (provinces_indexes[i][j] == data[index]['id']) {
                    data[index]['region'] = regions_list[i];
                }
            }
        }
    }

    while (index !== 76) {

        data[index]["cases"].forEach(element => {
            sum += element;
        });

        if (data[index]["id"] == 75) {

            result.push([data[index]["region"], sum]);

            totalCases += sum
            index++;
            break
        }


        if (data[index]["region"] !== data[index + 1]["region"]) {

            result.push([data[index]["region"], sum]);

            totalCases += sum
            sum = 0;
        }

        index++;

    }

    result = result.sort(function(a, b) {
        return a[1] - b[1];
    });


    for (let index = 11; index > 0; index--) {
        regions.push(result[index][0])
        casesRegions.push(result[index][1])
    }

    const ctx = document.getElementById('rankings-chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions,
            datasets: [{
                label: 'Total Cases',
                data: casesRegions,
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if (!chartArea) {
                        return null;
                    }

                    return getGradient(ctx, chartArea)
                },
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return " " + context.formattedValue + " (" + (100 * (parseInt(context.raw) / totalCases)).toFixed(2) + "% )"
                        }
                    }
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        display: false,
                        fontSize: 100
                    }
                }
            }
        }
    });
}

function getGradient(ctx, chartArea) {

    const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradientBg.addColorStop(1, "#f2df91");
    gradientBg.addColorStop(0.60, "#fd6a0b");
    gradientBg.addColorStop(0.25, "#af1c43");
    gradientBg.addColorStop(0, "#701547");

    return gradientBg;
}

getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/map.json", setRankings);