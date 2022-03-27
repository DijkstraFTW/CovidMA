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

            let corr = [8896, 8626, 20215, 21033, 11729, 12850, 8572, 4795, 9854, 12698, 13867, 9355, 9509, 8078, 25742, 45232, 34104, 33412, 33131, 20528, 19629, 14601, 7330, 13534, 15098, 11793, 5797, 10441, 12885, 10542, 17120, 9374, 5195, 13803, 14876, 32055, 16197, 12655, 32055, 13011, 7413, 15940, 15213, 11999, 8791, 10938, 12203, 7201, 7258, 5733, 7565, 6877, 7048]
            let IndCorr = 0

            let idf, temp, cpt;

            for (idf = 0; idf < data.length; idf++) {

                let temp = lines[idf].split(',');

                cpt = 0

                if (temp[1] == "MAR") {
                    while (temp[1] == "MAR") {
                        idf++
                        cpt++

                        if (lines[idf].split(',')[1] != "MAR") {
                            break
                        }

                        temp = lines[idf].split(',');

                        if (temp[7] == '' && (cpt >= 40)) {

                            testsData.push(corr[IndCorr])
                            testsDates.push(temp[2])
                            test.push(temp[2] + " " + corr[IndCorr])

                            IndCorr++
                            continue
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
    let lethalityDaily = []
    let lethalityDailyDates = []


    let m = 0

    let tempCases = 0,
        tempDeaths = 0;


    for (let index = 38; index < casesData.length; index++) {

        tempCases += parseInt(casesData[index - 1 + 5]) + parseInt(casesData[index + 5])
        tempDeaths += parseInt(deathsData[index - 1 + 5]) + parseInt(deathsData[index + 5])

        if (((tempDeaths / tempCases) * 100) > 8) {
            lethality.push(0)
            continue
        }

        lethality.push(((tempDeaths / tempCases) * 100).toFixed(2))
        lethalityDates.push(casesDates[index + 5])
    }

    for (let index = 38; index < casesData.length; index++) {
        if (deathsData[index + 5] == 1 && casesData[index + 5] == 1) {
            lethalityDaily.push(0)
        } else {
            lethalityDaily.push(((parseInt(deathsData[index + 5]) / parseInt(casesData[index + 5])) * 100).toFixed(2))
        }
    }


    document.getElementById("smooth").checked = false;
    document.getElementById("smooth").disabled = true;

    x.style.display = "none"

    var ctx = document.getElementById('plot-data').getContext('2d')
    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lethalityDates,
            datasets: [{
                    borderColor: 'red',
                    borderWidth: 1,
                    radius: 3,
                    data: lethality,
                    label: "Cumulative",
                    fill: false
                },
                {
                    borderColor: 'grey',
                    borderWidth: 1,
                    radius: 3,
                    data: lethalityDaily,
                    label: "Daily",
                    fill: true
                }
            ]
        },
        options: {
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    display: true
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
                            return lethalityDates[value];
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

function setRtPlot() {

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

    x.style.display = "block"
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

        if (testsData[index] == 0) {
            posRate[index] = 0.00
            continue
        }
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

    if (casesData == undefined) {
        setCasesPlot()
    }

    if (recovData == undefined) {
        getJSON('https://services3.arcgis.com/hjUMsSJ87zgoicvl/arcgis/rest/services/Covid_19/FeatureServer/5/query?where=1%3D1&outFields=Date,Cas_confirm%C3%A9s_par_jour,Cas_d%C3%A9c%C3%A9d%C3%A9s_par_jour,R%C3%A9tablis_par_jour,Tests_pas_jour,Retablis&returnGeometry=false&outSR=4326&f=json', setRecoveriesPlot)
        setTimeout(() => {
            setRecoveryPlot()
            return;
        }, 170);
    }

    recovRData = []
    recovRDates = []
    recovRDaily = []
    recovRDailyDates = []

    let plot;
    let m = 0;

    let idf, temp;


    let tempCases = 0,
        tempRecoveries = 0;


    for (let index = 5; index < recovData.length; index++) {

        tempCases += parseInt(casesData[index - 1 + 5 + 9]) + parseInt(casesData[index + 5 + 9])
        tempRecoveries += parseInt(recovData[index - 1]) + parseInt(recovData[index])

        if (tempCases == 0) {
            recovRData.push(0)
            continue
        }

        recovRData.push((100 - (tempRecoveries / tempCases)).toFixed(2))
        recovRDates.push(recovDates[index + 8])
    }

    //console.log(recovRData);

    // console.log(recovRDates);

    // console.log(recovData);

    // console.log(casesData[18]);



    for (idf = 0; idf < recovData.length; idf++) {
        recovRDaily.push(10 * ((parseInt(casesData[idf + 14]) / parseInt(recovData[idf]))).toFixed(2))
    }

    console.log(recovRDates);



    document.getElementById("smooth").checked = false;
    document.getElementById("smooth").disabled = true;

    x.style.display = "none"

    var ctx = document.getElementById('plot-data').getContext('2d')
    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            labels: recovRDates,
            datasets: [{
                borderColor: 'green',
                borderWidth: 1,
                radius: 3,
                data: recovRData,
                label: "Cumulative"
            }, {
                borderColor: 'grey',
                borderWidth: 1,
                radius: 3,
                data: recovRDaily,
                label: "Daily divided by 10",
                fill: true
            }]
        },
        options: {
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    display: true
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
                            return recovRDates[value];
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