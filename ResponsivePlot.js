let points, id

points = []
const a = [];
const b = [];
const c = [];

let a1 = 100;
let a2 = 80;
let a3 = 50

for (let i = 0; i < 1000; i++) {
    a1 += 5 - Math.random() * 10;
    a.push({
        x: i,
        y: a1
    });
    a2 += 5 - Math.random() * 10;
    b.push({
        x: i,
        y: a2
    });
    a3 += 5 - Math.random() * 10;
    c.push({
        x: i,
        y: a3
    });
}

points[0] = a
points[1] = b
points[2] = c

id = "plot-vax"


function setPlot(status, data, id) {

    id = "plot-vax"

    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data[0].length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[0][ctx.index - 1].getProps(['y'], true).y;

    var ctx = document.getElementById(id).getContext('2d')
    var graph_data = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                borderColor: 'red',
                borderWidth: 1,
                radius: 0,
                data: data[0],
            }, {
                borderColor: 'blue',
                borderWidth: 1,
                radius: 0,
                data: data[1],
            }, {
                borderColor: 'green',
                borderWidth: 1,
                radius: 0,
                data: data[3],
            }]
        },
        options: {
            animation: {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: delayBetweenPoints,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
                y: {
                    type: 'number',
                    easing: 'linear',
                    duration: delayBetweenPoints,
                    from: previousY,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * delayBetweenPoints;
                    }
                },
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: false
            },
            scales: {
                x: {
                    type: 'linear'
                }
            }
        }
    })
}

setPlot(points, "plot-vax")