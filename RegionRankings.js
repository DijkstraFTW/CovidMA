var sum = 0;
var rankings = {};
var index = 0;
var data = null;
var rank = 1;


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

function setRankings(status, response) {

    data = response['cases'];

    while (index !== 76) {

        data[index]["cases"].forEach(element => {
            sum += element;
        });

        if (data[index]["id"] == 75) {

            rankings[data[index]["region"]] = sum;
            //console.log(data[index]["region"] + "  " + sum);
            document.getElementById("rank").innerHTML += rank + "." + "<br></br>";
            document.getElementById("rankings").innerHTML += data[index]["region"] + "<br></br>";
            document.getElementById("rankings-data").innerHTML += sum + "<br></br>";

            sum = 0;
            index++;
            rank++;

            break;
        }


        if (data[index]["region"] !== data[index + 1]["region"]) {

            rankings[data[index]["region"]] = sum;
            //console.log(data[index]["region"] + "  " + sum);
            document.getElementById("rank").innerHTML += rank + "." + "<br></br>";
            document.getElementById("rankings").innerHTML += data[index]["region"] + "<br></br>";
            document.getElementById("rankings-data").innerHTML += sum + "<br></br>";

            sum = 0;
            rank++;
        }

        index++;

    }

}

getJSON("https://raw.githubusercontent.com/medias24-src/covid-data/main/map.json", setRankings);