function setCasesPlot() {

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let dates = []
    let resultDates = []
    let casesData = []
    let resultData = []
    let resultDataSmooth = []
    let datesSmooth = []
    let m = 0
    let plot = null;

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

            for (let k = 5; k < resultData.length; k++) {
                m += resultData[k];
                if ((k % 7) == 0) {
                    resultDataSmooth.push(Math.ceil(m / 7))
                    datesSmooth.push(dates[k])
                    m = 0;
                }
            }

            if (document.getElementById('smooth').checked) {
                plot = resultDataSmooth;
                datesFormat = datesSmooth
            } else {
                plot = resultData;
                datesFormat = dates
            }


            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: datesFormat,
                    datasets: [{
                        borderColor: 'blue',
                        borderWidth: 1,
                        radius: 3,
                        data: plot,
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
                                    return dates[value];
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

}

function setDeathsPlot() {


    let chartStatus = Chart.getChart("plot-data");

    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let datesD = []
    let datesDSmooth = []
    let DeathsData = []
    let resultDeaths = []
    let resultDeathsSmooth = []
    let plot = null
    let m = 0

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

            for (let k = 5; k < resultDeaths.length; k++) {
                m += resultDeaths[k];
                if ((k % 7) == 0) {
                    resultDeathsSmooth.push(Math.ceil(m / 7))
                    datesDSmooth.push(datesD[k])
                    m = 0;
                }
            }

            if (document.getElementById('smooth').checked) {
                plot = resultDeathsSmooth;
                datesDFormat = datesDSmooth;
            } else {
                plot = resultDeaths;
                datesDFormat = datesD;
            }

            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: datesDFormat,
                    datasets: [{
                        borderColor: 'red',
                        borderWidth: 1,
                        radius: 3,
                        data: plot,
                    }]
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
                                    return datesD[value];
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

}

function setTestsPlot() {

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    jQuery.ajax({
        url: "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/testing/covid-testing-all-observations.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {

            let lines = data.split('\n');
            let fields = lines[0].split(',');

            let testsDates = []
            let testsData = []

            let testsDataSmooth = []
            let testDatesSmooth = []

            let plot;
            let m = 0;


            let idf, temp;

            for (idf = 0; idf < data.length; idf++) {

                let temp = lines[idf].split(',');

                if (temp[1] == "MAR") {
                    while (temp[1] == "MAR") {
                        idf++

                        if (lines[idf].split(',')[1] != "MAR") {
                            break
                        }

                        temp = lines[idf].split(',');

                        if (temp[6] == '') {
                            continue
                        } else {
                            testsData.push(temp[6])
                            testsDates.push(temp[2])
                        }

                    }

                    break
                }

            }

            for (let k = 0; k < testsData.length; k++) {
                m += parseInt(testsData[k])
                if ((k % 7) == 0) {
                    testsDataSmooth.push(Math.ceil(m / 7))
                    testDatesSmooth.push(testsDates[k])
                    m = 0
                }
            }

            console.log(testsData)
            console.log(testsDataSmooth)

            if (document.getElementById('smooth').checked) {
                plot = testsDataSmooth;
                dates = testDatesSmooth
            } else {
                plot = testsData
                dates = testsDates
            }

            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        borderColor: 'green',
                        borderWidth: 1,
                        radius: 3,
                        data: plot,
                    }]
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
                                    return dates[value];
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

}

function setLethalityPlot() {

    // num deaths/Number cases

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


            console.log(casesData)
            console.log(resultData)


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
                                maxTicksLimit: 9,
                                beginAtZero: true,
                                callback: function(value, index, values) {
                                    return dates[value];
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

}

function setR0Plot() {

    // https://raw.githubusercontent.com/crondonm/TrackingR/main/Estimates-Database/database.csv


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


            console.log(casesData)
            console.log(resultData)


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
                                maxTicksLimit: 9,
                                beginAtZero: true,
                                callback: function(value, index, values) {
                                    return dates[value];
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

}

function setPosRatePlot() {

    // https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/testing/covid-testing-all-observations.csv


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


            console.log(casesData)
            console.log(resultData)


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
                                maxTicksLimit: 9,
                                beginAtZero: true,
                                callback: function(value, index, values) {
                                    return dates[value];
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

}


setTestsPlot(); // default plot