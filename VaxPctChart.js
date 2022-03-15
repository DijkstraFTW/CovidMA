var vax1, vax2, remainder, obj

var valueXPrecedent = 0,
    valueYPrecedent = 0,
    index = 0;


var total = 0;
var widthSquares = 10,
    heightSquares = 10,
    squareSize = 28,
    squareValue = 0,
    gap = 4,
    theData = []

var color = ["#005bff", "#99bdff", "#E8070c"]
var dataType = ["1st Jab", "2nd Jab", "Not Yet Vaccinated"]




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


function setVaxPct(status, response) {

    obj = 30000000;

    vax1 = response['vaccine'];
    vax2 = response['fullyVaccined'];
    remainder = (obj - vax1);

    // console.log(vax1)
    // console.log(vax2)
    // console.log(remainder)

    // const rows = [
    //     ["at least 1 doses", vax1],
    //     ["2 doses", vax2],
    //     ["no doses", remainder]
    // ];

    // let csvContent = "data:text/csv;charset=utf-8,";

    // rows.forEach(function(rowArray) {
    //     let row = rowArray.join(",");
    //     csvContent += row + "\r\n";
    // });

    // var pom = document.createElement('a');
    // var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // var url = URL.createObjectURL(blob);
    // pom.href = url;
    // pom.setAttribute('download', 'foo.csv');
    // pom.click();

}


function setWaffleChart() {

    let w = 0,
        h = 0;

    d3.csv("data.csv", function(error, dataV) {

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

        console.log(theData);
        console.log(dataV);


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

                    if (colorNB < 2) {
                        colorNB++;
                    }

                    drawRect(theData, dataV, (indexX * (squareSize + gap)), indexY * (squareSize + gap) + pctY, squareSize - pctY, colorNB)



                    continue
                }

                drawRect(theData, dataV, (indexX * (squareSize + gap)), indexY * (squareSize + gap), pctY, colorNB)
                index++
            }
        }
    });
}


function drawRect(theData, dataV, w, h, pctY, colorNB) {

    var waffle = svg.append("rect")
        .data(theData)
        .attr("width", squareSize)
        .attr("height", pctY)
        .attr("fill", function(d) {
            return color[colorNB];
        })
        .attr("x", function(d, i) {
            return w
        })
        .attr("y", function(d, i) {
            return h
        })
        .append("title")
        .text(function(d, i) {
            if (colorNB == 1) {
                return dataV[colorNB].type + " | " + (vax1).toLocaleString() + " , " + ((vax1 / total) * 100).toFixed(2) + "%"
            }
            return dataV[colorNB].type + " | " + (dataV[colorNB].population).toLocaleString() + " , " + (dataV[colorNB].units).toFixed(2) + "%"
        });
}


getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/vaccination.json", setVaxPct);

setWaffleChart()