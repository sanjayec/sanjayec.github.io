
function bubbleChart() {
    var width = 1024;
    var height = 768;
    var tooltip = floatingTooltip('gates_tooltip', 240);
    var center = {x: width / 2, y: height / 2};

    var regionCenters = {
        AP: {x: 3 * width / 16, y: height / 3},
        AS: {x: width / 3.7, y: 2 * height / 3},
        EE: {x: 3 * width / 8, y: height / 3},
        WE: {x: width / 2, y: 2 * height / 3.05},
        ME: {x: 5 * width / 7.5, y: height / 3},
        NA: {x: 2 * width / 2.75, y: 2 * height / 3},
        LA: {x: 13 * width / 15, y: height / 3}
    };

    var regionTitles = {
        AP: {x: width / 10, y: height / 8},
        AS: {x: 9 * width / 39, y: 9 * height / 15},
        EE: {x: 7 * width / 20, y: height / 8},
        WE: {x: width / 2, y: 9 * height / 17},
        ME: {x: 13 * width / 20, y: height / 8},
        NA: {x: 31 * width / 41, y: 9 * height / 15},
        LA: {x: 8 * width / 9, y: height / 8}
    };

    var productCenters = {
        Apparel: {x: 3 * width / 16, y: height / 3.9},
        Footwear: {x: width / 3, y: 2 * height / 4.2},
        Sportswear: {x: 3 * width / 6.5, y: height / 3.9}
    };
    var productTitles = {
        Apparel: {x: 3 * width / 18.5, y: height / 20},
        Footwear: {x: width / 3, y: 2 * height / 5.8},
        Sportswear: {x: 3 * width / 6, y: height / 18}
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
            return +d.Growth_pct_2016_2017;
        });

        var radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([2, 35])
            .domain([0, maxAmount]);

        var myNodes = rawData.map(function (d) {
            return {
                id: d.id,
                radius: radiusScale(+d.pct_2017),
                growth_percent: +d.Growth_pct_2016_2017,
                product: d.Subcategory,
                brand: d.Global_Brand_Owner,
                region: d.Region,
                country: d.Country,
                category: d.Category,
                x: Math.random() * 900,
                y: Math.random() * 800
            };
        });

        myNodes.sort(function (a, b) {
            return b.growth_percent - a.growth_percent;
        });

        return myNodes;
    }


    var chart = function chart(selector, rawData) {
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
                if (d === 'AP'){
                    return "Asia Pacific";
                }
                else if (d === 'EE'){
                    return "Eastern Europe";
                }
                else if (d === 'ME'){
                    return "Middle East and Africa";
                }
                else if (d === 'WE'){
                    return "Western Europe";
                }
                else if (d === 'AS'){
                    return "Australasia";
                }
                else if (d === 'LA'){
                    return "Latin America";
                }
                else if (d === 'NA'){
                    return "North America";
                }else {
                        return d;
                    }

            });
    }

    function showDetail(d) {
        d3.select(this).attr('stroke', 'black');
        var content = '<span class="name">Brand: </span><span class="value">' +
            d.brand +
            '</span><br/>' +
            '<span class="name">Product: </span><span class="value">' +
            d.product +
            '</span><br/>' +
            '<span class="name">Growth Percent: </span><span class="value">' +
            addCommas(d.growth_percent) +
            '</span><br/>' +
            '<span class="name">Category: </span><span class="value">' +
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

d3.csv('data/market_share_d3.csv', display);

setupButtons();
