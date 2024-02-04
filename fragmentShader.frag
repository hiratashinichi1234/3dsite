 uniform float uTime;
      uniform vec2 uResolution;
      uniform sampler2D uTexture;

      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        uv -= 0.5;
        uv *= 2.0;

        // 回転行列を使用してテクスチャ座標を回転させる
        float angle = uTime; // 回転の角度（ここを変更することで回転速度や方向が変わります）
        mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        uv = rotationMatrix * uv;

        uv += 0.5;

        float radius = length(uv);
        vec3 textureColor = texture2D(uTexture, uv).xyz;

        vec3 color = vec3(sin(radius + uTime) * textureColor.r, cos(radius + uTime) * textureColor.g, radius * textureColor.b);

        gl_FragColor = vec4(color, 1.0);
      }