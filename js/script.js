var data = null;
var date = null;
var dateIndex = null;
var zoom = 100;
var interval = null;
const slider = document.getElementById("zoomRange");
const zvgZoom = document.getElementById("svgZoom");
const zoomValue = document.getElementById("zoomValue");

var ProvincesGenData = [];
var ProvincesDemog = [];


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

function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
}

function formatDate(x) {
    let l = x.split("-");
    return l[2] + "/" + l[1] + "/" + l[0];
}

function regionData(x) {

    let id = x.id.replace("pr-", "");
    let info = data[id - 1];

    document.getElementById("nbCases").style.backgroundColor = x.getAttribute("fill") + "";

    document.getElementById("region-selected").innerText = "Size : " + (ProvincesGenData[id - 1]["size"]).toLocaleString() + " km²\n" +
        "Population : " + ProvincesGenData[id - 1]["population"] + " hab.\n" +
        "Density : " + ProvincesGenData[id - 1]["density"] + "  hab/km²\n" +
        "Rural/Urban : \n" + ProvincesGenData[id - 1]["rural"] + " hab / " + ProvincesGenData[id - 1]["urban"] + " hab";


    document.getElementById("province").innerText = info.province;
    document.getElementById("region").innerText = info.region;
    document.getElementById("nbCases").innerText = info.cases[dateIndex];
    document.getElementById("evolution").setAttribute("province", id);
    document.getElementById("evolution").style.display = 'block';
}


function addShade(color) {
    let container = document.getElementById("scale");
    let shade = document.createElement("div");
    shade.setAttribute("class", "shade")
    shade.style.backgroundColor = color;
    container.appendChild(shade);
}

function setProvinceColor(province, index) {
    let id = "pr-" + province.id;
    let zone = document.getElementById(id);
    let color = "#00ff00";
    let nbCases = province.cases[index];

    if (nbCases == 0) { color = "#f2df91"; } else if (nbCases <= 10) { color = "#f9c467"; } else if (nbCases <= 20) { color = "#ffa83e"; } else if (nbCases <= 50) { color = "#ff8b24"; } else if (nbCases <= 100) { color = "#fd6a0b"; } else if (nbCases <= 200) { color = "#f04f09"; } else if (nbCases <= 500) { color = "#af1c43"; } else if (nbCases <= 1000) { color = "#701547"; } else if (nbCases <= 2000) { color = "4c0d3e"; } else { color = "#21130d"; }

    if (zone) {
        zone.setAttribute('fill', color);
    }
}

function setMap(status, response) {
    data = response['cases'];
    date = response['date'];
    dateIndex = date.length - 1;
    data.map(province => setProvinceColor(province, dateIndex));
    setDateRange();
    setProvincesGenData();
}

function setDateRange() {
    let container = document.getElementById("dateRange");
    let dateLabel = document.getElementById("dateLabel");
    let btn = document.createElement("button");
    let range = document.createElement("input");

    var today = new Date();
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    dateLabel.innerText = Months[today.getMonth()] + ' ' + date[date.length - 1][8] + date[date.length - 1][9] + ', ' + today.getFullYear();

    range.setAttribute("type", "range");
    range.setAttribute("min", 0);
    range.setAttribute("max", dateIndex);
    range.setAttribute("value", dateIndex);
    range.id = "range";
    range.oninput = resetMap;

    btn.onclick = function() { rePlayTime(this) };
    btn.innerHTML = '<img src="https://img.icons8.com/fluency-systems-filled/20/000000/play.png"/>';
    btn.id = "playBtn";
}

function resetMap() {
    let id = document.getElementById("range").value;
    document.getElementById("dateLabel").innerText = formatDate(date[id]);
    dateIndex = id;
    data.map(province => setProvinceColor(province, dateIndex));
    updateData();
}

function showBuble(x) {
    let posx = 0;
    let posy = 0;
    let id = x.id.replace("pr-", "");
    let info = data[id - 1];
    let pos = document.getElementById("region-name");

    if (!e) var e = window.event;
    if (e.clientX || e.clientY) {
        posx = e.clientX;
        posy = e.clientY;
    }

    pos.innerHTML = info.province + "<span class='nbCases'>" + info.cases[dateIndex] + "</span>";
    pos.style.left = posx - 600 + "px";
    pos.style.top = posy + "px";
    pos.style.display = 'block';
    pos.style.position = 'relative';
}

function setProvincesGenData() {

    d3.csv("data/ProvincesGenData.csv", function(d) {
        ProvincesGenData.push(d)
        return {
            id: d.id,
            name: d.name,
            size: d.size,
            population: d.population,
            density: d.density,
            rural: d.rural,
            urban: d.urban,
        }
    }, function test(params) {

        for (let index = 0; index < ProvincesGenData.length; index++) {
            ProvincesDemog.push(ProvincesGenData[index]);
        }
    })
}


function provinceHover(x) {
    let posx = 0;
    let posy = 0;
    let id = x.id.replace("pr-", "");
    let info = data[id - 1];

    if (!e) var e = window.event;
    if (e.clientX || e.clientY) {
        posx = e.clientX;
        posy = e.clientY;
    }
    //let pos = document.getElementById("region-selected");

    pos.style.left = 180 + "px";
    pos.style.top = 240 + "px";
    pos.style.display = 'block';
    pos.style.position = 'relative';

    console.log("left " + posx);
    console.log("top " + posy);

}


function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

function hideBuble() { document.getElementById('region-name').style.display = 'none'; }