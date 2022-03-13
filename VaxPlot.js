let datesP = []
let VaxData = []
let resultVaxData = []

const plotTotalJabs = [];
const plotFirstJab = [];
const plotSecondJab = [];
const objective = [];


jQuery.ajax({
    url: "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Morocco.csv",
    type: 'get',
    dataType: 'text',
    success: function(data) {

        let lines = data.split('\n');
        let output = [];

        console.log(data)

        for (let i = 1; i < lines.length; i++) {
            let current = lines[i].split(',');
            datesP.push(current[1]);
            output.push([current[current.length - 4], current[current.length - 2], current[current.length - 3]])
        }

        resultVaxData = output

        for (let index = 0; index < output.length; index++) {
            for (let temp = 0; temp < 3; temp++) {
                if (output[index][temp] == '' && index > 19) {
                    resultVaxData.splice(index, 1)
                }
                resultVaxData[index][temp] = output[index][temp]

            }
        }

        for (let i = 0; i < resultVaxData.length; i++) {
            plotTotalJabs.push(resultVaxData[i][0]);
            plotFirstJab.push(resultVaxData[i][1]);
            plotSecondJab.push(resultVaxData[i][2]);
            objective.push(30000000);
        }

        var ctx = document.getElementById('plot-vax').getContext('2d')

        var graph_data = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datesP,
                datasets: [{
                    borderColor: '#005bff',
                    backgroundColor: "rgba(0, 91, 255, 0.6)",
                    borderWidth: 2,
                    radius: 0,
                    data: plotFirstJab,
                    fill: true
                }, {
                    borderColor: "#99bdff",
                    backgroundColor: "rgba(153, 189, 255, 0.6)",
                    borderWidth: 2,
                    radius: 0,
                    data: plotSecondJab,
                    fill: true
                }, {
                    borderColor: "#E8070c",
                    borderWidth: 2,
                    radius: 0,
                    data: objective
                }],
            },
            options: {
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 9,
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return datesP[value];
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
    },
    error: function(jqXHR, textStatus, errorThrow) {
        console.log(textStatus);
    }
});