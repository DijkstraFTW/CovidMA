var sum = 0;
var index = 0;
var data = null;
var totalCases = 0;


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
                        display: false
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