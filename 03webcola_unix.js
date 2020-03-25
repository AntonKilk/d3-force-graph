//hljs.initHighlightingOnLoad();
var d3cola = cola.d3adaptor(d3).convergenceThreshold(0.1);

var width = 960, height = 700;

var outer = d3.select("body").append("svg")
    .attr('width',width)
    .attr('height',height)
    .attr('pointer-events',"all");

outer.append('rect')
    .attr('class','background')
    .attr('width',"100%")
    .attr('height',"100%")
    .call(d3.zoom().on("zoom", redraw));

var vis = outer
    .append('g')
    .attr('transform', 'translate(250,250) scale(0.3)');

function redraw() {
    vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
}

outer.append('svg:defs').append('svg:marker')
    .attr('id','end-arrow')
    .attr('viewBox','0 -5 10 10')
    .attr('refX',8)
    .attr('markerWidth',6)
    .attr('markerHeight',6)
    .attr('orient','auto')
  .append('svg:path')
    .attr('d','M0,-5L10,0L0,5L2,0')
    .attr('stroke-width','0px')
    .attr('fill','#000');

d3.json("courses.json", function (data) {
/*    var digraph = graphlibDot.parse(f);

    var nodeNames = digraph.nodes();
    var nodes = new Array(nodeNames.length);
    nodeNames.forEach(function (name, i) {
        var v = nodes[i] = digraph._nodes[nodeNames[i]];
        v.id = i;
        v.name = name;
    });*/

/*    var edges = [];
    for (var e in digraph._edges) {
        var edge = digraph._edges[e];
        edges.push({ source: digraph._nodes[edge.u].id, target: digraph._nodes[edge.v].id });
    }*/

    d3cola
        .avoidOverlaps(true)
        .convergenceThreshold(1e-3)
        .flowLayout('x', 150)
        .size([width, height])
        .nodes(data.nodes)
        .links(data.links)
        .jaccardLinkLengths(150);

    var link = vis.selectAll(".link")
        .data(data.links)
      .enter().append("path")
        .attr("class", "link");

    var margin = 10, pad = 12;
    var node = vis.selectAll(".node")
        .data(data.nodes)
        .enter().append("rect")
        .classed("node", true)
        .attr('rx',5)
        .attr('ry',5)
        .call(d3cola.drag);

    var label = vis.selectAll(".label")
        .data(data.nodes)
        .enter().append("text")
        .attr("class", "label")
        .text(function (d) { return d.name; })
        .call(d3cola.drag)
        .each(function (d) {
            var b = this.getBBox();
            var extra = 2 * margin + 2 * pad;
            d.width = b.width + extra;
            d.height = b.height + extra;
        });

    var lineFunction = d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; });

    var routeEdges = function () {
        d3cola.prepareEdgeRouting();
        link.attr("d", function (d) {
            return lineFunction(d3cola.routeEdge(d
             // show visibility graph
                //, function (g) {
                //    if (d.source.id === 10 && d.target.id === 11) {
                //    g.E.forEach(function (e) {
                //        vis.append("line").attr("x1", e.source.p.x).attr("y1", e.source.p.y)
                //            .attr("x2", e.target.p.x).attr("y2", e.target.p.y)
                //            .attr("stroke", "green");
                //    });
                //    }
                //}
));
        });
        if (isIE()) link.each(function (d) { this.parentNode.insertBefore(this, this) });
    }
    d3cola.start(50, 100, 200).on("tick", function () {
        node.each(function (d) { d.innerBounds = d.bounds.inflate(-margin); })
            .attr("x", function (d) { return d.innerBounds.x; })
            .attr("y", function (d) { return d.innerBounds.y; })
            .attr("width", function (d) {
                return d.innerBounds.width();
            })
            .attr("height", function (d) { return d.innerBounds.height(); });

        link.attr("d", function (d) {
            var route = cola.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5);
            return lineFunction([route.sourceIntersection, route.arrowStart]);
        });
        if (isIE()) link.each(function (d) { this.parentNode.insertBefore(this, this) });

        label
            .attr("x", function (d) { return d.x })
            .attr("y", function (d) { return d.y + (margin + pad) / 2 });

    }).on("end", routeEdges);
});
function isIE() { return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))); }

