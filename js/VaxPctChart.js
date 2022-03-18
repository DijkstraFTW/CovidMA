var vax1, vax2, remainder, obj

var vax3

var valueXPrecedent = 0,
    valueYPrecedent = 0,
    index = 0;


var total = 30000000,
    dataV = [];

var widthSquares = 10,
    heightSquares = 10,
    squareSize = 28,
    squareValue = 0,
    gap = 4,
    theData = []

var color = ["#070ECE", "#005bff", "#99bdff", "#E8070c"]
var dataType = ["3rd Jab", "2nd Jab", "1st Jab", "Not Yet Vaccinated"]
var dataPopulation = []



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


function setLastVaxData(status, response) {
    vax3 = response["dose_3_total"]

}


function setVaxPct(status, response) {

    obj = 30000000;

    vax1 = response['vaccine'];
    vax2 = response['fullyVaccined'];
    remainder = (obj - vax1);

    //console.log(vax1 - vax3)

    dataPopulation.push(vax3)
    dataPopulation.push(vax2)
    dataPopulation.push(vax1 - vax2)
    dataPopulation.push(remainder)

    for (let index = 0; index < 4; index++) {
        dataV.push({ type: dataType[index], population: dataPopulation[index], units: ((dataPopulation[index]) / (total / (widthSquares * heightSquares))) })
    }

    setWaffleChart()

}


function setWaffleChart() {

    let w = 0,
        h = 0;

    //total
    total = d3.sum(dataV, function(d) { return d.population; });

    //value of a square
    squareValue = total / (widthSquares * heightSquares);

    //remap data
    dataV.forEach(function(d, i) {
        d.population = +d.population;
        d.units = (d.population / squareValue);
        theData = theData.concat(
            Array(Math.floor(d.units + 2)).join(1).split('').map(function() {
                return {
                    squareValue: squareValue,
                    units: d.units,
                    population: d.population,
                    groupIndex: i
                };
            })
        );
    });
    theData.splice(theData.length - 1)


    w = (squareSize * widthSquares) + widthSquares * gap + 25;
    h = (squareSize * heightSquares) + heightSquares * gap + 25;

    svg = d3.select("#waffle")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    let index = 0,
        colorNB = 0;

    for (let indexY = 0; indexY < 10; indexY++) {
        for (let indexX = 0; indexX < 10; indexX++) {

            let pctY = squareSize


            if ((theData[indexY * 10 + indexX]["units"] - index) < 1) {

                pctY = ((theData[indexY * 10 + indexX]["units"] - index) * squareSize)
                index = 0;

                if ((theData[indexY * 10 + indexX]["groupIndex"] == 1)) {
                    pctY = (((((vax1 / total) * 100) - Math.floor((vax1 / total) * 100))) * squareSize)
                }

                drawRect(theData, dataV, (indexX * (squareSize + gap)), indexY * (squareSize + gap), pctY, colorNB)

                if (colorNB < 3) {
                    colorNB++;
                }

                drawRect(theData, dataV, (indexX * (squareSize + gap)), indexY * (squareSize + gap) + pctY, squareSize - pctY, colorNB)



                continue
            }

            drawRect(theData, dataV, (indexX * (squareSize + gap)), indexY * (squareSize + gap), pctY, colorNB)
            index++
        }
    }
}


function drawRect(theData, dataV, w, h, pctY, colorNB) {

    var waffle = svg.append("rect")
        .data(theData)
        .attr("width", squareSize)
        .attr("height", pctY)
        .attr("fill", function(d) {
            return color[colorNB];
        })
        .attr("rx", 3).attr("ry", 3)
        .attr("x", function(d, i) {
            return w
        })
        .attr("y", function(d, i) {
            return h
        })
        .append("title")
        .text(function(d, i) {
            if (colorNB == 2) {
                return dataV[colorNB].type + " | " + (vax1).toLocaleString() + " , " + ((vax1 / 30000000) * 100).toFixed(2) + "%"
            }
            if (colorNB == 1) {
                return dataV[colorNB].type + " | " + (vax2).toLocaleString() + " , " + ((vax2 / 30000000) * 100).toFixed(2) + "%"
            }
            if (colorNB == 0) {
                return dataV[colorNB].type + " | " + (vax3).toLocaleString() + " , " + ((vax3 / 30000000) * 100).toFixed(2) + "%"
            }
            return dataV[colorNB].type + " | " + (remainder).toLocaleString() + " , " + ((remainder / 30000000) * 100).toFixed(2) + "%"
        });
}



getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/resume.json", setLastVaxData);
getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/vaccination.json", setVaxPct);