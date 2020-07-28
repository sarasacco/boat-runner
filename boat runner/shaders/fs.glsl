#version 300 es

precision mediump float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

out vec4 outColor;

uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;

uniform vec3 lightDirectionA; 
uniform vec3 lightColorA;
uniform vec3 lightDirectionB; 
uniform vec3 lightColorB;
uniform vec3 eyePos;
uniform vec3 specColor;
uniform vec3 ADir;
uniform vec3 materialAmbient;
uniform vec3 ambientLightColor;
uniform vec3 ambientLightLowColor;
uniform vec3 materialEmission;

float rSigma    = 0.5;
float SpecShine = 200.0;
//float Fres = 1.0;
//float k = 0.55;


void main() {
  vec4 diffuse 	= texture(u_texture0, fs_uv);
	vec4 ao 		  = texture(u_texture1, fs_uv);
	vec4 normal 	= texture(u_texture2, fs_uv);
	vec4 specular = texture(u_texture3, fs_uv);




  
  //Lambert Diffuse
  /*vec3 normalVec   = normalize(fs_norm);
  //vec3 normalVec   = normalize(2.0 * normal.rgb - 1.0);
  vec3 LDirA   = -lightDirectionA;
  vec3 LDirB   = -lightDirectionB;
  vec3 LambertD    = diffuse.rgb * lightColorA * clamp(dot(LDirA, normalVec), 0.0, 1.0);

  outColor = vec4(LambertD, normal.a);*/




  //Oren-Nayar Diffuse
  vec3 normalVec  = normalize(fs_norm);
  vec3 LDirA  =  - lightDirectionA;
  vec3 LDirB  =  - lightDirectionB;
	vec3 eyedirVec  = normalize(eyePos - fs_pos);

  vec3  La         = clamp(dot(LDirA, normalVec), 0.0, 1.0) * lightColorA;
  vec3  Lb         = clamp(dot(LDirB, normalVec), 0.0, 1.0) * lightColorB;

  vec3  v_ia       = normalize(LDirA - dot(LDirA, normalVec) * normalVec); 
	vec3  v_ra       = normalize(eyedirVec - dot(eyedirVec, normalVec) * normalVec);
  vec3  v_ib       = normalize(LDirB - dot(LDirB, normalVec) * normalVec); 
	vec3  v_rb       = normalize(eyedirVec - dot(eyedirVec, normalVec) * normalVec);

	float Ga         = max(0.0, dot(v_ia, v_ra));
  float Gb         = max(0.0, dot(v_ib, v_rb));

	float A         = 1.0 - 0.5 * (pow(rSigma, 2.0) / (pow(rSigma, 2.0) + 0.33));
  float B         = 0.45 * ( pow(rSigma, 2.0) / (pow(rSigma, 2.0) + 0.09) );

	float thetaIa    = acos( dot(LDirA, normalVec));
	float thetaRa   = acos( dot(eyedirVec, normalVec));
	float alphaa     = max (thetaIa, thetaRa); 
	float betaa      = min (thetaIa, thetaRa);

  float thetaIb    = acos( dot(LDirB, normalVec));
	float thetaRb   = acos( dot(eyedirVec, normalVec));
	float alphab     = max (thetaIb, thetaRb); 
	float betab      = min (thetaIb, thetaRb);

	vec3 ONlightA = La * (A + Ga * B * sin(alphaa) * tan(betaa));
  vec3 ONlightB = Lb * (A + Gb * B * sin(alphab) * tan(betab));

  vec3 OrenNayarD = diffuse.rgb * (ONlightA + ONlightB);

  //outColor = vec4(OrenNayarD, diffuse.a);



  //Blinn specular
  //vec3 LDirA  = - lightDirectionA;
  //vec3 normalVec  = normalize(fs_norm);
  //vec3 eyedirVec  = normalize(eyePos - fs_pos);
  vec3 halfVec    = normalize(eyedirVec + LDirA);

  vec3 BlinnS     = specular.rgb * pow(clamp(dot(halfVec, normalVec), 0.0, 1.0), SpecShine) * (lightColorA + lightColorB);

  outColor = vec4(BlinnS, specular.a);




  //Hemispheric Ambient
  //vec3 normalVec  = normalize(fs_norm);
  float amBlend = (dot(normalVec, ADir) + 1.0) / 2.0;
  
	vec3 ambientHemi = diffuse.rgb * (ambientLightColor * amBlend + ambientLightLowColor * (1.0 - amBlend));
  
  //outColor = vec4(ambientHemi, ao.a);


  vec3 clampCol = clamp(OrenNayarD + BlinnS + ambientHemi, 0.0, 1.0);

  outColor = vec4( clampCol, normal.a);




}