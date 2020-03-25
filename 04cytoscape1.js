/*
* Tasks:
* 1) Change position of nodes by the groups
* 2) Change colors of groups or nodes regarding the complexity
* 3) Add subnodes for nodes, where needed
* 4) Add arrows for nodes
* 5) Make nodes collapsible by click
* */


$.getJSON("courses.json", function (d) {
  // Convert nodes' id to string
  let nodes = d.nodes
  nodes.forEach( node => {
    node.data.id = node.data.id.toString()
  })

  // Convert edges source, target to string, add id.
  let edges = d.links
  edges.forEach((link, i) => {
    link.data.id = "link" + i.toString()
    link.data.source = link.data.source.toString()
    link.data.target = link.data.target.toString()
  })

  let groups = d.groups
  console.log(nodes)
  console.log(edges)
  let elems = nodes.concat(edges)

  // Cytoscape object
  let cy = cytoscape({
    container: document.getElementById('cy'),

    elements: elems,
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#D8FF6F',
          'content': 'data(label)',
          'text-halign':'center',
          'text-valign':'center',
          'width': 'label', // change to dynamic
          'height':'label', // change to dynamic
          'shape':'square'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      }
    ],

    layout: {
      name: 'grid',
      rows: 4
    }
  }) // cy ends

})
