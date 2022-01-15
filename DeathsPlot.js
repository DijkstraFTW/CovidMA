function setDeathsPlot() {
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
                    if (i == 190 && j > 3) {
                        datesD[j] = fields[j]
                        DeathsData[j] = current[j]
                    }

                }
                output.push(doc);
            }
            for (let index = 5; index < DeathsData.length; index++) {
                resultDeaths[index] = DeathsData[index] - DeathsData[index - 1]
            }
            resultDeaths[4] = DeathsData[4] - 0

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

setDeathsPlot();