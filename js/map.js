var data = null;
var date = null;
var dateIndex = null;
var dataRT_regions = null;
var dateIncrement;

var ProvincesGenData = [];
var ProvincesDemog = [];

var regions_list = [
    'Casablanca - Settat',
    'Rabat - Salé - Kénitra',
    'Tanger - Tétouan - Al Hoceima',
    'Souss - Massa',
    'Guelmim - Oued Noun',
    'Laâyoune - Sakia El Hamra',
    'Dakhla - Oued Eddahab',
    'Drâa - Tafilalet',
    'Marrakech - Safi',
    'Béni Mellal - Khénifra',
    'Fès - Meknès',
    "L'Oriental"
];

var provinces_indexes = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34],
    [35, 36, 37, 38],
    [39, 40],
    [41, 42, 43, 44, 45],
    [46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58],
    [59, 60, 61, 62, 63, 64, 65, 66],
    [67, 68, 69, 70, 71, 72, 73, 74, 75],
]
var ml = [];


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
    let RTindex = 0;

    for (let i = 0; i < provinces_indexes.length; i++) {
        for (let j = 0; j < provinces_indexes[i].length; j++) {
            if (provinces_indexes[i][j] == id) {
                info.region = regions_list[i];
            }
        }
    }

    document.getElementById("nbCases-card").style.backgroundColor = x.getAttribute("fill") + "";

    for (let index = 0; index < dataRT_regions.length; index++) {
        if (info.region == dataRT_regions[index]["name"]) {
            document.getElementById("rt-region").innerText = "Region's Rt : " + dataRT_regions[index]["ml"];
            RTindex = index;
        }
    }

    document.getElementById("rt-region").style.backgroundColor = getGradientRT(dataRT_regions[RTindex]["ml"]);

    document.getElementById("region-selected").innerText = "Size : " + Number(ProvincesGenData[id - 1]["size"]).toLocaleString() + " km²\n" +
        "Population : " + Number(ProvincesGenData[id - 1]["population"]).toLocaleString() + " hab.\n" +
        "Density : " + Number(ProvincesGenData[id - 1]["density"]).toLocaleString() + "  hab/km²\n" +
        "Rural/Urban : \n" + Number(ProvincesGenData[id - 1]["rural"]).toLocaleString() + " hab / " + Number(ProvincesGenData[id - 1]["urban"]).toLocaleString() + " hab";


    document.getElementById("province").innerText = info.province.replace(/([a-z])([A-Z])/g, '$1 $2');
    document.getElementById("region").innerText = info.region;
    document.getElementById("nbCases-card").innerText = "+" + info.cases[dateIndex];
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

    if (dateIncrement == 0) {
        dateIncrement = 1;
    }
    dateIndex = date.length - dateIncrement;

    data.map(province => setProvinceColor(province, dateIndex));
    setDateRange();
    setProvincesGenData();
}

function setDateRange() {
    let dateLabel = document.getElementById("dateLabel");

    const today = date[date.length - dateIncrement].split('-');
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    dateLabel.innerText = Months[Number(today[1]) - 1] + ' ' + Number(today[2]) + ', ' + today[0];

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

    if (info.province == "Eljadida") {
        info.province = "El Jadida";
    }

    if (info.province == 'Sidibennour') {
        info.province = 'Sidi Bennour';
    }

    pos.innerHTML = info.province.replace(/([a-z])([A-Z])/g, '$1 $2') + "<span class='nbCases'>" + info.cases[dateIndex] + "</span>";
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

function setRegionRt(status, response) {
    dataRT_regions = response['data'];
}

function getGradientRT(ml) {

    let color = null;

    switch (true) {
        case ml < 0.5:
            color = "#f2df91";
            break;
        case ml < 0.8:
            color = "#ffa83e";
            break;
        case ml < 1:
            color = "#fd6a0b";
            break;
        case ml < 1.5:
            color = "#f04f09";
            break;
        case ml < 2:
            color = "#701547";
            break;
    }
    return color
}

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

function hideBuble() { document.getElementById('region-name').style.display = 'none'; }