/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

THREE.VoxelGeometry = function ( width, height, depth, faces, widthSegments, heightSegments, depthSegments) {

	THREE.Geometry.call( this );

	this.type = 'VoxelGeometry';

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	this.widthSegments = widthSegments || 1;
	this.heightSegments = heightSegments || 1;
	this.depthSegments = depthSegments || 1;

	var scope = this;

	var width_half = width / 2;
	var height_half = height / 2;
	var depth_half = depth / 2;
	// console.log(faces);
	if (faces[0]) {
		console.log("YO")
		buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half, 0 ); // px
	}
	if (faces[1]) {
		buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half, 1 ); // nx
	}
	if (faces[2]) {
		buildPlane( 'x', 'z',   1,   1, width, depth, height_half, 2 ); // py
	}
	if (faces[3]) {
		buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half, 3 ); // ny
	}
	if (faces[4]) {
		buildPlane( 'x', 'y',   1, - 1, width, height, depth_half, 4 ); // pz
	}
	if (faces[5]) {
		buildPlane( 'x', 'y', - 1, - 1, width, height, - depth_half, 5 ); // nz
	}

	function buildPlane( u, v, udir, vdir, width, height, depth, materialIndex ) {

		var w, ix, iy,
		gridX = scope.widthSegments,
		gridY = scope.heightSegments,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

			w = 'z';

		} else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

			w = 'y';
			gridY = scope.depthSegments;

		} else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

			w = 'x';
			gridX = scope.depthSegments;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal[ w ] = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( vector );

			}

		}

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
				var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
				var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
				var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

				var face = new THREE.Face3( a + offset, b + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
				face.materialIndex = materialIndex;

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

				face = new THREE.Face3( b + offset, c + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
				face.materialIndex = materialIndex;

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

			}

		}

	}

	this.mergeVertices();

};

THREE.VoxelGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.VoxelGeometry.prototype.constructor = THREE.VoxelGeometry;

THREE.VoxelGeometry.prototype.clone = function () {

	var parameters = this.parameters;

	return new THREE.VoxelGeometry(
		parameters.width,
		parameters.height,
		parameters.depth,
		parameters.widthSegments,
		parameters.heightSegments,
		parameters.depthSegments
	);

};

THREE.CubeGeometry = THREE.VoxelGeometry; // backwards compatibility
