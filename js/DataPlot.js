var casesData
var casesDates
var casesDataSmooth
var casesDatesSmooth

var deathsData
var deathsDates
var deathsDataSmooth
var deathsDatesSmooth


var testsDates
var testsData
var testsDataSmooth
var testDatesSmooth


var recovData
var recovDates
var recovDataSmooth
var recovDatesSmooth


var x = document.getElementById('loading')

function setCasesPlot() {

    x.style.display = "block"

    document.getElementById("smooth").disabled = false;

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let resultData = []
    let resultDates = []

    casesData = []
    casesDates = []
    casesDataSmooth = []
    casesDatesSmooth = []

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
                        resultDates[j] = fields[j]
                        resultData[j] = current[j]
                    }

                }
                output.push(doc);
            }

            for (let index = 5; index < resultData.length; index++) {
                casesData[index] = resultData[index] - resultData[index - 1]
            }
            casesData[4] = resultData[4] - 0

            for (let index = 5; index < resultDates.length; index++) {
                casesDates[index] = resultDates[index] + "";
            }

            for (let k = 5; k < casesData.length; k++) {
                m += casesData[k];
                if ((k % 7) == 0) {
                    casesDataSmooth.push(Math.ceil(m / 7))
                    casesDatesSmooth.push(casesDates[k])
                    m = 0;
                }
            }

            if (document.getElementById('smooth').checked) {
                plot = casesDataSmooth;
                dates = casesDatesSmooth
            } else {
                plot = casesData;
                dates = casesDates
            }

            x.style.display = "none"

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

    x.style.display = "block"

    document.getElementById("smooth").disabled = false;

    let chartStatus = Chart.getChart("plot-data");

    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let resultDeathsDates = []
    let resultDeaths = []

    deathsData = []
    deathsDates = []
    deathsDataSmooth = []
    deathsDatesSmooth = []

    let plot, dates
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
                        resultDeathsDates[j] = fields[j]
                        resultDeaths[j] = current[j]
                    }

                }
                output.push(doc);
            }

            for (let index = 5; index < resultDeaths.length; index++) {
                deathsData[index] = Math.floor(resultDeaths[index] - resultDeaths[index - 1])
                deathsDates[index] = resultDeathsDates[index]
            }

            for (let k = 5; k < deathsData.length; k++) {
                m += deathsData[k];
                if ((k % 7) == 0) {
                    deathsDataSmooth.push(Math.ceil(m / 7))
                    deathsDatesSmooth.push(deathsDates[k])
                    m = 0;
                }
            }

            if (document.getElementById('smooth').checked) {
                plot = deathsDataSmooth;
                dates = deathsDatesSmooth;
            } else {
                plot = deathsData;
                dates = deathsDates;
            }

            x.style.display = "none"

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

    x.style.display = "block"

    document.getElementById("smooth").disabled = false;

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

            let test = []

            let corr = []

            let IndCorr = 0



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

                        if (temp[7] == '') {
                            temp[7] == 0
                            test.push(temp[2])
                        }

                        if (temp[7] == '641') {
                            temp[7] = 14118
                        }


                        testsData.push(temp[7])
                        testsDates.push(temp[2])


                    }

                    break
                }

            }

            console.log(test);

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

            x.style.display = "none"

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

function setRecoveriesPlot(status, response) {

    x.style.display = "block"
    document.getElementById("smooth").disabled = false;

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    recovData = []
    recovDates = []
    recovDataSmooth = []
    recovDatesSmooth = []

    let plot;
    let m = 0;

    let idf;


    let corr = [1746, 2218, 1441, 1877, 2785, 2462, 1421, 2747, 2643, 2349, 2300, 2018, 2788, 2133, 2747, 1823, 2553, 2091, 1964, 2497, 2077, 2953, 2392, 2591, 2847, 4247, 3690, 1416, 532, 619, 808, 299, 426, 5021, 7799, 9522, 9188, 7163, 2548, 211, 266, 283, 239, 1147, 4229, 2197, 86]

    let IndCorr = 0

    for (idf = 0; idf < response["features"].length; idf++) {

        if (response["features"][idf]["attributes"]["Rétablis_par_jour"] == undefined) {
            recovData.push(corr[IndCorr])
            recovDates.push(casesDates[idf + 14])
            IndCorr++

            continue
        }

        recovData.push(response["features"][idf]["attributes"]["Rétablis_par_jour"])
        recovDates.push(casesDates[idf + 14])
    }

    for (let k = 0; k < response["features"].length; k++) {
        m += parseInt(recovData[k])
        if ((k % 7) == 0) {
            recovDataSmooth.push(Math.ceil(m / 7))
            recovDatesSmooth.push(recovDates[k])
            m = 0
        }
    }

    if (document.getElementById('smooth').checked) {
        plot = recovDataSmooth;
        dates = recovDatesSmooth
    } else {
        plot = recovData
        dates = recovDates
    }

    x.style.display = "none"

    var ctx = document.getElementById('plot-data').getContext('2d')
    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                borderColor: 'purple',
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
}

function setLethalityPlot() {

    document.getElementById("smooth").disabled = false;
    x.style.display = "block"

    let chartStatus = Chart.getChart("plot-data");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }


    if (casesData == undefined) {
        setCasesPlot()
    }

    if (deathsData == undefined) {
        setDeathsPlot()
        setTimeout(() => {
            setLethalityPlot()
            return;
        }, 100);
    }

    let lethality = []
    let lethalityDates = []
    let lethalitySmooth = []
    let lethalityDatesSmooth = []

    let plot = [];
    let dates = [];
    let m = 0

    let tempCases = 0,
        tempDeaths = 0;


    for (let index = 38; index < casesData.length; index++) {

        tempCases += parseInt(casesData[index - 1 + 5]) + parseInt(casesData[index + 5])
        tempDeaths += parseInt(deathsData[index - 1 + 5]) + parseInt(deathsData[index + 5])

        lethality.push(((tempDeaths / tempCases) * 100).toFixed(2))
        lethalityDates.push(casesDates[index + 5])
    }


    console.log(lethalityDates);
    console.log(lethality);


    for (let k = 0; k < lethality.length; k++) {
        m += parseInt(lethality[k]);
        if ((k % 7) == 0) {
            lethalitySmooth.push((m / 7).toFixed(2))
            lethalityDatesSmooth.push(casesDates[k + 5])
            m = 0;
        }
    }

    if (document.getElementById('smooth').checked) {
        plot = lethalitySmooth;
        dates = lethalityDatesSmooth
    } else {
        plot = lethality
        dates = lethalityDates
    }

    x.style.display = "none"

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

    x.style.display = "block"

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

            let R0Data_U_95 = []
            let R0Data_U_65 = []

            let R0Data_L_95 = []
            let R0Data_L_65 = []

            let plot;

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

                            R0Data_U_95.push(temp[3])
                            R0Data_L_95.push(temp[4])

                            R0Data_U_65.push(temp[5])
                            R0Data_L_65.push(temp[6])
                        }

                    }

                    break
                }

            }

            document.getElementById("smooth").checked = false;
            document.getElementById("smooth").disabled = true;

            x.style.display = "none"

            plot = R0Data
            dates = R0Dates

            var ctx = document.getElementById('plot-data').getContext('2d')
            var graph_data = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                            borderColor: 'purple',
                            borderWidth: 1,
                            radius: 3,
                            data: plot,
                            label: "R ",
                        },
                        {
                            borderColor: 'purple',
                            borderColor: "transparent",
                            backgroundColor: "rgb(75, 192, 255, 0.4)",
                            radius: 1,
                            data: R0Data_U_95,
                            label: "CI at 95% ",
                            fill: 0
                        }, {
                            borderColor: 'purple',
                            borderColor: "transparent",
                            backgroundColor: "rgb(75, 192, 255, 0.4)",
                            radius: 1,
                            data: R0Data_L_95,
                            label: "CI at 95% ",
                            fill: 0
                        },
                        {
                            borderColor: 'purple',
                            borderColor: "transparent",
                            backgroundColor: "rgba(7, 14, 206, 0.3)",
                            radius: 1,
                            data: R0Data_U_65,
                            label: "CI at 65% ",
                            fill: 0
                        }, {
                            borderColor: 'purple',
                            borderColor: "transparent",
                            backgroundColor: "rgba(7, 14, 206, 0.3)",
                            radius: 1,
                            data: R0Data_L_65,
                            label: "CI at 65% ",
                            fill: 0
                        }
                    ],
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

    x.style.display = "blck"
    document.getElementById("smooth").disabled = false;

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
        posRate[index] = (((parseInt(casesData[index + 21]) / parseInt(testsData[index]))) * 100).toFixed(2)
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

    x.style.display = "none"

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

function setRecoveryPlot() {

    x.style.display = "block"
    document.getElementById("smooth").disabled = false;

    let chartStatus = Chart.getChart("plot-data");

    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    recovRData = []
    recovRDates = []
    recovRDataSmooth = []
    recovRDatesSmooth = []

    let plot;
    let m = 0;

    let idf, temp;

    for (idf = 0; idf < recovData.length; idf++) {
        recovRData.push(((parseInt(casesData[idf + 14]) / parseInt(recovData[idf]))).toFixed(2))
        recovRDates.push(casesDates[idf + 14])
    }


    for (let k = 0; k < recovRData.length; k++) {
        m += parseInt(recovRData[k])
        if ((k % 7) == 0) {
            recovRDataSmooth.push((m / 7).toFixed(2))
            recovRDatesSmooth.push(recovRDates[k])
            m = 0
        }
    }

    if (document.getElementById('smooth').checked) {
        plot = recovRDataSmooth;
        dates = recovRDatesSmooth
    } else {
        plot = recovRData
        dates = recovRDates
    }

    x.style.display = "none"

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
}

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


setCasesPlot(); // default plot