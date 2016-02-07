var cube;
var tree;

function getRenderData(pos, blocks, cl, THREE) {
  var cx = pos.x;
  var cy = pos.y;
  var cz = pos.z;

  var vertexPositions = [];
  var colorVals = [];

  for (var x = cx; x < (cx + cl); x++) {
    for (var y = cy; y < (cy + cl); y++) {
      for (var z = cz; z < (cz + cl); z++) {
        var block = {d: 0};
        try {
          block = blocks[x][y][z];
        } catch(e) {}

        if (block.d == 0) {
          continue;
        }

        var localVertexPositions = cube.slice();
        localVertexPositions.forEach(function(v) {
          v = v.slice();
          v[0] += (x - cx);
          v[1] += (y - cy);
          v[2] += (z - cz);
          vertexPositions.push(v);
          colorVals.push({r: Math.round(Math.random() * 255), g: Math.round(Math.random() * 255), b: Math.round(Math.random() * 255)});
        });

      }
    }
  }

  // Do vertices caluclations
  var vertices = new Float32Array(vertexPositions.length * 3); // three components per vertex
  var colors = new Float32Array(colorVals.length * 3);

  // components of the position vector for each vertex are stored
  // contiguously in the buffer.
  for (var i = 0; i < vertexPositions.length; i++) {
    vertices[i * 3 + 0] = vertexPositions[i][0];
    vertices[i * 3 + 1] = vertexPositions[i][1];
    vertices[i * 3 + 2] = vertexPositions[i][2];

    colors[i * 3 + 0] = colorVals[i].r;
    colors[i * 3 + 1] = colorVals[i].g;
    colors[i * 3 + 2] = colorVals[i].b;
  }

  return {pos: pos, vertices: vertices, colors: colors};
}

onmessage = function(e) {

  var type = e.data.type;

  if (type == undefined) {
    return;
  }

  switch(type) {
      case 'init':
        cube = e.data.cube;
        break;
      case 'getRenderData':
        var renderData = getRenderData(e.data.pos, e.data.blocks, e.data.cl);
        postMessage(renderData);
        break;
  }

}
