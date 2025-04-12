// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	let cosx = Math.cos(rotationX);
	let sinx = Math.sin(rotationX);

	let cosy = Math.cos(rotationY);
	let siny = Math.sin(rotationY);
	// [TO-DO] Modify the code below to form the transformation matrix.
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var rotX = [
		1, 0,    0,   0,
		0, cosx, sinx, 0,
		0, -sinx,  cosx, 0,
		0,  0,    0,  1
	];

	var rotY = [
		cosy, 0, -siny, 0,
		0, 1, 0, 0,
		siny, 0, cosy, 0,
		0, 0, 0, 1 
	];
//the order has to be rotation -  translation - projection
	var rot = MatrixMult(rotX, rotY);
	var mid = MatrixMult(trans, rot);
	var mvp = MatrixMult( projectionMatrix, mid );
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
		this.prog = gl.InitShaderProgram(vs, fs);

		this.swapAxes = gl.getUniformLocation(this.prog, 'swap');  //takes the boolean value ofthe variable swap
		this.showTex = gl.getUniformLocation(this.prog, 'showTex');
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		//get texture and verteces position from the shaders
		this.vpos = gl.getAttribLocation(this.prog, 'vpos');
		this.tpos = gl.getAttribLocation(this.prog, 'tpos');

		gl.useProgram(this.prog);
		
		this.texture = gl.createTexture();
		this.sampler.gl.getUniformLocation(this.prog, 'tex');
		this.texBuffer = gl.createBuffer();

		this.vertexBuffer = gl.createBuffer();

	}


	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		gl.useProgram(this.prog);
		this.numTriangles = vertPos.length / 3;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
		gl.useProgram(this.prog);
		gl.uniform1i(this.swapAxes, swap); //set swapAxes value
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mvp, false, trans);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(this.vpos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vpos);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.vertexAttribPointer(this.tpos, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.tpos);

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture
		gl.useProgram(this.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D);
		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.uniform1i(sampler, 0);

	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTex, show);
	}
	

}

//the shaders have to be written as strings, so they are called as variables
var vs = `
attribute vec3 vpos;
attribute vec2 tpos;
uniform mat4 mvp;
varying vec2 texCoord;

void main(){
	gl_Position = mvp * vec4(vpos,1);
	texCoord = tpos;
}`

var fs = `
	uniform sampler2D tex;
	varying vec2 texCoord; 
	uniform bool showTex;

	void main(){ 
		if(showTex){
		gl_FragColor = texture2D(tex, texCoord);
		}else{
		gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);}
	}










`