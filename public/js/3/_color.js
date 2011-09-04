THREE.Color.prototype = {constructor:THREE.Color,r:1,g:1,b:1,copy:function(b) {
    this.r = b.r;
    this.g = b.g;
    this.b = b.b;
    return this
},setRGB:function(b, c, e) {
    this.r = b;
    this.g = c;
    this.b = e;
    return this
},setHSV:function(b, c, e) {
    var f,h,m;
    if (e == 0)this.r = this.g = this.b = 0; else switch (f = Math.floor(b * 6),h = b * 6 - f,b = e * (1 - c),m = e * (1 - c * h),c = e * (1 - c * (1 - h)),f) {
        case 1:
            this.r = m;
            this.g = e;
            this.b = b;
            break;
        case 2:
            this.r = b;
            this.g = e;
            this.b = c;
            break;
        case 3:
            this.r = b;
            this.g = m;
            this.b = e;
            break;
        case 4:
            this.r = c;
            this.g = b;
            this.b = e;
            break;
        case 5:
            this.r =
                e;
            this.g = b;
            this.b = m;
            break;
        case 6:
        case 0:
            this.r = e,this.g = c,this.b = b
    }
    return this
},setHex:function(b) {
    b = Math.floor(b);
    this.r = (b >> 16 & 255) / 255;
    this.g = (b >> 8 & 255) / 255;
    this.b = (b & 255) / 255;
    return this
},getHex:function() {
    return~~(this.r * 255) << 16 ^ ~~(this.g * 255) << 8 ^ ~~(this.b * 255)
},getContextStyle:function() {
    return"rgb(" + Math.floor(this.r * 255) + "," + Math.floor(this.g * 255) + "," + Math.floor(this.b * 255) + ")"
},clone:function() {
    return(new THREE.Color).setRGB(this.r, this.g, this.b)
}};
THREE.Vector2 = function(b, c) {
    this.x = b || 0;
    this.y = c || 0
};
THREE.Vector2.prototype = {constructor:THREE.Vector2,set:function(b, c) {
    this.x = b;
    this.y = c;
    return this
},copy:function(b) {
    this.x = b.x;
    this.y = b.y;
    return this
},clone:function() {
    return new THREE.Vector2(this.x, this.y)
},add:function(b, c) {
    this.x = b.x + c.x;
    this.y = b.y + c.y;
    return this
},addSelf:function(b) {
    this.x += b.x;
    this.y += b.y;
    return this
},sub:function(b, c) {
    this.x = b.x - c.x;
    this.y = b.y - c.y;
    return this
},subSelf:function(b) {
    this.x -= b.x;
    this.y -= b.y;
    return this
},multiplyScalar:function(b) {
    this.x *= b;
    this.y *= b;
    return this
},
    divideScalar:function(b) {
        b ? (this.x /= b,this.y /= b) : this.set(0, 0);
        return this
    },negate:function() {
        return this.multiplyScalar(-1)
    },dot:function(b) {
        return this.x * b.x + this.y * b.y
    },lengthSq:function() {
        return this.x * this.x + this.y * this.y
    },length:function() {
        return Math.sqrt(this.lengthSq())
    },normalize:function() {
        return this.divideScalar(this.length())
    },distanceTo:function(b) {
        return Math.sqrt(this.distanceToSquared(b))
    },distanceToSquared:function(b) {
        var c = this.x - b.x,b = this.y - b.y;
        return c * c + b * b
    },setLength:function(b) {
        return this.normalize().multiplyScalar(b)
    },
    equals:function(b) {
        return b.x == this.x && b.y == this.y
    }};
THREE.Vector3 = function(b, c, e) {
    this.x = b || 0;
    this.y = c || 0;
    this.z = e || 0
};
THREE.Vector3.prototype = {constructor:THREE.Vector3,set:function(b, c, e) {
    this.x = b;
    this.y = c;
    this.z = e;
    return this
},copy:function(b) {
    this.x = b.x;
    this.y = b.y;
    this.z = b.z;
    return this
},clone:function() {
    return new THREE.Vector3(this.x, this.y, this.z)
},add:function(b, c) {
    this.x = b.x + c.x;
    this.y = b.y + c.y;
    this.z = b.z + c.z;
    return this
},addSelf:function(b) {
    this.x += b.x;
    this.y += b.y;
    this.z += b.z;
    return this
},addScalar:function(b) {
    this.x += b;
    this.y += b;
    this.z += b;
    return this
},sub:function(b, c) {
    this.x = b.x - c.x;
    this.y = b.y - c.y;
    this.z =
        b.z - c.z;
    return this
},subSelf:function(b) {
    this.x -= b.x;
    this.y -= b.y;
    this.z -= b.z;
    return this
},multiply:function(b, c) {
    this.x = b.x * c.x;
    this.y = b.y * c.y;
    this.z = b.z * c.z;
    return this
},multiplySelf:function(b) {
    this.x *= b.x;
    this.y *= b.y;
    this.z *= b.z;
    return this
},multiplyScalar:function(b) {
    this.x *= b;
    this.y *= b;
    this.z *= b;
    return this
},divideSelf:function(b) {
    this.x /= b.x;
    this.y /= b.y;
    this.z /= b.z;
    return this
},divideScalar:function(b) {
    b ? (this.x /= b,this.y /= b,this.z /= b) : this.set(0, 0, 0);
    return this
},negate:function() {
    return this.multiplyScalar(-1)
},
    dot:function(b) {
        return this.x * b.x + this.y * b.y + this.z * b.z
    },lengthSq:function() {
        return this.x * this.x + this.y * this.y + this.z * this.z
    },length:function() {
        return Math.sqrt(this.lengthSq())
    },lengthManhattan:function() {
        return this.x + this.y + this.z
    },normalize:function() {
        return this.divideScalar(this.length())
    },setLength:function(b) {
        return this.normalize().multiplyScalar(b)
    },cross:function(b, c) {
        this.x = b.y * c.z - b.z * c.y;
        this.y = b.z * c.x - b.x * c.z;
        this.z = b.x * c.y - b.y * c.x;
        return this
    },crossSelf:function(b) {
        return this.set(this.y *
            b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x)
    },distanceTo:function(b) {
        return Math.sqrt(this.distanceToSquared(b))
    },distanceToSquared:function(b) {
        return(new THREE.Vector3).sub(this, b).lengthSq()
    },setPositionFromMatrix:function(b) {
        this.x = b.n14;
        this.y = b.n24;
        this.z = b.n34
    },setRotationFromMatrix:function(b) {
        var c = Math.cos(this.y);
        this.y = Math.asin(b.n13);
        Math.abs(c) > 1.0E-5 ? (this.x = Math.atan2(-b.n23 / c, b.n33 / c),this.z = Math.atan2(-b.n12 / c, b.n11 / c)) : (this.x = 0,this.z = Math.atan2(b.n21, b.n22))
    },isZero:function() {
        return this.lengthSq() <
            1.0E-4
    }};
THREE.Vector4 = function(b, c, e, f) {
    this.x = b || 0;
    this.y = c || 0;
    this.z = e || 0;
    this.w = f || 1
};
THREE.Vector4.prototype = {constructor:THREE.Vector4,set:function(b, c, e, f) {
    this.x = b;
    this.y = c;
    this.z = e;
    this.w = f;
    return this
},copy:function(b) {
    this.x = b.x;
    this.y = b.y;
    this.z = b.z;
    this.w = b.w || 1
},clone:function() {
    return new THREE.Vector4(this.x, this.y, this.z, this.w)
},add:function(b, c) {
    this.x = b.x + c.x;
    this.y = b.y + c.y;
    this.z = b.z + c.z;
    this.w = b.w + c.w;
    return this
},addSelf:function(b) {
    this.x += b.x;
    this.y += b.y;
    this.z += b.z;
    this.w += b.w;
    return this
},sub:function(b, c) {
    this.x = b.x - c.x;
    this.y = b.y - c.y;
    this.z = b.z - c.z;
    this.w =
        b.w - c.w;
    return this
},subSelf:function(b) {
    this.x -= b.x;
    this.y -= b.y;
    this.z -= b.z;
    this.w -= b.w;
    return this
},multiplyScalar:function(b) {
    this.x *= b;
    this.y *= b;
    this.z *= b;
    this.w *= b;
    return this
},divideScalar:function(b) {
    b ? (this.x /= b,this.y /= b,this.z /= b,this.w /= b) : (this.z = this.y = this.x = 0,this.w = 1);
    return this
},negate:function() {
    return this.multiplyScalar(-1)
},dot:function(b) {
    return this.x * b.x + this.y * b.y + this.z * b.z + this.w * b.w
},lengthSq:function() {
    return this.dot(this)
},length:function() {
    return Math.sqrt(this.lengthSq())
},
    normalize:function() {
        return this.divideScalar(this.length())
    },setLength:function(b) {
        return this.normalize().multiplyScalar(b)
    },lerpSelf:function(b, c) {
        this.x += (b.x - this.x) * c;
        this.y += (b.y - this.y) * c;
        this.z += (b.z - this.z) * c;
        this.w += (b.w - this.w) * c;
        return this
    }};
THREE.Ray = function(b, c) {
    this.origin = b || new THREE.Vector3;
    this.direction = c || new THREE.Vector3
};
THREE.Ray.prototype = {constructor:THREE.Ray,intersectScene:function(b) {
    return this.intersectObjects(b.objects)
},intersectObjects:function(b) {
    var c,e,f = [];
    c = 0;
    for (e = b.length; c < e; c++)f = f.concat(this.intersectObject(b[c]));
    f.sort(function(b, e) {
        return b.distance - e.distance
    });
    return f
},intersectObject:function(b) {
    function c(b, e, c) {
        var f;
        f = c.clone().subSelf(b).dot(e);
        if (f <= 0)return null;
        b = b.clone().addSelf(e.clone().multiplyScalar(f));
        return c.distanceTo(b)
    }

    function e(b, e, c, f) {
        var f = f.clone().subSelf(e),
            c = c.clone().subSelf(e),h = b.clone().subSelf(e),b = f.dot(f),e = f.dot(c),f = f.dot(h),k = c.dot(c),c = c.dot(h),h = 1 / (b * k - e * e),k = (k * f - e * c) * h,b = (b * c - e * f) * h;
        return k > 0 && b > 0 && k + b < 1
    }

    if (b instanceof THREE.Particle) {
        var f = c(this.origin, this.direction, b.matrixWorld.getPosition());
        if (f == null || f > b.scale.x)return[];
        return[
            {distance:f,point:b.position,face:null,object:b}
        ]
    } else if (b instanceof THREE.Mesh) {
        f = c(this.origin, this.direction, b.matrixWorld.getPosition());
        if (f == null || f > b.geometry.boundingSphere.radius * Math.max(b.scale.x,
            Math.max(b.scale.y, b.scale.z)))return[];
        var h,m,k,n,u,p,v,t,x,w,z = b.geometry,y = z.vertices,B = [],f = 0;
        for (h = z.faces.length; f < h; f++)if (m = z.faces[f],x = this.origin.clone(),w = this.direction.clone(),p = b.matrixWorld,k = p.multiplyVector3(m.centroid.clone()).subSelf(x),t = k.dot(w),!(t <= 0) && (k = p.multiplyVector3(y[m.a].position.clone()),n = p.multiplyVector3(y[m.b].position.clone()),u = p.multiplyVector3(y[m.c].position.clone()),p = m instanceof THREE.Face4 ? p.multiplyVector3(y[m.d].position.clone()) : null,v = b.matrixRotationWorld.multiplyVector3(m.normal.clone()),
            t = w.dot(v),b.doubleSided || (b.flipSided ? t > 0 : t < 0)))if (t = v.dot((new THREE.Vector3).sub(k, x)) / t,x = x.addSelf(w.multiplyScalar(t)),m instanceof THREE.Face3)e(x, k, n, u) && (m = {distance:this.origin.distanceTo(x),point:x,face:m,object:b},B.push(m)); else if (m instanceof THREE.Face4 && (e(x, k, n, p) || e(x, n, u, p)))m = {distance:this.origin.distanceTo(x),point:x,face:m,object:b},B.push(m);
        B.sort(function(b, e) {
            return b.distance - e.distance
        });
        return B
    } else return[]
}};
THREE.Rectangle = function() {
    function b() {
        m = f - c;
        k = h - e
    }

    var c,e,f,h,m,k,n = !0;
    this.getX = function() {
        return c
    };
    this.getY = function() {
        return e
    };
    this.getWidth = function() {
        return m
    };
    this.getHeight = function() {
        return k
    };
    this.getLeft = function() {
        return c
    };
    this.getTop = function() {
        return e
    };
    this.getRight = function() {
        return f
    };
    this.getBottom = function() {
        return h
    };
    this.set = function(k, m, v, t) {
        n = !1;
        c = k;
        e = m;
        f = v;
        h = t;
        b()
    };
    this.addPoint = function(k, m) {
        n ? (n = !1,c = k,e = m,f = k,h = m) : (c = c < k ? c : k,e = e < m ? e : m,f = f > k ? f : k,h = h > m ? h : m);
        b()
    };
    this.add3Points =
        function(k, m, v, t, x, w) {
            n ? (n = !1,c = k < v ? k < x ? k : x : v < x ? v : x,e = m < t ? m < w ? m : w : t < w ? t : w,f = k > v ? k > x ? k : x : v > x ? v : x,h = m > t ? m > w ? m : w : t > w ? t : w) : (c = k < v ? k < x ? k < c ? k : c : x < c ? x : c : v < x ? v < c ? v : c : x < c ? x : c,e = m < t ? m < w ? m < e ? m : e : w < e ? w : e : t < w ? t < e ? t : e : w < e ? w : e,f = k > v ? k > x ? k > f ? k : f : x > f ? x : f : v > x ? v > f ? v : f : x > f ? x : f,h = m > t ? m > w ? m > h ? m : h : w > h ? w : h : t > w ? t > h ? t : h : w > h ? w : h);
            b()
        };
    this.addRectangle = function(k) {
        n ? (n = !1,c = k.getLeft(),e = k.getTop(),f = k.getRight(),h = k.getBottom()) : (c = c < k.getLeft() ? c : k.getLeft(),e = e < k.getTop() ? e : k.getTop(),f = f > k.getRight() ? f : k.getRight(),h = h >
            k.getBottom() ? h : k.getBottom());
        b()
    };
    this.inflate = function(k) {
        c -= k;
        e -= k;
        f += k;
        h += k;
        b()
    };
    this.minSelf = function(k) {
        c = c > k.getLeft() ? c : k.getLeft();
        e = e > k.getTop() ? e : k.getTop();
        f = f < k.getRight() ? f : k.getRight();
        h = h < k.getBottom() ? h : k.getBottom();
        b()
    };
    this.instersects = function(b) {
        return Math.min(f, b.getRight()) - Math.max(c, b.getLeft()) >= 0 && Math.min(h, b.getBottom()) - Math.max(e, b.getTop()) >= 0
    };
    this.empty = function() {
        n = !0;
        h = f = e = c = 0;
        b()
    };
    this.isEmpty = function() {
        return n
    }
};
THREE.Matrix3 = function() {
    this.m = []
};
THREE.Matrix3.prototype = {constructor:THREE.Matrix3,transpose:function() {
    var b,c = this.m;
    b = c[1];
    c[1] = c[3];
    c[3] = b;
    b = c[2];
    c[2] = c[6];
    c[6] = b;
    b = c[5];
    c[5] = c[7];
    c[7] = b;
    return this
},transposeIntoArray:function(b) {
    var c = this.m;
    b[0] = c[0];
    b[1] = c[3];
    b[2] = c[6];
    b[3] = c[1];
    b[4] = c[4];
    b[5] = c[7];
    b[6] = c[2];
    b[7] = c[5];
    b[8] = c[8];
    return this
}};
THREE.Matrix4 = function(b, c, e, f, h, m, k, n, u, p, v, t, x, w, z, y) {
    this.set(b || 1, c || 0, e || 0, f || 0, h || 0, m || 1, k || 0, n || 0, u || 0, p || 0, v || 1, t || 0, x || 0, w || 0, z || 0, y || 1);
    this.flat = Array(16);
    this.m33 = new THREE.Matrix3
};
THREE.Matrix4.prototype = {constructor:THREE.Matrix4,set:function(b, c, e, f, h, m, k, n, u, p, v, t, x, w, z, y) {
    this.n11 = b;
    this.n12 = c;
    this.n13 = e;
    this.n14 = f;
    this.n21 = h;
    this.n22 = m;
    this.n23 = k;
    this.n24 = n;
    this.n31 = u;
    this.n32 = p;
    this.n33 = v;
    this.n34 = t;
    this.n41 = x;
    this.n42 = w;
    this.n43 = z;
    this.n44 = y;
    return this
},identity:function() {
    this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    return this
},copy:function(b) {
    this.set(b.n11, b.n12, b.n13, b.n14, b.n21, b.n22, b.n23, b.n24, b.n31, b.n32, b.n33, b.n34, b.n41, b.n42, b.n43, b.n44);
    return this
},lookAt:function(b, c, e) {
    var f = THREE.Matrix4.__v1,h = THREE.Matrix4.__v2,m = THREE.Matrix4.__v3;
    m.sub(b, c).normalize();
    if (m.length() === 0)m.z = 1;
    f.cross(e, m).normalize();
    f.length() === 0 && (m.x += 1.0E-4,f.cross(e, m).normalize());
    h.cross(m, f).normalize();
    this.n11 = f.x;
    this.n12 = h.x;
    this.n13 = m.x;
    this.n21 = f.y;
    this.n22 = h.y;
    this.n23 = m.y;
    this.n31 = f.z;
    this.n32 = h.z;
    this.n33 = m.z;
    return this
},multiplyVector3:function(b) {
    var c = b.x,e = b.y,f = b.z,h = 1 / (this.n41 * c + this.n42 * e + this.n43 * f + this.n44);
    b.x = (this.n11 * c + this.n12 * e + this.n13 * f + this.n14) * h;
    b.y = (this.n21 *