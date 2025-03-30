// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{

	let rotation_angle = (Math.PI/180)*rotation;

	let scale_matrix = [scale, 0, 0, 
					    0, scale, 0,
					    0, 0, 1	];
	let rotation_matrix = [Math.cos(rotation_angle), -Math.sin(rotation_angle), 0,
					       Math.sin(rotation_angle), Math.cos(rotation_angle), 0,
					       0,0,1];
	let translation_matrix = [1, 0, positionX,
						      0, 1, positionY,
						      0, 0, 1];
	

	return Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	return Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
}
