const graph = new window.G6.Graph({
  container: 'root',
  width: window.innerWidth - 800/window.devicePixelRatio,
  height: window.innerHeight - 100/window.devicePixelRatio,
  modes: {
    default: ['drag-canvas', 'drag-node'],
  },
  layout: {
    type: 'radial',
    unitRadius: 120,
    preventOverlap: true,
    strictRadial: false,
  },
  animate: true,
  defaultNode: {
    size: 80,
  },
  defaultEdge: {
    style: {
      endArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: '#e2e2e2',
      },
    },
  },
});

function renderGraph(data) {
  // console.log(data);
// graph 是 Graph 的实例
  graph.data(data);
  graph.render();
}

export default renderGraph;
