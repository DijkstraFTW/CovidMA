var vax1, vax2, remainder, obj

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
        theData = [];

    var color = ["#005bff", "#99bdff", "#E8070c"]

    d3.csv("data.csv", function(error, dataV) {

        //total
        total = 30000000

        //value of a square
        squareValue = total / (widthSquares * heightSquares);

        //remap data
        dataV.forEach(function(d, i) {
            d.population = +d.population;
            d.units = (d.population / squareValue);
            theData = theData.concat(
                Array(Math.floor(d.units + 1)).join(1).split('').map(function() {
                    return {
                        squareValue: squareValue,
                        units: d.units,
                        population: d.population,
                        groupIndex: i
                    };
                })
            );
        });

        width = (squareSize * widthSquares) + widthSquares * gap + 25;
        height = (squareSize * heightSquares) + heightSquares * gap + 25;

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
            .attr("height", squareSize)
            .attr("fill", function(d) {
                return color[d.groupIndex];
            })
            .attr("x", function(d, i) {

                //group n squares for column
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr("y", function(d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
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