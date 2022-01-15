function setCasesPlot() {

    let dates = []
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
                    if (i == 190 && j > 3) {
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

            for (let i = 4; i < resultData.length; i++) {
                plot.push({
                    x: i,
                    y: resultData[i]
                });
            }

            const totalDuration = 1000;
            const delayBetweenPoints = totalDuration / plot.length;


            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        borderColor: 'red',
                        borderWidth: 1,
                        radius: 0,
                        data: plot,
                    }]
                },
                options: {
                    animation: {
                        x: {
                            type: 'number',
                            easing: 'linear',
                            duration: delayBetweenPoints,
                            from: NaN, // the point is initially skipped
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

setCasesPlot();