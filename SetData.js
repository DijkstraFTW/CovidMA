let dates = []
let casesData = []
let resultData = []

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

        console.log(dates);
        console.log(resultData);
    },
    error: function(jqXHR, textStatus, errorThrow) {
        console.log(textStatus);
    }
});