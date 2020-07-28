function worldViewProjection(boatx, boaty, boatz, boatdir, camx, camy, camz, offset) {
// Computes the world, view and projection matrices for the game.

// boatx, boaty and boatz encodes the position of the boat.
// Since the game is basically in 2D, camdir contains the rotation about the y-axis to orient the boat

// The camera is placed at position camx, camy and camz. The view matrix should be computed using the
// LookAt camera matrix procedure, with the correct up-vector.

	var world = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	world = utils.multiplyMatrices(utils.MakeRotateYMatrix(boatdir-180.0), world);
	world = utils.multiplyMatrices(utils.MakeTranslateMatrix(boatx, boaty, boatz), world);

	var vz = utils.normalizeVector3([ camx-boatx-offset, camy-boaty, camz-boatz ]);
	var u = [ 0, 1, 0];
	var vx = utils.crossVector(u, vz);
	var vx = utils.normalizeVector3(vx);
	var vy = utils.crossVector(vz, vx);
	
	var c = [ camx, camy, camz ];

	var view  = [ vx[0], vy[0], vz[0], c[0],
				vx[1], vy[1], vz[1], c[1],
				vx[2], vy[2], vz[2], c[2],
				0,  0,  0, 1];
	var view = utils.invertMatrix(view);

	return [world, view];
}

