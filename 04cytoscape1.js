/*
* Tasks:
* 0) Add zooming
*
* 1) Add highlighting closest edges
*
* 2) Make nodes collapsible by click
* */

// Get data from course.json file
$.getJSON("courses.json", function (d) {

  // Convert nodes' id-s to string
  let nodes = d.nodes
  nodes.forEach( node => {
    node.data.id = node.data.id.toString()
  })

  // Convert edges source & target to string, add id.
  let edges = d.links
  edges.forEach((link, i) => {
    link.data.id = "link" + i.toString()
    link.data.source = link.data.source.toString()
    link.data.target = link.data.target.toString()
  })

  // Cytoscape accepts an array of objects,
  // if there is a "source/target" properties, it is considered to be an edge/link
  let elems = nodes.concat(edges)

  // Cytoscape object
  let cy = cytoscape({
    container: document.getElementById('cy'),

    elements: elems, // array of nodes and edges

    // Styles
    style: cytoscape.stylesheet()
      .selector('node[group=4]')
        .css({
        'background-color': '#ccffcc',
        'content': 'data(label)',
        'text-halign':'center',
        'text-valign':'center',
        'width': 'label',
        'height':'label',
        'shape':'square'
        })
      .selector('node[group=3]')
        .css({
          'background-color': '#ffff99',
          'content': 'data(label)',
          'text-halign':'center',
          'text-valign':'center',
          'width': 'label',
          'height':'label',
          'shape':'square'
        })
      .selector('node[group=2]')
          .css({
            'background-color': '#ffcc66',
            'content': 'data(label)',
            'text-halign':'center',
            'text-valign':'center',
            'width': 'label',
            'height':'label',
            'shape':'square'
          })
      .selector('node[group=1]')
          .css({
            'background-color': '#ff9933',
            'content': 'data(label)',
            'text-halign':'center',
            'text-valign':'center',
            'width': 'label',
            'height':'label',
            'shape':'square'
          })
      .selector('edge')
          .css({
            'width': 1,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          })
      .selector(':selected')
          .css({
            //'background-color': 'black',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'text-outline-color': 'black'
          }),
    // layout options

    layout: {
      concentric: function( node ){
        return node.data("group")
      },
      name: 'concentric',
      levelWidth: function( nodes ){ // the letiation of concentric values in each level
        return nodes.maxDegree() / 8
      },
      spacingFactor: 1/2,
    },

  }) // cy ends

  //Highlight edges of clicked node
  cy.on('click', 'node', function (event) {
    let clickedNode = event.target
    let clickedEdges = clickedNode.connectedEdges()
    clickedEdges.css({
      'line-color': 'black',
      'target-arrow-color': 'black',
      'source-arrow-color': 'black'
    })
/*    for (let i = 0; i < edges.length; i++) {
      console.log(clickedEdges[i].data.id) // this is undefined
      if (clickedEdges[i].data.id == edges.data.id){
        clickedEdges.css('line-color', 'black')
      }
    }*/
  })

  //Set default zoom of ...
  console.log(cy.zoom())
  cy.zoom({
  level: 0.8, // the zoom level
  renderedPosition: { x: 1210, y: 550 }
});
})
