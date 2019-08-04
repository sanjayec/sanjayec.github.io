function sunburst(){
var width = 1024,
    height = 600,
    radius = (Math.min(width, height) / 2) - 10;

var x = d3.scaleLinear().range([0, 2 * Math.PI]);
var y = d3.scaleSqrt().range([0, radius]);
var zsb_color = d3.scaleOrdinal(d3.schemeCategory20b);
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
    "name": "Total Count",
    "children": [
        {"name": "convertible", "children": []},
        {"name": "hatchback", "children": []},
        {"name": "sedan", "children": []},
        {"name": "wagon", "children": []},
        {"name": "hardtop", "children": []}
    ]
};


d3.csv("data/Automobile_data.csv", function (error, data) {
    if (error) throw error;

    data.forEach(function (d) {
        buildTree(d);
    });

    root = d3.hierarchy(parent_tree)
        .sum(function (d) {
            return 1;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

    root.sum(function (d) {
        return 1;
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
setTimeout(showSAnnotation, 1000);
function showSAnnotation(){
    zsb_svg.append("g")
            .attr("class", "annotation-group")
            .attr("id", "sunburst_annotation")
            .call(sunburst_makeAnnotations);
}
//zsb_svg.append("g")
//            .attr("class", "annotation-group")
//            .attr("id", "sunburst_annotation")
//            .call(sunburst_makeAnnotations);
    
function showZSBDetail(d) {
    var d1=d.data.name;

    var content = '<span class="name">Name: </span><span class="value">' +
        d1 +
        '</span><br/>' +
        '<span class="name">Count of Vehicles : </span><span class="value">' +
        d.value + ""+
        '</span>';

    zsb_tooltip.showTooltip(content, d3.event);
}


function hideZSBDetail(d) {
    zsb_tooltip.hideTooltip();
}

function click(d) {
    d.parent == null ? d3.select("#sunburst_annotation").classed("hidden", false) : d3.select("#sunburst_annotation").classed("hidden", true);
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
        if (child.name === d["body-style"]) {
            var bodyStyleFound = false;
            child.children.forEach(function (grandchild) {
                if (grandchild.name === d["drive-wheels"]) {
                    bodyStyleFound = true;
                }
            });
            if (!bodyStyleFound) {
                child.children.push({"name": d["drive-wheels"], "children": []});
            }
            child.children.forEach(function (grandchild) {
                if (grandchild.name === d["drive-wheels"]) {
                    bodyStyleFound = true;
                    var subCategory = {"name": d["make"], "Count": 1};
                    grandchild.children.push(subCategory);
                }
            });
        }
    });
//    console.log("parent_tree=");
//    console.log(parent_tree);
}

d3.select(self.frameElement).style("height", height + "px");

}

sunburst();