#version 300 es

in vec3 a_position;
in vec3 a_norm;
in vec2 a_uv;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

uniform mat4 matrix; 
void main() {
  	fs_norm = a_norm;
	fs_uv   = a_uv;
	fs_pos  = a_position;
	
	gl_Position = matrix * vec4(a_position, 1.0);
}