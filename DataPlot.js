var graph_data, graph_data3;

function setCasesPlot() {

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let dates = []
    let resultDates = []
    let casesData = []
    let resultData = []

    const plot = [];

    jQuery.ajax({
        url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {

            let lines = data.split('\n');
            let fields = lines[0].split(',');

            let output = [];

            for (let i = 1; i < lines.length; i++) {
                let current = lines[i].split(',');
                let doc = {};
                for (let j = 0; j < fields.length; j++) {
                    doc[fields[j]] = current[j];
                    if (i == 191 && j > 3) {
                        dates[j] = fields[j]
                        casesData[j] = current[j]
                    }

                }
                output.push(doc);
            }

            for (let index = 5; index < casesData.length; index++) {
                resultData[index] = casesData[index] - casesData[index - 1]
            }
            resultData[4] = casesData[4] - 0

            for (let index = 5; index < dates.length; index++) {
                resultDates[index] = resultDates[index] + "";
            }


            console.log(dates.length)
            console.log(resultData.length)


            const totalDuration = 1000;
            const delayBetweenPoints = totalDuration / plot.length;


            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        borderColor: 'red',
                        borderWidth: 1,
                        radius: 0,
                        data: resultData,
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
                                maxTicksLimit: 40,
                                beginAtZero: true,
                                callback: function(value, index, values) {
                                    return dates[value];
                                }
                            }
                        },
                        y: {
                            grid: {
                                display: false
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

}

function setDeathsPlot() {


    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let datesD = []
    let DeathsData = []
    let resultDeaths = []

    const plotD = [];

    jQuery.ajax({
        url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {
            let lines = data.split('\n');
            let fields = lines[0].split(',');

            let output = [];

            for (let i = 1; i < lines.length; i++) {
                let current = lines[i].split(',');
                let doc = {};
                for (let j = 0; j < fields.length; j++) {
                    doc[fields[j]] = current[j];
                    if (i == 191 && j > 3) {
                        datesD[j] = fields[j]
                        DeathsData[j] = current[j]
                    }

                }
                output.push(doc);
            }

            for (let index = 5; index < DeathsData.length; index++) {
                resultDeaths[index] = Math.floor(DeathsData[index] - DeathsData[index - 1])
            }
            for (let i = 4; i < resultDeaths.length; i++) {
                plotD.push({
                    x: i,
                    y: resultDeaths[i]
                });
            }

            const totalDuration = 1000;
            const delayBetweenPoints = totalDuration / plotD.length;


            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data3 = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        borderColor: 'orange',
                        borderWidth: 1,
                        radius: 0,
                        data: plotD,
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
                            type: 'linear'
                        }
                    }
                }
            })
        },
        error: function(jqXHR, textStatus, errorThrow) {
            console.log(textStatus);
        }
    });

}


setCasesPlot(); // default plot