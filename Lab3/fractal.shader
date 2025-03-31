
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };
            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };
            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }
              float4 _Area;
            float _Angle;
            sampler2D _MainTex;
            float _MaxIter;
            float _R, _G, _B;
            float2 rot(float2 p, float2 pivot, float a){
                float s = sin(a);
                float c = cos(a);
                p -= pivot;
                p = float2(p.x*c - p.y*s, p.x*s + p.y*c);
                p += pivot;
                return p;
                }
            float2 ComplexSin(float2 z) {
            return float2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));}
            float2 ComplexCos(float2 z){
            return float2(cos(z.x)*cosh(z.y), -sin(z.x)*sinh(z.y)); }
             
            float2 ComplexCot(float2 z){
            return float2((cos(z.x)*cosh(z.y))/(sin(z.x) * cosh(z.y)), (-sin(z.y)*sinh(z.y))/ (cos(z.x) * sinh(z.y)));}
                
            float2 ComplexMultiply(float2 a, float2 b){
            return float2(a.x*b.x - a.y*b.y, a.x * b.y - a.y * b.x);}
            fixed4 frag (v2f i) : SV_Target
            {   
                 float2 c = _Area.xy + (i.uv-.5)*_Area.zw;   
                 c = rot(c, _Area.xy, _Angle);
                 float2 z = c;
                  float Max = 255;
                 float iter;
                 for(iter = 0; iter < (int)Max; iter++){
                 //   float2 temp = ComplexCot(z*z)/ComplexSin(z*z) + c;
                  float2 temp = ComplexMultiply(z, ComplexCos(z))+c;//супер красиивий фрактал
                  //float2 temp = ComplexMultiply(z, z) + c;
                  if(dot(temp, temp) > 25) break;
                     z = temp;
                  // float2 temp = float2(z.x*z.x - z.y*z.y, 2*z.x*z.y)+c;
                   /* if(length(temp) > 2) break;
                    z = temp;*/
                     }
 
                      float m = sqrt(iter/Max);
                     //fixed4 col;
                      float4 col = sin(float4(0.8, 0.5, 0.3, 1) * m * 20) * 0.5 + 0.5;
                      return col;
                    // return m;
            }
            ENDCG
        }
    }
}
