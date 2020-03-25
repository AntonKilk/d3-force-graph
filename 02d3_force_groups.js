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
    // Weaken links when links link different groups
    .force("link", d3.forceLink()
      .id(function(d) { return d.id; })
      .distance(80)
      .strength(function(link) {
        if (link.source.group == link.source.target) {
          return 0.6; // stronger link for links within a group
        }
        else {
          return 0.05; // weaker links for links across groups
        }
      }) )
    //.force("charge", d3.forceManyBody().strength( -30 ))
    // horizontal force center
    .force("x", d3.forceX(function(node){
      if(node.group == 0){
        return 1 * width / 5 //220
      } else if(node.group == 1){
        return 2 * width / 5 // 440
      } else if(node.group == 2){
        return 3 * width / 5 // 660
      } else {
        return 4 * width / 5 // 880
      }
    }))
    // vertical force center
    .force("y", d3.forceY(function(node, index){
      if(node.group == 0){
        return  index * height / 7 + 100 // 100, 128 + 100, 256 + 100 ...
      } else if(node.group == 1){
        return (index - 7) * height / 14 + 100 // 100, 64 + 100, 128 + 100 ...
      } else if(node.group == 2){
        return (index - 20) * height / 8 + 100
      } else {
        return (index - 28) * height / 5 + 100
      }
    }))
    .force('collide', d3.forceCollide(function(d){
      return 50
    }));

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
      return (d.name);
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

    // On Each Tick, Calculate Group Centroids
    var nodes = this.nodes();
    var coords ={};
    var groups = [];

    // sort the nodes into groups:
    node.each(function(d) {
      if (groups.indexOf(d.group) == -1 ) {
          groups.push(d.group);
          coords[d.group] = [];
      }
      coords[d.group].push({x:d.x,y:d.y});
    })

    // get the centroid of each group:
    var centroids = {};

    for (var group in coords) {
      var groupNodes = coords[group];
      var n = groupNodes.length;
      var cx = 0;
      var tx = 0;
      var cy = 0;
      var ty = 0;

      groupNodes.forEach(function(d) {
          tx += d.x;
          ty += d.y;
      })

      cx = tx/n;
      cy = ty/n;

      centroids[group] = {x: cx, y: cy}
    }

    node.attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d, i) {
        return d.y
      });

    // Adjust each node's position to move it closer to its group's centroid:
    // don't modify points close the the group centroid:
    var minDistance = 10;
    let alpha = simulation.alpha()
    // modify the min distance as the force cools:
    if (alpha < 0.1) {
        minDistance = 10 + (1000 * (0.1-alpha))
    }

    // adjust each point if needed towards group centroid:
    node.each(function(d) {
        var cx = centroids[d.group].x;
        var cy = centroids[d.group].y;
        var x = d.x;
        var y = d.y;
        var dx = cx - x;
        var dy = cy - y;

        var r = Math.sqrt(dx*dx+dy*dy)

        if (r>minDistance) {
            d.x = x * 0.9 + cx * 0.1;
            d.y = y * 0.9 + cy * 0.1;
        }
    })

    // Texts
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
