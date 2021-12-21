

    vec3 sun = vec3(242. / 255., 131. / 255., 19. /255.);
    vec3 sea = vec3(13./255., 98. / 255., 189./255.);
vec3 circle(vec2 p, vec2 center, float radius)
{
	return mix(vec3(sea), vec3(sun), smoothstep(radius + 0.005, radius - 0.005, length(p - center)));
}

void main(){
    vec2 uv = (gl_FragCoord.xy / iResolution.xy);
	uv = uv * 2.0 - vec2(1);// 归一化，弄到 [-1 , 1]区间
    uv.x *= iResolution.x / iResolution.y; // 纠正宽高比例
    vec3 c = circle(uv,vec2(0.5,0.5),0.2);

    gl_FragColor = vec4(c,1);
}