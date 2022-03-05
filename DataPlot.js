var resultData
var resultDates
var resultDataSmooth
var datesSmooth

var datesD
var datesDSmooth
var resultDeaths
var resultDeathsSmooth


var testsDates
var testsData
var testsDataSmooth
var testDatesSmooth


function setCasesPlot() {

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    resultDates = []
    let dates = []

    casesData = []
    resultData = []

    resultDataSmooth = []
    datesSmooth = []

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

    datesD = []
    datesDSmooth = []
    DeathsData = []
    resultDeaths = []
    resultDeathsSmooth = []
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

            testsDates = []
            testsData = []

            testsDataSmooth = []
            testDatesSmooth = []

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
                            temp[6] == 0
                        }

                        if (temp[6] == '641') {
                            temp[6] = 14118
                        }


                        testsData.push(temp[6])
                        testsDates.push(temp[2])


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

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }


    if (resultData == undefined) {
        setCasesPlot()
    }

    if (resultDeaths == undefined) {
        setDeathsPlot()
        setTimeout(() => {
            setLethalityPlot()
            return;
        }, 100);
    }

    let lethality = []
    let lethalitySmooth = []
    let lethalityDatesSmooth = []

    let plot = [];
    let dates = [];
    let m = 0

    for (let index = 0; index < resultData.length; index++) {
        if (resultDeaths[index + 5] == resultData[index + 5]) {
            lethality[index] = 0
        } else {
            lethality[index] = ((parseInt(resultDeaths[index + 5]) / parseInt(resultData[index + 5])) * 100).toFixed(2)
        }
    }

    for (let k = 0; k < lethality.length; k++) {
        m += parseInt(lethality[k]);
        if ((k % 7) == 0) {
            lethalitySmooth.push((m / 7).toFixed(2))
            lethalityDatesSmooth.push(datesD[k + 5])
            m = 0;
        }
    }

    if (document.getElementById('smooth').checked) {
        plot = lethalitySmooth;
        dates = lethalityDatesSmooth
    } else {
        plot = lethality
        dates = datesD
    }

    var ctx = document.getElementById('plot-data').getContext('2d')
    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
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
                            return dates[value];
                        }
                    }
                },
                y: {
                    grid: {
                        display: true
                    },
                    ticks: {
                        callback: function(label, index, labels) {
                            return label + " %"
                        }
                    }
                }
            },
        }
    })
}

function setR0Plot() {

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    jQuery.ajax({
        url: "https://raw.githubusercontent.com/crondonm/TrackingR/main/Estimates-Database/database.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {

            let lines = data.split('\n');
            let fields = lines[0].split(',');

            let R0Dates = []
            let R0Data = []

            let R0DataSmooth = []
            let R0DatesSmooth = []

            let plot;
            let m = 0;


            let idf, temp;

            for (idf = 0; idf < data.length; idf++) {

                let temp = lines[idf].split(',');

                if (temp[0] == "Morocco") {
                    while (temp[0] == "Morocco") {
                        idf++

                        if (lines[idf].split(',')[0] != "Morocco") {
                            break
                        }

                        temp = lines[idf].split(',');

                        if (temp[2] == '') {
                            continue
                        } else {
                            R0Data.push(temp[2])
                            R0Dates.push(temp[1])
                        }

                    }

                    break
                }

            }

            for (let k = 0; k < R0Data.length; k++) {
                m += parseInt(R0Data[k])
                if ((k % 7) == 0) {
                    R0DataSmooth.push((m / 7).toFixed(2))
                    R0DatesSmooth.push(R0Dates[k])
                    m = 0
                }
            }

            if (document.getElementById('smooth').checked) {
                plot = R0DataSmooth;
                dates = R0DatesSmooth
            } else {
                plot = R0Data
                dates = R0Dates
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

    // new cases / new tests 

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    if (testsData == undefined) {
        setTestsPlot()
        setTimeout(() => {
            setPosRatePlot()
            return;
        }, 100);
    }

    let posRate = []
    let posRateSmooth = []
    let posRateDatesSmooth = []


    let plot = []
    let dates = []
    let m = 0



    for (let index = 0; index < testsData.length; index++) {
        posRate[index] = (((parseInt(resultData[index + 21]) / parseInt(testsData[index]))) * 100).toFixed(2)
    }

    for (let k = 0; k < posRate.length; k++) {
        m += parseInt(posRate[k]);
        if ((k % 7) == 0) {
            posRateSmooth.push((m / 7).toFixed(2))
            posRateDatesSmooth.push(testsDates[k])
            m = 0;
        }
    }

    // for (let index = 0; index < posRate.length; index++) {
    //     console.log(resultData[index + 21] + " " + testsData[index] + " : " + posRate[index])
    // }

    if (document.getElementById('smooth').checked) {
        plot = posRateSmooth;
        dates = posRateDatesSmooth
    } else {
        plot = posRate
        dates = testsDates
    }

    var ctx = document.getElementById('plot-data').getContext('2d')
    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
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
                    },
                    ticks: {
                        callback: function(label, index, labels) {
                            return label + " %"
                        }
                    }
                }
            },
        }
    })

}


setCasesPlot(); // default plot