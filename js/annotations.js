// Annotations for Bubble Chart
const bubble_region_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "Share by Bodystyle",
            label: "Most vehicles are of Sedan type",
            wrap: 190
        },
        x: 380,
        y: 350,
        dy: 50,
        dx: 50
    }];

const bubble_region_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(bubble_region_annotations);

const bubble_product_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "Share by Drive wheels",
            label: "Most of the vehicles are of type Forward wheel drives",
            wrap: 190
        },
        x: 130,
        y: 320,
        dy: 80,
        dx: -20
    }];

const bubble_product_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(bubble_product_annotations);

// Annotations for Zoomable Sunburst
const zoom_annotations = [
{
    type: d3.annotationLabel,
    note: {
    title: "Highest Market Share",
    label: "Countries of Western Europe has the highest market share compared to other regions. The same can be seen in the bubble chart in the above ",
    wrap: 190
    },
    x: 650,
    y: 200,
    dy: -100,
    dx: 200
}]

const zoom_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(zoom_annotations)

d3.select("#zoomable_svg")
    .append("g")
    .attr("class", "annotation-group")
    .attr("id", "zoom_annotation")
    .call(zoom_makeAnnotations)

// Annotations for Line Chart
const line_annotations = [
{
    type: d3.annotationLabel,
    note: {
    title: "Weeknight Checkin Spike",
    label: "Spikes nightly for checkins",
    wrap: 190
    },
    x: 250,
    y: 125,
    dy: 0,
    dx: 0
},          
{
    type: d3.annotationLabel,
    note: {
    title: "Weekend Checkin Spike",
    label: "Increased spike of checkins over the weekend",
    wrap: 190
    },
    x: 650,
    y: 200,
    dy: -100,
    dx: -150
}]

const line_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(line_annotations)

d3.select("#linechart_svg")
    .append("g")
    .attr("class", "annotation-group")
    .attr("id", "linechart_annotation")
    .call(line_makeAnnotations)