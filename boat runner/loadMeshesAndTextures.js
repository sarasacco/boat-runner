var modelsDir = 'model/';


var modelTextureBoat1 = 'Boat/textures/boat_diffuse.bmp';
var modelTextureBoat2 = 'Boat/textures/boat_ao.bmp';
var modelTextureBoat3 = 'Boat/textures/boat_normal.bmp';
var modelTextureBoat4 = 'Boat/textures/boat_specular.bmp';

var modelTextureRock11 = 'Rocks/Rock1/textures/rock_low_Base_color.png';
var modelTextureRock12 = 'Rocks/Rock1/textures/rock_low_Mixed_AO.png';
var modelTextureRock13 = 'Rocks/Rock1/textures/rock_low_Normal_DirectX.png';
var modelTextureRock14 = 'Rocks/Rock1/textures/rock_low_Roughness.png';

var modelTextureRock21 = 'Rocks/Rock2/textures/rock2_low_Base_color.png';
var modelTextureRock22 = 'Rocks/Rock2/textures/rock2_low_Mixed_AO.png';
var modelTextureRock23 = 'Rocks/Rock2/textures/rock2_low_Normal_DirectX.png';
var modelTextureRock24 = 'Rocks/Rock2/textures/rock2_low_Roughness.png';

var modelTextureTransparent = 'text_transparent.png';


var modelTextureSea = 'Ocean/ocean.jpg';
var modelTextureSea2 = 'Ocean/oceanSpec.jpg';

var modelTextureSun = 'sunTex.jpg';









async function loadMeshes() {
    var meshes;
    boatMesh = await loadMesh(modelsDir + "Boat.obj");
    rockMesh1 = await loadMesh(modelsDir + "rock2.obj");
    rockMesh2 = await loadMesh(modelsDir + "rock2.obj");
    rockMesh3 = await loadMesh(modelsDir + "rock2.obj");
    rockMesh4 = await loadMesh(modelsDir + "rock2.obj");
    seaMesh1 = await loadMesh(modelsDir + "ocean.obj");
    seaMesh2 = await loadMesh(modelsDir + "ocean.obj");
    planeMesh1 = await loadMesh(modelsDir + "Plane.obj");
    planeMesh2 = await loadMesh(modelsDir + "Plane.obj");
    lateralRockMesh1 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh2 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh3 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh4 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh5 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh6 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh7 = await loadMesh(modelsDir + "rock1.obj");
    lateralRockMesh8 = await loadMesh(modelsDir + "rock1.obj");
    
    return meshes = [boatMesh, rockMesh1, rockMesh2, rockMesh3, rockMesh4, seaMesh1, seaMesh2, planeMesh1, planeMesh2,
              lateralRockMesh1, lateralRockMesh2, lateralRockMesh3, lateralRockMesh4, lateralRockMesh5, lateralRockMesh6, lateralRockMesh7, lateralRockMesh8];
}


async function loadMesh (path){
    let str = await utils.get_objstr(path);
    let mesh = new OBJ.Mesh(str);
    return mesh;
}





function loadTextures (){
    boatTx = new Image();
		boatTx.txNum = 0;
		boatTx.onload = textureLoaderCallback;
    boatTx.src = modelsDir+modelTextureBoat1;
    
    boatTx2 = new Image();
		boatTx2.txNum = 1;
		boatTx2.onload = textureLoaderCallback;
		boatTx2.src = modelsDir+modelTextureBoat2;

    boatTx3 = new Image();
    boatTx3.txNum = 2;
    boatTx3.onload = textureLoaderCallback;
    boatTx3.src = modelsDir+modelTextureBoat3;
    
    boatTx3 = new Image();
    boatTx3.txNum = 3;
    boatTx3.onload = textureLoaderCallback;
    boatTx3.src = modelsDir+modelTextureBoat4;
    
    rockTx11 = new Image();
		rockTx11.txNum = 4;
		rockTx11.onload = textureLoaderCallback;
    rockTx11.src = modelsDir+modelTextureRock11;
    
    rockTx12 = new Image();
		rockTx12.txNum = 5;
		rockTx12.onload = textureLoaderCallback;
    rockTx12.src = modelsDir+modelTextureRock12;
    
    rockTx13 = new Image();
		rockTx13.txNum = 6;
		rockTx13.onload = textureLoaderCallback;
    rockTx13.src = modelsDir+modelTextureRock13;
    
    rockTx14 = new Image();
		rockTx14.txNum = 7;
		rockTx14.onload = textureLoaderCallback;
		rockTx14.src = modelsDir+modelTextureRock14;
    
    rockTx21 = new Image();
		rockTx21.txNum = 8;
		rockTx21.onload = textureLoaderCallback;
    rockTx21.src = modelsDir+modelTextureRock11;
    
    rockTx22 = new Image();
		rockTx22.txNum = 9;
		rockTx22.onload = textureLoaderCallback;
    rockTx22.src = modelsDir+modelTextureRock12;
    
    rockTx23 = new Image();
		rockTx23.txNum = 10;
		rockTx23.onload = textureLoaderCallback;
    rockTx23.src = modelsDir+modelTextureRock13;
    
    rockTx24 = new Image();
		rockTx24.txNum = 11;
		rockTx24.onload = textureLoaderCallback;
		rockTx24.src = modelsDir+modelTextureRock14;
    
    seaTx = new Image();
		seaTx.txNum = 12;
		seaTx.onload = textureLoaderCallback;
    seaTx.src = modelsDir+modelTextureSea;
    
   

    
    
}

var textureLoaderCallback = function() {
	var textureId = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + this.txNum);
  gl.bindTexture(gl.TEXTURE_2D, textureId);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);		
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);		
// set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}



