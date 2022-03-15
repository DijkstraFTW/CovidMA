var data = null;
var date = null;
var dateIndex = null;
var zoom = 100;
var interval = null;
const slider = document.getElementById("zoomRange");
const zvgZoom = document.getElementById("svgZoom");
const zoomValue = document.getElementById("zoomValue");

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

function drawLine(cases) {
    let svgWidth = 400;
    let svgHeight = 150;
    let points = "";
    let max = Math.max(...cases);
    let step = ((svgWidth - 4) / cases.length);
    let x = 2
    for (i = 0; i <= dateIndex; i++) {
        let y = (cases[i] * (svgHeight - 4) / max) + 2;
        coo = x + "," + y + " ";
        x += step;
        points += coo;
    }

    return "\
    <polyline id='lineChart' stroke='rgb(219, 88, 88)' fill='none' stroke-width='1' points='" + points + "' /> \
    <circle cx='" + (2 + (step * dateIndex)) + "' cy='" + ((cases[dateIndex] * (svgHeight - 4) / max) + 2) + "' r='2' fill='#9b0000' stroke-width='1' fill='blue' /> \
    "
}

function formatDate(x) {
    let l = x.split("-");
    return l[2] + "/" + l[1] + "/" + l[0];
}

function regionData(x) {
    let id = x.id.replace("pr-", "");
    let info = data[id - 1];
    document.getElementById("province").innerText = info.province;
    document.getElementById("region").innerText = info.region;
    document.getElementById("nbCases").innerText = info.cases[dateIndex];
    document.getElementById("evolution").setAttribute("province", id);
    document.getElementById("evolution").style.display = 'block';
    document.getElementById("chart").innerHTML = drawLine(info.cases);
}

function updateData(x) {
    let id = document.getElementById("evolution").getAttribute("province");
    if (id) {
        let info = data[id - 1];
        document.getElementById("province").innerText = info.province;
        document.getElementById("region").innerText = info.region;
        document.getElementById("nbCases").innerText = info.cases[dateIndex];
        document.getElementById("chart").innerHTML = drawLine(info.cases);
    }
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
}

function playTime(btn) {
    btn.innerHTML = '<img src="https://img.icons8.com/fluency-systems-filled/20/000000/pause.png"/>';
    btn.onclick = function() { stopTime(this) };

    interval = setInterval(function() {
        let newVal = (parseInt(dateIndex) + 1);
        if (newVal < date.length) {
            dateIndex = newVal % date.length;
            document.getElementById("range").value = dateIndex;
            resetMap();
        } else {
            stopTime(btn);
            btn.onclick = function() { rePlayTime(this) };
        }
    }, 100);
}

function stopTime(btn) {
    clearInterval(interval);
    btn.innerHTML = '<img src="https://img.icons8.com/fluency-systems-filled/20/000000/play.png"/>';
    btn.onclick = function() { playTime(this) };
}

function rePlayTime(btn) {
    dateIndex = -1;
    playTime(btn)
}

function setDateRange() {
    let container = document.getElementById("dateRange");
    let dateLabel = document.getElementById("dateLabel");
    let btn = document.createElement("button");
    let range = document.createElement("input");


    var today = new Date();
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var day = new Date(today.getFullYear(), Months[today.getMonth()], 1);

    var Day = Days[today.getDay()];

    dateLabel.innerText = Day + ', ' + Months[today.getMonth()] + ' ' + today.getMonth() + ', ' + today.getFullYear();

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

function moreZoom(x) {
    zoom = zoom + x < 100 ? 100 : zoom + x;
    zvgZoom.style.transform = `scale(${zoom / 100})`;
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

    //console.log("left " + posx);
    //console.log("top " + posy);
}

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

function hideBuble() { document.getElementById('region-name').style.display = 'none'; }