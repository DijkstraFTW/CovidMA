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
        let fields = lines[0].split(',');

        let output = [];

        for (let i = 1; i < lines.length; i++) {
            let current = lines[i].split(',');
            datesP.push(current[1]);
            output.push([current[current.length - 4], current[current.length - 2], current[current.length - 3]])
        }

        for (let index = 0; index < output.length; index++) {
            for (let temp = 0; temp < 3; temp++) {
                if (output[index][temp] == "") {
                    output[index][temp] = "0";
                }
            }
        }
        resultVaxData = output;

        for (let i = 0; i < resultVaxData.length; i++) {
            plotTotalJabs.push({
                x: i,
                y: resultVaxData[i][0]
            });
            plotFirstJab.push({
                x: i,
                y: resultVaxData[i][1]
            });
            plotSecondJab.push({
                x: i,
                y: resultVaxData[i][2]
            });
            objective.push({
                x: i,
                y: 30000000
            });
        }

        console.log(resultVaxData)

        const totalDuration = 1000;
        const delayBetweenPoints = totalDuration / plotTotalJabs.length;

        var ctx = document.getElementById('plot-vax').getContext('2d')
        var graph_data2 = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    borderColor: '#005bff',
                    borderWidth: 2,
                    radius: 0,
                    data: plotFirstJab,
                }, {
                    borderColor: "#99bdff",
                    borderWidth: 2,
                    radius: 0,
                    data: plotSecondJab,
                }, {
                    borderColor: "#be25a9",
                    borderWidth: 2,
                    radius: 0,
                    data: objective,
                }]
            },
            options: {
                animation: {
                    x: {
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        from: NaN,
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.xStarted) {
                                return 0;
                            }
                            ctx.xStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                    y: {
                        type: 'number',
                        easing: 'linear',
                        duration: delayBetweenPoints,
                        delay(ctx) {
                            if (ctx.type !== 'data' || ctx.yStarted) {
                                return 0;
                            }
                            ctx.yStarted = true;
                            return ctx.index * delayBetweenPoints;
                        }
                    },
                },
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: false
                },
                scales: {
                    x: {
                        type: 'linear',
                    },
                    y: {
                        max: 35000000
                    }
                }
            }
        })
    },
    error: function(jqXHR, textStatus, errorThrow) {
        console.log(textStatus);
    }
});