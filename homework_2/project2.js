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
	let translation_matrix = [1, 0, 0,
						      0, 1, 0,
						      positionX, positionY, 1];

	//Call to ApplyTransform to have the transformations in the requested order
	tempTransformation = ApplyTransform(scale_matrix, rotation_matrix);
	return ApplyTransform(tempTransformation, translation_matrix);
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies t2 and then t1.
function ApplyTransform( t1, t2 ) //in this function we have to perform a multiplication between two matrices, keeping in mind that it's necessary to follow a precise order
{
  /*the product should be like
        t2[0]*t1[0] + t2[3]*t1[1] + t2[6]*t1[2],
		t2[1]*t1[0] + t2[4]*t1[1] + t2[7]*t1[2],
		t2[2]*t1[0] + t2[5]*t1[1] + t2[8]*t1[2],
		
        t2[0]*t1[3] + t2[3]*t1[4] + t2[6]*t1[5],
		t2[1]*t1[3] + t2[4]*t1[4] + t2[7]*t1[5],
		t2[2]*t1[3] + t2[5]*t1[4] + t2[8]*t1[5],

        t2[0]*t1[6] + t2[3]*t1[7] + t2[6]*t1[8],             
        t2[1]*t1[6] + t2[4]*t1[7] + t2[7]*t1[8],
        t2[2]*t1[6] + t2[5]*t1[7] + t2[8]*t1[8] */

	let i,j,k; let result = new Array(9);
	result.fill(0) ;
	for(i=0; i < 3; i++){
		for(j=0; j < 3; j++){
			for(k=0; k < 3; k++){
				result[i*3 + j] += t2[k*3 + j]*t1[i*3 + k] ;
			}
		}
	}

	return result;
}
