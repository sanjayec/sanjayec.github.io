// Annotations for Scatter Chart
const scatter_hp_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "",
            label: "Most forward wheel drive vehicles have low horsepower and at low price end",
            wrap: 190
        },
        x: 100,
        y: 380,
        dy: -200,
        dx: 20
    }];

const scatter_hp_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(scatter_hp_annotations);

const scatter_citympg_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "",
            label: "Many high city-mpg automobiles are available at lower price.",
            wrap: 190
        },
        x: 550,
        y: 380,
        dy: -200,
        dx: 20
    }];

const scatter_citympg_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(scatter_citympg_annotations);
    
const scatter_highwaympg_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "",
            label: "Many high city-mpg automobiles are available at lower price.",
            wrap: 190
        },
        x: 550,
        y: 380,
        dy: -200,
        dx: 70
    }];

const scatter_highwaympg_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(scatter_highwaympg_annotations);
    
//Stacked chart annotations    
const stacked_chart_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "",
            label: "Mercedes has the most varieties of automobiles with high avg prices.",
            wrap: 190
        },
        x: 70,
        y: 280,
        dy: -200,
        dx: 200
    }];

const stacked_chart_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(stacked_chart_annotations);
    
//Sunburst  annotations    
const sunburst_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "",
            label: "Sedan type vehicles are the highest in market.",
            wrap: 190
        },
        x: 160,
        y: -50,
        dy: -170,
        dx: 180,
        "z-index": 100
    }];

const sunburst_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(sunburst_annotations);
    
 //Stacked chart annotations    
const piechart_annotations = [
    {
        type: d3.annotationLabel,
        note: {
            title: "",
            label: "Ratio is not varying much between city-mpg and highway-mpg",
            wrap: 190
        },
        x: 170,
        y: 100,
        dy: -100,
        dx: 100
    }];

const piechart_makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(piechart_annotations);
    
    
