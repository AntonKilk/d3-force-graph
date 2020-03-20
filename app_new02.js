//Width and height
var width = "100%"
var height = "100%"

// create the construct/canvas for drawing
var svg = d3.select("svg")
  //set width/height
width = +svg.attr("width"),
  height = +svg.attr("height")
preserveAspectRatio = "xMinYMin meet"

//color definition
var color = d3.scaleOrdinal(d3.schemeCategory20);



d3.json("courses.json", function (error, graph) {

  //Creates a new simulation with the specified array of nodes
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody().strength( -200 ))
    .force('x', d3.forceX(function(d){
      if(d.group == 0){
          return 120
      } else if (d.group == 1){
          return 360
      } else if (d.grop == 2){
          return 600
      } else {
        return 840
      }
    }))
  .force('y', d3.forceY(function(d){
      if(d.group == 0){
          return 120
      } else if (d.group == 1){
          return 360
      } else if (d.grop == 2){
          return 600
      } else {
        return 840
      }
    }))
  // adding links
  //The g element is a container element for grouping related graphics together
  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });

  //adding nodes
  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 6)
    .attr("fill", function(d) {
      return color(d.group);
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  // adding title
  node.append("title")
    .text(function(d) {
      return (d.id);
    });

  var text = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(graph.nodes)
    .enter().append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) {
      return d.name
    });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  // ticked functionality
  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node.attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });

    text.attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });


  }

  //The data and the circle element’s position are updated during the drag event
  // when dragged
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  // when dragged completed
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  // when dragged ended
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

})
