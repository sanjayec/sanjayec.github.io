
function bubbleChart() {
    var width = 1024;
    var height = 768;
    var tooltip = floatingTooltip('gates_tooltip', 240);
    var center = {x: width / 2, y: height / 2};

    var regionCenters = {
        hatchback: {x: 3 * width / 16, y: height / 3},
        convertible: {x: width / 3.7, y: 3.5 * height / 6},
        sedan: {x: 3 * width / 8, y: height / 3},
        wagon: {x: 1.2 * width / 2, y: 1.8 * height / 3},
        hardtop: {x: 5 * width / 7.5, y: height / 3}
        
        
    };

    var regionTitles = {
        hatchback: {x: width / 10, y: height / 8},
        convertible: {x: 9 * width / 39, y: 9 * height / 15},
        sedan: {x: 7 * width / 20, y: height / 12},
        wagon: {x: 1.3 * width / 2, y: 8.9 * height / 17},
        hardtop: {x: 14 * width / 19, y: height / 5}
        
        
    };

    var productCenters = { 
       fwd: {x: 3 * width / 16, y: height / 3.7},
        "4wd": {x: width / 3, y: 3 * height / 5},
        rwd : {x: 3.5 * width / 6.5, y: height / 3.3}
        
    };
    var productTitles = { 
        fwd: {x: 3 * width / 18.5, y: height / 19},
        "4wd": {x: width / 3, y: 3.5 * height / 5.8},
        rwd: {x: 3.5 * width / 6, y: height / 18}
    };

    var forceStrength = 0.03;
    var bubbles = null;
    var nodes = [];
    var bubble_svg=null;

    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    }

    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    simulation.stop();

    var fillColor = d3.scaleOrdinal(d3.schemeCategory20c)
        .domain(['AP', 'AS', 'EE', 'LA', 'ME', 'NA', 'WE']);

    function createNodes(rawData) {

        var maxAmount = d3.max(rawData, function (d) {
            return +d.price;
        });

        var radiusScale = d3.scalePow()
            .exponent(0.15)
            .range([2, 35])
            .domain([0, maxAmount]);


        var myNodes = rawData.map(function (d) {
            return {
                id: d.id,
                radius: radiusScale(+d["city-mpg"]),
                growth_percent: +d["city-mpg"],
                product: d["num-of-cylinders"],
                brand: d["make"],
                region: d["body-style"],
                country: d["engine-location"],
                category: d["drive-wheels"],
                highwayMpg: d["highway-mpg"],
                x: Math.random() * 900,
                y: Math.random() * 800
            };
        });

        myNodes.sort(function (a, b) {
            return b.growth_percent - a.growth_percent;
        });

        return myNodes;
    }


    var chart = function (selector, rawData) {
        nodes = createNodes(rawData);
        bubble_svg = d3.select(selector)
            .append('svg')
            .attr('id', 'bubble_svg')
            .attr('width', width)
            .attr('height', height);

        bubbles = bubble_svg.selectAll('.bubble')
            .data(nodes, function (d) {
                return d.id;
            });

        var bubblesE = bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('fill', function (d) {
                return fillColor(d.region);
            })
            .attr('stroke', function (d) {
                return d3.rgb(fillColor(d.region)).darker();
            })
            .attr('stroke-width', 2)
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        bubbles = bubbles.merge(bubblesE);

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) {
                return d.radius;
            });

        simulation.nodes(nodes);
        groupBubbles();
    };

    function ticked() {
        bubbles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });
    }

    function nodeRegionPosX(d) {
        return regionCenters[d.region].x;
    }

    function nodeRegionPosY(d) {
        return regionCenters[d.region].y;
    }

    function nodeProductPosX(d) {
        return productCenters[d.category].x;
    }

    function nodeProductPosY(d) {
        return productCenters[d.category].y;
    }

    function groupBubbles() {
        hideTitles('.region');
        hideTitles('.product');
        d3.selectAll("#bubble_region_annotation").remove();
        d3.selectAll("#bubble_product_annotation").remove();
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
        simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));
        simulation.alpha(1).restart();
    }


    function splitProductBubbles() {
        hideTitles('.region');
        hideTitles('.product');
        showTitles(productTitles, 'product');
        d3.selectAll("#bubble_region_annotation").remove();
        d3.selectAll("#bubble_product_annotation").remove();
        d3.select("#bubble_svg").append("g")
            .attr("class", "annotation-group")
            .attr("id", "bubble_product_annotation")
            .call(bubble_product_makeAnnotations);

        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeProductPosX));
        simulation.force('y', d3.forceY().strength(forceStrength).y(nodeProductPosY));
        simulation.alpha(1).restart();
    }


    function splitRegionBubbles() {
        hideTitles('.region');
        hideTitles('.product');
        showTitles(regionTitles, 'region');
        d3.selectAll("#bubble_region_annotation").remove();
        d3.selectAll("#bubble_product_annotation").remove();
        d3.select("#bubble_svg").append("g")
            .attr("class", "annotation-group")
            .attr("id", "bubble_region_annotation")
            .call(bubble_region_makeAnnotations);

        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeRegionPosX));
        simulation.force('y', d3.forceY().strength(forceStrength).y(nodeRegionPosY));
        simulation.alpha(1).restart();
    }

    function hideTitles(title) {
        bubble_svg.selectAll(title).remove();
    }


    function showTitles(title, titleClass) {
        var titleData = d3.keys(title);
        var titles = bubble_svg.selectAll('.' + titleClass)
            .data(titleData);

        titles.enter().append('text')
            .style('fill','#000000')
            .attr('class', titleClass)
            .attr('x', function (d) {
                return title[d].x;
            })
            .attr('y', function (d) {
                return title[d].y;
            })
            .attr('text-anchor', 'middle')
            .text(function (d) {
                if (d === 'hatchback'){
                    return "Hatchback";
                }
                else if (d === 'sedan'){
                    return "Sedan";
                }
                else if (d === 'hardtop'){
                    return "Hard top";
                }
                else if (d === 'convertible'){
                    return "Convertible";
                }
                else if (d === 'wagon'){
                    return "Wagon";
                }
                else if (d === 'fwd'){
                    return "Forward Wheel Drive";
                }
                else if (d === '4wd'){
                    return "Four Wheel Drive";
                }
                else if (d === 'rwd'){
                    return "Rear Wheel Drive";
                }
                else {
                        return d;
                    }

            });
    }

    function showDetail(d) {
        d3.select(this).attr('stroke', 'black');
        var content = '<span class="name">Make: </span><span class="value">' +
            d.brand +
            '</span><br/>' +
            '<span class="name">Cylinders: </span><span class="value">' +
            d.product +
            '</span><br/>' +
            '<span class="name">City Mpg: </span><span class="value">' +
            addCommas(d.growth_percent) +
            '</span><br/>' +
            '<span class="name">Highway Mpg: </span><span class="value">' +
            addCommas(d.highwayMpg) +
            '</span><br/>' +
            '<span class="name">Drive Wheels: </span><span class="value">' +
            d.category +
            '</span>';

        tooltip.showTooltip(content, d3.event);
    }

    /*
     * Hides tooltip
     */
    function hideDetail(d) {
        d3.select(this)
            .attr('stroke', d3.rgb(fillColor(d.region)).darker());

        tooltip.hideTooltip();
    }

    chart.toggleDisplay = function (displayName) {
        if (displayName === 'region') {
            splitRegionBubbles();
        } else if (displayName === 'product') {
            splitProductBubbles();
        } else {
            groupBubbles();
        }
    };
    return chart;
}


var myBubbleChart = bubbleChart();


function display(error, data) {
    if (error) {
        console.log(error);
    }

    myBubbleChart('#vis', data);
}


function setupButtons() {
    d3.select('#toolbar')
        .selectAll('.button')
        .on('click', function () {
            d3.selectAll('.button').classed('active', false);
            var button = d3.select(this);
            button.classed('active', true);
            var buttonId = button.attr('id');
            myBubbleChart.toggleDisplay(buttonId);
        });
}


function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}

d3.csv('data/Automobile_data.csv', display);

setupButtons();
