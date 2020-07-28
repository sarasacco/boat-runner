var program;
var gl;
var shaderDir; 
var baseDir;

var loaded = false;

//flags

let restart;
let flag;
let lastPositive;

var meshes;

var localMatrices;

var positionAttributeLocation;
var uvAttributeLocation;
var matrixLocation; 
var textLocation;
var texture;

let cx; //x is depth
let cy; //y-up
let cz; 
let elevation; //camera angle up and down
let angle; //camera rotation

let toggleCameraView;

let cameraOffsets;

let startingPoint;

//boat coordinates and angles

let boatX;
let boatY;
let boatZ;
let boatRoll;
let boatPitch;
let boatYaw;
let boatScale;

var q;

//rock coordinates

let rockX;
let rockY;
let rockZ;

let rockRotation;

let lateralRockX;
let lateralRockY;
let lateralRockZ;

//sea coordinates

let seaX;
let seaY;
let seaZ;

let seaOffset;

let seaX2;

let rockNum;

var keys;
var vx;
var rvy;

var wvpMats;
var viewMatrix;

//PHYSICS

var lastUpdateTime;
var fSk = 500.0;
var fDk = 2.0 * Math.sqrt(fSk);

// dynamic coefficients
var sAT = 2.5;
var mAT = 25.0;
var ATur = 15.0;
var ATdr = 22.5;
var sBT = 5.0;
var mBT = 15.0;
var BTur = 25.0;
var Tfric = Math.log(0.05);
var mAS = 20.0;

var boatLinAcc = 0.0;
var boatLinVel = 0.0;
var boatAngVel = 0.0;
var boatSideVel = 0.0;
var prevx = 0;

//Lights control
var dirLightAlphaa = utils.degToRad(0);    //angle on xy plane 
var dirLightAlphab = utils.degToRad(180);
var dirLightBeta  = utils.degToRad(60);  //angle on yz plane
var directionalLightA;
var directionalLightColorA;
var directionalLightB;
var directionalLightColorB;

var Sunrise = [0.99, 0.99, 0.9];
var Sunset  = [0.99, 0.33, 0.05];

var specColor = [0.8, 0.8, 0.8];

// define ambient light color and material
var materialAmbient     = [0.0, 0.0, 1.0];
var ambientLightUp      = [0.33, 0.33, 0.33];
var ambientLightDown    = [0.0, 0.64, 0.56];
var upDir               = [0.0, 1.0, 0.0];
var emissionColor       = [0.5, 0.5, 0.5];




function main() {
    lastUpdateTime = (new Date).getTime();

    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);  
    gl.clearColor(0.0, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    
    var positionAttributeLocation   = gl.getAttribLocation(program,  "a_position");
    var normalAttributeLocation     = gl.getAttribLocation(program,  "a_norm");
    var uvAttributeLocation         = gl.getAttribLocation(program,  "a_uv"); 
    var matrixLocation              = gl.getUniformLocation(program, "matrix");

    var textLocation                = gl.getUniformLocation(program, "u_texture0");
    var textLocation2               = gl.getUniformLocation(program, "u_texture1");
    var textLocation3               = gl.getUniformLocation(program, "u_texture2");
    var textLocation4               = gl.getUniformLocation(program, "u_texture3");

    var lightDirectionHandleA       = gl.getUniformLocation(program, "lightDirectionA");
    var lightColorHandleA           = gl.getUniformLocation(program, "lightColorA");
    var lightDirectionHandleB       = gl.getUniformLocation(program, "lightDirectionB");
    var lightColorHandleB           = gl.getUniformLocation(program, "lightColorB");
    var eyePositionHandle           = gl.getUniformLocation(program, "eyePos");
    var specularColorHandle         = gl.getUniformLocation(program, "specColor");
    var upDirectionHandle           = gl.getUniformLocation(program, "ADir");
    var ambientMaterialHandle       = gl.getUniformLocation(program, "materialAmbient");    
    var ambientUpLightColorHandle   = gl.getUniformLocation(program, "ambientLightColor");
    var ambientDownLightColorHandle = gl.getUniformLocation(program, "ambientLightLowColor");
    var materialEmissionHandle      = gl.getUniformLocation(program, "materialEmission");
  
    var perspectiveMatrix = utils.MakePerspective(60, gl.canvas.width/gl.canvas.height, 0.1, 1200.0);
    var vaos = new Array(meshes.length);
    
    
    
    
    
    
    
    
    
    for (let i in meshes) {
        addMesh(i);
    }
    
    
    localBoat = utils.MakeWorld(boatX, boatY, boatZ, boatRoll, boatPitch, boatYaw, boatScale);
    localRock1 = utils.MakeWorld(rockX[0], rockY[0], rockZ[0],   rockRotation[0],     0.0,       0.0,     35.0);
    localRock2 = utils.MakeWorld(rockX[1], rockY[1], rockZ[1],   rockRotation[1],     0.0,       0.0,     35.0);
    localRock3 = utils.MakeWorld(rockX[2], rockY[2], rockZ[2],   rockRotation[2],     0.0,       0.0,     35.0);
    localRock4 = utils.MakeWorld(rockX[3], rockY[3], rockZ[3],   rockRotation[4],     0.0,       0.0,     35.0);
    localSea1 = utils.MakeWorld(seaX, seaY, seaZ,   90.0,     270.0,       270.0,     1000.0);
    localSea2 = utils.MakeWorld(seaX2, seaY, seaZ,   90.0,     270.0,       270.0,     1000.0);
    localPlane1 = utils.MakeWorld(seaX, seaY + 10.0, seaZ,   0.0,     270.0,       270.0,     15.0);
    localPlane2 = utils.MakeWorld(seaX2, seaY + 10.0, seaZ,   0.0,     270.0,       270.0,     15.0);
    lateralRock1 = utils.MakeWorld(lateralRockX[0], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
    lateralRock2 = utils.MakeWorld(lateralRockX[0], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
    lateralRock3 = utils.MakeWorld(lateralRockX[1], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
    lateralRock4 = utils.MakeWorld(lateralRockX[1], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
    lateralRock5 = utils.MakeWorld(lateralRockX[2], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
    lateralRock6 = utils.MakeWorld(lateralRockX[2], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
    lateralRock7 = utils.MakeWorld(lateralRockX[3], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
    lateralRock8 = utils.MakeWorld(lateralRockX[3], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
    localMatrices = [localBoat, localRock1, localRock2, localRock3, localRock4, localSea1, localSea2, localPlane1, localPlane2,
                    lateralRock1, lateralRock2, lateralRock3, lateralRock4, lateralRock5, lateralRock6, lateralRock7, lateralRock8];
       
    
    drawScene();
    
    
    
  function animate(){
    // compute time interval
		var currentTime = (new Date).getTime();
		var deltaT;
		if(lastUpdateTime){
			deltaT = (currentTime - lastUpdateTime) / 1000.0;
		} else {
			deltaT = 1/50;
		}

        //DIRECTIONAL LIGHT ANIMATION
        dirLightAlphaa += utils.degToRad(0.3);
        dirLightAlphab += utils.degToRad(0.3);
    
        directionalLightA       = [ Math.sin(dirLightBeta) * Math.sin(dirLightAlphaa - utils.degToRad(45)),
                                   -Math.sin(dirLightBeta) * Math.cos(dirLightAlphaa - utils.degToRad(45)),
                                    Math.cos(dirLightBeta)
                                  ];
    
        if( (dirLightAlphaa%(2*Math.PI))>utils.degToRad(0) && dirLightAlphaa%(2*Math.PI)<utils.degToRad(90) ){
          
            var greenC = Math.sin(dirLightAlphaa) * 0.9 + (1.0 - Math.sin(dirLightAlphaa)) * 0.0;
            var blueC  = Math.sin(dirLightAlphaa) * 0.99 + (1.0 - Math.sin(dirLightAlphaa)) * 0.0;
            var redC   = Math.sin(dirLightAlphaa) * 0.99 + (1.0 - Math.sin(dirLightAlphaa)) * 0.0;
            directionalLightColorA = [redC, greenC, blueC];
            }
        else if(dirLightAlphaa%(2*Math.PI)>utils.degToRad(90) && (dirLightAlphaa%(2*Math.PI))<utils.degToRad(180)){
    
            var greenC = Math.sin(dirLightAlphaa) * 0.9 + (1.0 - Math.sin(dirLightAlphaa)) * 0.40;
            var blueC  = Math.sin(dirLightAlphaa) * 0.9 + (1.0 - Math.sin(dirLightAlphaa)) * 0.05;
            directionalLightColorA = [0.99, greenC, blueC];
        } 

        else if(dirLightAlphaa%(2*Math.PI)>utils.degToRad(180) && (dirLightAlphaa%(2*Math.PI))<utils.degToRad(270)){
    
          var greenC = -Math.sin(dirLightAlphaa) * 0.0 + (1.0 + Math.sin(dirLightAlphaa)) * 0.40;
          var blueC  = -Math.sin(dirLightAlphaa) * 0.0 + (1.0 + Math.sin(dirLightAlphaa)) * 0.05;
          var redC    = -Math.sin(dirLightAlphaa) * 0.0 + (1.0 + Math.sin(dirLightAlphaa)) * 0.99;
          directionalLightColorA = [redC, greenC, blueC];
      } 
        
        else directionalLightColorA = [0.0, 0.0, 0.0];
    
        directionalLightB       = [ Math.sin(dirLightBeta) * Math.sin(dirLightAlphab - utils.degToRad(45)),
                                   -Math.sin(dirLightBeta) * Math.cos(dirLightAlphab - utils.degToRad(45)),
                                    Math.cos(dirLightBeta)
         ];
        
        if( (dirLightAlphab%(2*Math.PI))>utils.degToRad(0) && dirLightAlphab%(2*Math.PI)<utils.degToRad(179) ){ 
              var greenC = Math.sin(dirLightAlphab) * 0.9 + (1.0 - Math.sin(dirLightAlphab)) * 0.0;
              var blueC  = Math.sin(dirLightAlphab) * 0.9 + (1.0 - Math.sin(dirLightAlphab)) * 0.0;
              var redC   = Math.sin(dirLightAlphab) * 0.99 + (1.0 - Math.sin(dirLightAlphab)) * 0.0;
              directionalLightColorB = [redC, greenC, blueC];
              }
        else directionalLightColorB = [0.0, 0.0, 0.0];
  
    
    //BOAT ANIMATION

    let cameraOffset = 100.0;
    let xOffset = -300.0;
    let yOffset = 150.0;


    // call user procedure for world-view-projection matrices
    wvpMats = worldViewProjection(boatX, boatY, boatZ, boatYaw, cx, cy, cz, cameraOffset);
    
    var dvecmat = wvpMats[0];
    viewMatrix = wvpMats[1];

    // computing boat velocities: maximum rotation angles are between 150 and -150
    if (Math.abs(boatYaw) > 30.0)
      boatAngVel = 0.0;
    else
		  boatAngVel = mAS * deltaT * rvy;	
		
		vx = -vx;
		// = 0.8 * deltaT * 60 * vx;
		if(vx > 0.1) {
		  if(prevx > 0.1) {
			boatLinAcc = boatLinAcc + ATur * deltaT;
			if(boatLinAcc > mAT) boatLinAcc = mAT;
		  } else if(boatLinAcc < sAT) boatLinAcc = sAT;
		} else if(vx > -0.1) {
			boatLinAcc = boatLinAcc - ATdr * deltaT * Math.sign(boatLinAcc);
			if(Math.abs(boatLinAcc) < 0.001) boatLinAcc = 0.0;
		} else { 
		  if(prevx < 0.1) {
			boatLinAcc = boatLinAcc - BTur * deltaT;
			if(boatLinAcc < -mBT) boatLinAcc = -mBT;
		  } else if(boatLinAcc > -sBT) boatLinAcc = -sBT;
		}
		prevx = vx;
    vx = -vx;
    
		boatLinVel = boatLinVel * Math.exp(Tfric * deltaT) - deltaT * boatLinAcc;
		
		// Magic for moving the boat
		localMatrices[0] = utils.multiplyMatrices(dvecmat, utils.MakeScaleMatrix(boatScale));
    xaxis = [dvecmat[0],dvecmat[4],dvecmat[8]];
		yaxis = [dvecmat[1],dvecmat[5],dvecmat[9]];
		zaxis = [dvecmat[2],dvecmat[6],dvecmat[10]];
    
    
    if(rvy != 0) {
			qy = Quaternion.fromAxisAngle(yaxis, utils.degToRad(boatAngVel));
			newDvecmat = utils.multiplyMatrices(qy.toMatrix4(), q.toMatrix4());
			R11=newDvecmat[10];R12=newDvecmat[8];R13=newDvecmat[9];
			R21=newDvecmat[2]; R22=newDvecmat[0];R23=newDvecmat[1];
      R31=newDvecmat[6]; R32=newDvecmat[4];R33=newDvecmat[5];
			
			if((R31<1)&&(R31>-1)) {
				theta = -Math.asin(R31);
				phi = Math.atan2(R32/Math.cos(theta), R33/Math.cos(theta));
				psi = Math.atan2(R21/Math.cos(theta), R11/Math.cos(theta));
				
			} else {
				phi = 0;
				if(R31<=-1) {
					theta = Math.PI / 2;
					psi = phi + Math.atan2(R12, R13);
				} else {
					theta = -Math.PI / 2;
					psi = Math.atan2(-R12, -R13) - phi;
				}
			}
      boatYaw  = psi/Math.PI*180.0;

      if (boatYaw > 30.0) boatYaw = 30.0
      else if (boatYaw < -30.0) boatYaw = -30.0;
    }

    //update quaternion encoding current rotation
    q = Quaternion.fromAxisAngle(yaxis, utils.degToRad(boatYaw));
    
    //update camera coords
		cx = boatX + xOffset;
		cy = boatY + yOffset;
		cz = boatZ; 
		
		// boat motion
		delta = utils.multiplyMatrixVector(dvecmat, [boatLinVel, 0, 0, 0.0]);
		boatX -= delta[0];
    boatZ -= delta[2];

    appendPoints(Math.floor(boatX));

    //SEA LOOP

    if (boatX > seaX + seaOffset/2 + 200.0 && boatX < seaX2 + seaOffset/2) {
      seaX = seaX2 + seaOffset;
      localMatrices[5] = utils.MakeWorld(seaX, seaY, seaZ,   90.0,     270.0,       270.0,     1000.0);
      localMatrices[7] = utils.MakeWorld(seaX, seaY, seaZ,   0.0,     270.0,       270.0,     15.0);
    } else if (boatX > seaX2 + seaOffset/2 + 200.0 && boatX < seaX + seaOffset/2) {
      seaX2 = seaX + seaOffset;
      localMatrices[6] = utils.MakeWorld(seaX2, seaY, seaZ,   90.0,     270.0,       270.0,     1000.0);
      localMatrices[8] = utils.MakeWorld(seaX2, seaY, seaZ,   0.0,     270.0,       270.0,     15.0);
    }

    //LATERAL ROCKS LOOP

    let offset = 400.0;

    if (boatX > startingPoint + offset/2.0) {
      startingPoint += offset;
      let newCoordX = lateralRockX.shift() + 1600.0;
      lateralRockX.push(newCoordX);
      localMatrices[9] = utils.MakeWorld(lateralRockX[0], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
      localMatrices[10] = utils.MakeWorld(lateralRockX[0], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
      localMatrices[11] = utils.MakeWorld(lateralRockX[1], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
      localMatrices[12] = utils.MakeWorld(lateralRockX[1], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
      localMatrices[13] = utils.MakeWorld(lateralRockX[2], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
      localMatrices[14] = utils.MakeWorld(lateralRockX[2], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
      localMatrices[15] = utils.MakeWorld(lateralRockX[3], lateralRockY, lateralRockZ[0], 0.0, 0.0, 0.0, 40.0);
      localMatrices[16] = utils.MakeWorld(lateralRockX[3], lateralRockY, lateralRockZ[1], 0.0, 0.0, 0.0, 40.0);
    }

    //MOVE ROCKS

    if (boatX > rockX[0] + offset) {
      rockX.shift();
      let tempX = rockX[2] + 300.0;
      rockX.push(tempX);
      rockZ.shift();
      let tempZ = Math.random() * 600.0;
      if (lastPositive) rockZ.push(-tempZ);
      else rockZ.push(tempZ);
      lastPositive = !lastPositive;

      let tempRotation = rockRotation.shift();
      rockRotation.push(tempRotation);
    }

    localMatrices[1] = utils.MakeWorld(rockX[0], rockY[0], rockZ[0],   rockRotation[0],     0.0,       0.0,     35.0);
    localMatrices[2] = utils.MakeWorld(rockX[1], rockY[1], rockZ[1],   rockRotation[1],     0.0,       0.0,     35.0);
    localMatrices[3] = utils.MakeWorld(rockX[2], rockY[2], rockZ[2],   rockRotation[2],     0.0,       0.0,     35.0);
    localMatrices[4] = utils.MakeWorld(rockX[3], rockY[3], rockZ[3],   rockRotation[3],     0.0,       0.0,     35.0);

    //COLLISION CHECK

    let k; 
    
    for(k = 0; k < rockNum; k++) {
      let xDist = rockX[k] - boatX;
      let zDist = rockZ[k] - boatZ;
      let boatRotation = Math.abs(boatYaw);
      if (boatRotation < 10.0 && xDist > 0) {
        if (Math.abs(zDist) < 100.0 && Math.abs(xDist) < 220.0) restart = true;
      } else if (boatRotation > 10.0 && xDist > 0) {
        if (zDist > 0 && boatYaw > 0 && Math.abs(zDist) < 150.0 && Math.abs(xDist) < 210.0) restart = true;
        else if (zDist < 0 && boatYaw < 0 && Math.abs(zDist) < 150.0 && Math.abs(xDist) < 210.0) restart = true;
      }
    }

    let zDistLat1 = Math.abs(boatZ - lateralRockZ[0]);
    let zDistLat2 = Math.abs(boatZ - lateralRockZ[1]);

    if(zDistLat1 < 230.0 || zDistLat2 < 230.0) restart = true;

    lastUpdateTime = currentTime; 
      
    
    
    

    if (restart) {
        
        gameover();
    } 
    
      
  }

    
    
    function drawScene() {
    
    animate();
    
        
    for (let i=0; i < meshes.length; i++){
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, localMatrices[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
  
      var lightDirMatrix = utils.sub3x3from4x4(utils.transposeMatrix(localMatrices[i]));
      var lightDirectionTransformedA = utils.normalizeVector3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightA));
      var lightDirectionTransformedB = utils.normalizeVector3(utils.multiplyMatrix3Vector3(lightDirMatrix, directionalLightB));
  
  
      var eyePositionMatrix = utils.invertMatrix(localMatrices[i]);
      var eyePositionTransformed = utils.normalizeVector3(utils.multiplyMatrix3Vector3(eyePositionMatrix, [cx, cy, cz]));    
  
      
      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
  
      gl.uniform3fv(lightColorHandleA, directionalLightColorA);
      gl.uniform3fv(lightDirectionHandleA, lightDirectionTransformedA);
      gl.uniform3fv(lightColorHandleB, directionalLightColorB);
      gl.uniform3fv(lightDirectionHandleB, lightDirectionTransformedB);  
      gl.uniform3fv(eyePositionHandle, eyePositionTransformed);
      gl.uniform3fv(specularColorHandle, specColor);
      gl.uniform3fv(upDirectionHandle, upDir);
      gl.uniform3fv(ambientMaterialHandle, materialAmbient);
      gl.uniform3fv(ambientUpLightColorHandle, ambientLightUp);
      gl.uniform3fv(ambientDownLightColorHandle, ambientLightDown);
      gl.uniform3fv(materialEmissionHandle, emissionColor);
        
      
  
      if (i==0){
        gl.activeTexture(gl.TEXTURE0);
        gl.activeTexture(gl.TEXTURE1);
        gl.activeTexture(gl.TEXTURE2);
        gl.activeTexture(gl.TEXTURE3);
    
        gl.uniform1i(textLocation, 0);
        gl.uniform1i(textLocation2, 1);
        gl.uniform1i(textLocation3, 2);
        gl.uniform1i(textLocation4, 3);
       
        
      } else if (i > 8 && i < 17){
        gl.activeTexture(gl.TEXTURE0);
        gl.activeTexture(gl.TEXTURE1);
        gl.activeTexture(gl.TEXTURE2);
        gl.activeTexture(gl.TEXTURE3);
  
        gl.uniform1i(textLocation, 4);
        gl.uniform1i(textLocation2, 5);
        gl.uniform1i(textLocation3, 6);
        gl.uniform1i(textLocation4, 7);
      }
      else if (i > 0 && i < 5 ){
        gl.activeTexture(gl.TEXTURE0);
        gl.activeTexture(gl.TEXTURE1);
        gl.activeTexture(gl.TEXTURE2);
        gl.activeTexture(gl.TEXTURE3);
  
        gl.uniform1i(textLocation, 8);
        gl.uniform1i(textLocation2, 9);
        gl.uniform1i(textLocation3, 10);
        gl.uniform1i(textLocation4, 11);
      }
      else if (i > 4 && i < 9){
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(textLocation, 12);
       }
      
    

        
    gl.bindVertexArray(vaos[i]);
    gl.drawElements(gl.TRIANGLES, meshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }
        
    loaded = true;
    
    load();
      
    window.requestAnimationFrame(drawScene);
  }

    function addMesh(i) {
    let mesh = meshes[i];
    let vao = gl.createVertexArray();
    vaos[i] = vao;
    gl.bindVertexArray(vao);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
         
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
  }
    
  
        
}
    
  
async function init(){
    //INITIALIZING GLOBAL VARIABLES

    restart = false;
    flag = 1;
    lastPositive = false;

    cx = -890.0; //x is depth
    cy = 400.0; //y-up
    cz = 0.0; 
    elevation = -1.0; //camera angle up and down
    angle = 90; //camera rotation

    toggleCameraView = false;

    cameraOffsets = [100.0, 400.0];

    startingPoint = 0.0;

    //boat coordinates and angles

    boatX = 0.0;
    boatY = 70.0;
    boatZ = 0.0;
    boatRoll = 0.0;
    boatPitch = 0.0;
    boatYaw = 0.0;
    boatScale = 0.3;

    q = Quaternion.fromAxisAngle([0,1,0], utils.degToRad(boatYaw));

    //rock coordinates

    rockX = [500.0, 800.0, 1100.0, 1400.0];
    rockY = [50.0, 50.0, 50.0, 50.0];
    rockZ = [20.0, 500.0, -350.0, 200.0];

    rockRotation = [10.0, 60.0, 120.0, 340.0];

    lateralRockX = [0.0, 400.0, 800.0, 1200.0];
    lateralRockY = [0.0];
    lateralRockZ = [-900.0, +900.0];

    //sea coordinates

    seaX = 0.0;
    seaY = 0.0;
    seaZ = 0.0;

    seaOffset = 1800.0;

    seaX2 = seaX + seaOffset;

    rockNum = 4;

    keys = [];
    vx = 0.0;
    rvy = 0.0;

    //SHADERS
  
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"shaders/";

    //CANVAS

    var canvas = document.getElementById("c");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    gl.useProgram(program);
    
    //create textures
    loadTextures();
    
    
    meshes = await loadMeshes();
    main();
    
}

var keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
  	keys[e.keyCode] = true;
	switch(e.keyCode) {
	  case 37:
//Dir LEFT
		rvy = rvy - 1.0;
		break;
	  case 39:
//Dir RIGHT
		rvy = rvy + 1.0;
		break;
	  case 38:
//Dir UP
		vx = vx + 1.0;
		break;
    
	}
  }
}

var keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
  	keys[e.keyCode] = false;
	switch(e.keyCode) {
	  case 37:
//Dir LEFT
    rvy = rvy + 1.0;
		break;
	  case 39:
//Dir RIGHT
    rvy = rvy - 1.0;
		break;
	  case 38:
//Dir UP
		vx = vx - 1.0;
		break;
	}
  }
} 







var effectWave = function (currentTime){
  if(lastUpdateTime){
    var deltaW = (30 * (currentTime - lastUpdateTime)) / 30000.0;
    if (flag==1){
        boatYaw = boatYaw + deltaW;
        //console.log("boatYaw: ", boatYaw);
        if (boatYaw > 7){
            flag =0;
        }
    }
    if (flag==0){
        boatYaw = boatYaw - deltaW;
        if (boatYaw < 0){
            flag = 1;
        }
    }
  }
}

var gameover = function() {
  
  
  window.location.href = 'lost.html';
  
}

function computePoints  () {
    return boatX;
}


window.onload = init;
//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keyup", keyFunctionUp, false);
window.addEventListener("keydown", keyFunctionDown, false);



    