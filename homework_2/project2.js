// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{

	let rotation_angle = (Math.PI/180)*rotation; //from degrees to radians
	let cos = Math.cos(rotation_angle)
	let sin  = Math.sin(rotation_angle);

	/*We are searching for a column-major format, this means that instead of thinking about the row order 
	as we usually do with matrices, we should instead consider the columns, for this reason every 
	transformation matrix is "ordered" by columns */

	let scale_matrix = [scale, 0, 0, 
					    0, scale, 0,
					    0, 0, 1	];
	let rotation_matrix = [cos, sin,  0,
					       -sin, cos, 0,
					       0,    0,   1];
	let translation_matrix = [1, 0, positionX,
						      0, 1, positionY,
						      0, 0, 1];
	//Call to ApplyTrabsform to have the transormations in the requested order
	return ApplyTransform(ApplyTransform(scale_matrix, rotation_matrix), translation_matrix);
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 ) //in this function we have to perform a multiplication between two matrices, keeping in mind that it's necessary to follow a precise order
{
   return [

        trans1[0]*trans2[0] + trans1[3]*trans2[1] + trans1[6]*trans2[2],
        trans1[0]*trans2[3] + trans1[3]*trans2[4] + trans1[6]*trans2[5],
        trans1[0]*trans2[6] + trans1[3]*trans2[7] + trans1[6]*trans2[8],

        trans1[1]*trans2[0] + trans1[4]*trans2[1] + trans1[7]*trans2[2],
        trans1[1]*trans2[3] + trans1[4]*trans2[4] + trans1[7]*trans2[5],
        trans1[1]*trans2[6] + trans1[4]*trans2[7] + trans1[7]*trans2[8],

        trans1[2]*trans2[0] + trans1[5]*trans2[1] + trans1[8]*trans2[2],
        trans1[2]*trans2[3] + trans1[5]*trans2[4] + trans1[8]*trans2[5],
        trans1[2]*trans2[6] + trans1[5]*trans2[7] + trans1[8]*trans2[8]
    ];
}
