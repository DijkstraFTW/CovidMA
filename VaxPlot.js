let datesVax = []
let resultVaxData = []

let plotFirstJab = [];
let plotThirdJab = [];
let plotSecondJab = [];
let objective = [];


d3.csv("vax2.csv", function(d) {
        resultVaxData.push(d)
        return {
            Date: d.date,
            Dose1: d.people_vaccinated,
            Dose2: d.people_fully_vaccinated,
            Dose3: d.total_boosters
        }
    },
    function(error, rows) {
        for (let i = 0; i < resultVaxData.length; i++) {

            datesVax.push(resultVaxData[i]["date"])
            plotFirstJab.push(resultVaxData[i]["people_fully_vaccinated"]);
            plotSecondJab.push(resultVaxData[i]["people_vaccinated"]);

            resultVaxData[i]["total_boosters"] = resultVaxData[i]["total_boosters"].split(' ').join('')
            resultVaxData[i]["total_boosters"] = resultVaxData[i]["total_boosters"].split('"').join('')
            plotThirdJab.push(resultVaxData[i]["total_boosters"])

            objective.push(30000000);
        }

        var ctx = document.getElementById('plot-vax').getContext('2d')


        var graph_data = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datesVax,
                datasets: [{
                    borderColor: '#005bff',
                    backgroundColor: "rgba(0, 91, 255, 0.6)",
                    borderWidth: 2,
                    radius: 0,
                    data: plotFirstJab,
                    fill: true
                }, {
                    borderColor: "#99bdff",
                    backgroundColor: "rgba(153, 189, 255, 0.3)",
                    borderWidth: 2,
                    radius: 0,
                    data: plotSecondJab,
                    fill: true
                }, {
                    borderColor: "#070ECE",
                    backgroundColor: "rgba(7, 14, 206, 0.7)",
                    borderWidth: 2,
                    radius: 0,
                    data: plotThirdJab,
                    fill: true
                }, {
                    borderColor: "#E8070c",
                    backgroundColor: "rgb(232, 7, 12, 0.1)",
                    borderWidth: 2,
                    radius: 0,
                    data: objective,
                    fill: false
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
                            maxTicksLimit: 16,
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
    })