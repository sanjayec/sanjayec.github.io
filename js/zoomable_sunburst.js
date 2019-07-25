var width = 1024,
    height = 650,
    radius = (Math.min(width, height) / 2) - 10;

var x = d3.scaleLinear().range([0, 2 * Math.PI]);
var y = d3.scaleSqrt().range([0, radius]);
var zsb_color = d3.scaleOrdinal(d3.schemeCategory20c);
var partition = d3.partition();
var arc = d3.arc()
    .startAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
    })
    .endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
    })
    .innerRadius(function (d) {
        return Math.max(0, y(d.y0));
    })
    .outerRadius(function (d) {
        return Math.max(0, y(d.y1));
    });

var zsb_tooltip = floatingTooltip('zsb_tooltip', 240);

var zsb_svg = d3.select("#zoomable_sunburst").append("svg")
    .attr('id', 'zoomable_svg')
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


var parent_tree = {
    "name": "Market Share",
    "children": [
        {"name": "AP", "children": []},
        {"name": "AS", "children": []},
        {"name": "EE", "children": []},
        {"name": "WE", "children": []},
        {"name": "ME", "children": []},
        {"name": "NA", "children": []},
        {"name": "LA", "children": []}
    ]
};


d3.csv("data/market_share_d3.csv", function (error, data) {
    if (error) throw error;

    data.forEach(function (d) {
        buildTree(d);
    });

    root = d3.hierarchy(parent_tree)
        .sum(function (d) {
            return (d.market_share/100).toFixed(2);
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

    root.sum(function (d) {
        return (d.market_share/100).toFixed(2);
    });
    zsb_svg.selectAll("path")
        .data(partition(root).descendants())
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return zsb_color((d.children ? d : d.parent).data.name);
        })
        .on("click", click)
        .on('mouseover', showZSBDetail)
        .on('mouseout', hideZSBDetail);
});

function showZSBDetail(d) {
    var d1=d.data.name;
    if (d1 === 'AP'){
        d1= "Asia Pacific";
    }
    else if (d1 === 'EE'){
        d1=  "Eastern Europe";
    }
    else if (d1 === 'ME'){
        d1=  "Middle East and Africa";
    }
    else if (d1 === 'WE'){
        d1=  "Western Europe";
    }
    else if (d1 === 'AS'){
        d1=  "Australasia";
    }
    else if (d1 === 'LA'){
        d1=  "Latin America";
    }
    else if (d1 === 'NA'){
        d1=  "North America";
    }
    var content = '<span class="name">Name: </span><span class="value">' +
        d1 +
        '</span><br/>' +
        '<span class="name">Market Share: </span><span class="value">' +
        d.value.toFixed(2) + "%"+
        '</span>';

    zsb_tooltip.showTooltip(content, d3.event);
}


function hideZSBDetail(d) {
    zsb_tooltip.hideTooltip();
}

function click(d) {
    d.parent == null ? d3v3.select("#zoom_annotation").classed("hidden", false) : d3v3.select("#zoom_annotation").classed("hidden", true);
    zsb_svg.transition()
        .duration(750)
        .tween("scale", function () {
            var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]),
                yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
            return function (t) {
                x.domain(xd(t));
                y.domain(yd(t)).range(yr(t));
            };
        })
        .selectAll("path")
        .attrTween("d", function (d) {
            return function () {
                return arc(d);
            };
        });
}


function buildTree(d) {
    parent_tree.children.forEach(function (child) {
        if (child.name === d.Region) {
            var countryFound = false;
            child.children.forEach(function (grandchild) {
                if (grandchild.name === d.Country) {
                    countryFound = true;
                }
            });
            if (!countryFound) {
                child.children.push({"name": d.Country, "children": []});
            }
            child.children.forEach(function (grandchild) {
                if (grandchild.name === d.Country) {
                    countryFound = true;
                    var subCategory = {"name": d.Subcategory, "market_share": d.Growth_pct_2016_2017};
                    grandchild.children.push(subCategory);
                }
            });
        }
    });
}

d3.select(self.frameElement).style("height", height + "px");