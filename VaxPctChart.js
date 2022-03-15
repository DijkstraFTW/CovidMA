var vax1, vax2, remainder, obj

var valueXPrecedent = 0,
    valueYPrecedent = 0,
    index = 0;

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


    var total = 0;
    var width,
        height,
        widthSquares = 10,
        heightSquares = 10,
        squareSize = 25,
        squareValue = 0,
        gap = 2,
        theData = [],
        index = 0;

    var color = ["#005bff", "#99bdff", "#E8070c"]

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

        width = (squareSize * widthSquares) + widthSquares * gap + 25;
        height = (squareSize * heightSquares) + heightSquares * gap + 25;

        console.log(theData);

        var waffle = d3.select("#waffle")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .selectAll("div")
            .data(theData)
            .enter()
            .append("rect")
            .attr("width", squareSize)
            .attr("height", function(d, i) {

                let result = squareSize

                // if (valueXPrecedent != 0) {

                //     temp = valueXPrecedent
                //     valueXPrecedent = 0
                //     result = (squareSize - temp)

                //     return result
                // }

                console.log(theData[i]["groupIndex"] + " " + (theData[i]["units"] - index));



                if (((theData[i]["units"] - index) < 2) && (theData[i]["groupIndex"] == 2)) {
                    temp2 = ((theData[i]["units"] - Math.floor(theData[i]["units"])))
                    result = (temp2 * squareSize)
                }


                if ((theData[i]["units"] - index) < 1) {

                    if (theData[i]["groupIndex"] == 1) {
                        temp2 = vax1 / total
                    } else {
                        temp2 = (d.units - Math.floor(d.units))
                    }

                    valueXPrecedent = (temp2 * squareSize)

                    result = (temp2 * squareSize)

                    index = 0

                    return result

                }
                index++;

                return result
            })
            .attr("fill", function(d) {
                return color[d.groupIndex];
            })
            .attr("x", function(d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .attr("y", function(d, i) {
                //group n squares for column
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .append("title")
            .text(function(d, i) {
                if (dataV[d.groupIndex].type == "1st Jab") {
                    return dataV[d.groupIndex].type + " | " + (vax1).toLocaleString() + " , " + ((vax1 / total) * 100).toFixed(2) + "%"
                }
                return dataV[d.groupIndex].type + " | " + (d.population).toLocaleString() + " , " + (d.units).toFixed(2) + "%"
            });
    });
}


getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/vaccination.json", setVaxPct);

setWaffleChart()