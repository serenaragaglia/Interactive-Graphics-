var raytraceFS = `
struct Ray {
	vec3 pos;
	vec3 dir;
};

struct Material {
	vec3  k_d;	// diffuse coefficient
	vec3  k_s;	// specular coefficient
	float n;	// specular exponent
};

struct Sphere {
	vec3     center;
	float    radius;
	Material mtl;
};

struct Light {
	vec3 position;
	vec3 intensity;
};

struct HitInfo {
	float    t;
	vec3     position;
	vec3     normal;
	Material mtl;
};

uniform Sphere spheres[ NUM_SPHERES ];
uniform Light  lights [ NUM_LIGHTS  ];
uniform samplerCube envMap;
uniform int bounceLimit;

bool IntersectRay( inout HitInfo hit, Ray ray );

// Shades the given point and returns the computed color.
vec3 Shade( Material mtl, vec3 position, vec3 normal, vec3 view )
{
	vec3 color = vec3(0,0,0);
	for ( int i=0; i<NUM_LIGHTS; ++i ) {
		// TO-DO: Check for shadows
		HitInfo hit;
		vec3 omega_out = normalize(lights[i].position - position);
		Ray shadow_ray;
		shadow_ray.pos = position + normal + 0.001; 
		shadow_ray.dir = omega_out;
		
		// TO-DO: If not shadowed, perform shading using the Blinn model
		//see if there is something along the path between the surface point and the light and if our object is blocking the light to the surface point
		if(!(IntersectRay(hit, shadow_ray))){
			float d = max(dot(normal, omega_out), 0.0);
			vec3 diffuse = lights[i].intensity * mtl.k_d * d;

			vec3 h = normalize(omega_out + view);
			float s = pow(max(dot(normal, h), 0.0), mtl.n);
			vec3 specular = lights[i].intensity * mtl.k_s * s;

			color = color + diffuse + specular;
		}
	
	}
	return color;
}

// Intersects the given ray with all spheres in the scene
// and updates the given HitInfo using the information of the sphere
// that first intersects with the ray.
// Returns true if an intersection is found.
bool IntersectRay( inout HitInfo hit, Ray ray )
{
	hit.t = 1e30;
	bool foundHit = false;
	for ( int i=0; i<NUM_SPHERES; ++i ) {
		// TO-DO: Test for ray-sphere intersection
		// TO-DO: If intersection is found, update the given HitInfo

		Sphere sph = spheres[i];
		vec3 r_c_s = ray.pos - sph.center; //distance from ray to sphere center
		//now we find the quadratic polynomial coefficients obtained by substituting the ray info into the sphere equation
		float a = dot(ray.dir , ray.dir);
		float b = 2.0 * (dot(ray.dir, r_c_s));
		float c = dot(r_c_s , r_c_s);

		float delta = (b * b) - (4.0 * a * c);

		if (delta > 0.0){
			float t_1 = (-b - sqrt(delta)) / (2.0*a);
			float t_2 = (-b - sqrt(delta)) / (2.0*a);
			float t = -1.0;
			if (t_1 > 0.0 && t_2 > 0.0) {
				t = min(t_1, t_2);
			} else if (t_1 > 0.0) {
				t = t_1;
			} else if (t_2 > 0.0) {
				t = t_2;
			}

			if (t > 0.001 && t < hit.t){
				foundHit = true;
				hit.t = t;
				hit.position = ray.pos + ray.dir * t; 
				hit.normal = normalize(hit.position - sph.center);
				hit.mtl = sph.mtl;	
			}
		}
	}
	return foundHit;
}

// Given a ray, returns the shaded color where the ray intersects a sphere.
// If the ray does not hit a sphere, returns the environment color.
vec4 RayTracer( Ray ray )
{
	HitInfo hit;
	if ( IntersectRay( hit, ray ) ) {
		vec3 view = normalize( -ray.dir );
		vec3 clr = Shade( hit.mtl, hit.position, hit.normal, view );
		
		// Compute reflections
		vec3 k_s = hit.mtl.k_s;
		for ( int bounce=0; bounce<MAX_BOUNCES; ++bounce ) {
			if ( bounce >= bounceLimit ) break;
			if ( hit.mtl.k_s.r + hit.mtl.k_s.g + hit.mtl.k_s.b <= 0.0 ) break;
			
			Ray r;	// this is the reflection ray
			HitInfo h;	// reflection hit info
			
			// TO-DO: Initialize the reflection ray
			r.pos = hit.position + hit.normal * 0.001;
			r.dir = normalize(reflect(-view, hit.normal)); //the function returns the direction in which the ray should bounce
			
			if ( IntersectRay( h, r ) ) {
				// TO-DO: Hit found, so shade the hit point
				// TO-DO: Update the loop variables for tracing the next reflection ray
				vec3 new_view = normalize(-r.dir);
				clr += k_s * Shade(h.mtl, h.position, h.normal, new_view);
				k_s = k_s * h.mtl.k_s;
				hit = h;
				view = new_view;
			} else {
				// The refleciton ray did not intersect with anything,
				// so we are using the environment color
				clr += k_s * textureCube( envMap, r.dir.xzy ).rgb;
				break;	// no more reflections
			}
		}
		return vec4( clr, 1 );	// return the accumulated color, including the reflections
	} else {
		return vec4( textureCube( envMap, ray.dir.xzy ).rgb, 0 );	// return the environment color
	}
}
`;