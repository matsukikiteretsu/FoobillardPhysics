var OofVmath = {};

OofVmath.M_PI = Math.PI;
OofVmath.M_PI2 = OofVmath.M_PI*2;

//
// typedef
//
/*
#ifdef FAST_MATH
  #define MATH_SIN(x) fastsin(x)
  #define MATH_COS(x) fastcos(x)
  #define MATH_ATAN2(x,y) fastatan2(x,y)
  #define MATH_ATAN(x) fastatan(x)
  #define MATH_POW(x,y) fastpow(x,y)
  #define MATH_SQRT(x) fastsqrt(x)
  #define MATH_EXP(x) fastexp(x)
#else
*/
OofVmath.MATH_SIN = function(x) {
    return Math.sin(x);
    //return fastsin(x);
};
OofVmath.MATH_COS = function(x) {
    return Math.cos(x);
    //return fastcos(x);
};
OofVmath.MATH_ATAN2 = function(x,y) {
    return Math.atan2(x,y);
};
    
OofVmath.MATH_ATAN = function(x) {
    return Math.atan(x);
};
OofVmath.MATH_POW = function(x,y) {
    return Math.pow(x,y);
};
OofVmath.MATH_SQRT = function(x) {
    return Math.sqrt(x);
};
OofVmath.MATH_EXP = function(x) {
    return Math.exp(x);
};



/***********************************************************************
 *              fast exp implementation (very imprecise)               *
 *               only to use for the lensflare function                *
 ***********************************************************************/
/*
static union{
    double d;
    struct{
        int j,i;
        } n;
} d2i;

var M_LN2 = 0.69314718055994530942;

var EXP_A = (1048576/M_LN2);
var EXP_C = 60801;

OofVmath.fastexp = function(y) {
	return (d2i.n.i = EXP_A*(y)+(1072693248-EXP_C),d2i.d);
};
*/

/***********************************************************************
 *            fast sqrt with table lookup (from Nvidia)                *
 ***********************************************************************/
//typedef unsigned char      BYTE;       // better: uint8_t out <stdint.h>
//typedef unsigned short     WORD;       // better: uint16_t out <stdint.h>
//typedef unsigned long      DWORD;      // better: uint32_t out <stdint.h>
//typedef unsigned long      QWORD;      // better: uint64_t out <stdint.h>

/*
#ifdef DWORD
  #define FP_BITS(fp) (*(DWORD *)&(fp))
#else
  #define FP_BITS(fp) (*(uint32_t *)&(fp))
#endif
#define FP_ABS_BITS(fp) (FP_BITS(fp)&0x7FFFFFFF)
#define FP_SIGN_BIT(fp) (FP_BITS(fp)&0x80000000)
#define FP_ONE_BITS 0x3F800000

static unsigned int fast_sqrt_table[0x10000];  // declare table of square roots

typedef union FastSqrtUnion
{
  float f;
  unsigned int i;
} FastSqrtUnion;
*/

/***********************************************************************
 *        The init table sqrt with table lookup (from Nvidia)          *
 ***********************************************************************/
/*
void initlookup_sqrt_table(void) {
  unsigned int i;
  FastSqrtUnion s;

  for (i = 0; i <= 0x7FFF; i++)
  {

    // Build a float with the bit pattern i as mantissa
    //  and an exponent of 0, stored as 127

    s.i = (i << 8) | (0x7F << 23);
    s.f = (float)sqrt(s.f);

    // Take the square root then strip the first 7 bits of
    //  the mantissa into the table

    fast_sqrt_table[i + 0x8000] = (s.i & 0x7FFFFF);

    // Repeat the process, this time with an exponent of 1,
    //  stored as 128

    s.i = (i << 8) | (0x80 << 23);
    s.f = (float)sqrt(s.f);

    fast_sqrt_table[i] = (s.i & 0x7FFFFF);
  }
}
*/
/***********************************************************************
 *        The function sqrt with table lookup (from Nvidia)            *
 ***********************************************************************/
/*
inline float fastsqrt(float n) {

  if (FP_BITS(n) == 0)
    return 0.0;                 // check for square root of 0

  FP_BITS(n) = fast_sqrt_table[(FP_BITS(n) >> 8) & 0xFFFF] | ((((FP_BITS(n) - 0x3F800000) >> 1) + 0x3F800000) & 0x7F800000);

  return n;
}
*/

/***********************************************************************
 *            fast sinus/cosinus lookup build table                    *
 ***********************************************************************/

OofVmath.MAX_CIRCLE_ANGLE = 8192;
var HALF_MAX_CIRCLE_ANGLE = (OofVmath.MAX_CIRCLE_ANGLE/2);
var QUARTER_MAX_CIRCLE_ANGLE = (OofVmath.MAX_CIRCLE_ANGLE/4);
var MASK_MAX_CIRCLE_ANGLE = (OofVmath.MAX_CIRCLE_ANGLE - 1);

OofVmath.fast_cossin_table = []; //[MAX_CIRCLE_ANGLE];           // Declare table of fast cosinus and sinus

OofVmath.initlookup_cossin_table = function() {

    var i;
    // Build cossin table
    for (i = 0; i < OofVmath.MAX_CIRCLE_ANGLE ; i++) {
        OofVmath.fast_cossin_table[i] = Math.sin(i * M_PI / HALF_MAX_CIRCLE_ANGLE);
    }
};

/***********************************************************************
 *            fast pow implementation with double                      *
 ***********************************************************************/

// ### TODO ### work not really clean at the moment
/*
inline double fastpow(double a, double b) {
    int tmp = (*(1 + (int *)&a));
    int tmp2 = (int)(b * (tmp - 1072632447) + 1072632447);
    double p = 0.0;
    //*(1 + (int * )&p) = tmp2;
    //return p;
    union { double d; int x[2]; } u = { p }; u.x[1] = tmp2;
    return u.d;
}
*/

/***********************************************************************
 *            fast sinus implementation lookup table                   *
 ***********************************************************************/
OofVmath.fastsin = function(n) {
    var f = n * HALF_MAX_CIRCLE_ANGLE / M_PI;
    var i;
    i = Math.floor(f);
    if (i < 0) {
        return fast_cossin_table[(-((-i)&MASK_MAX_CIRCLE_ANGLE)) + OofVmath.MAX_CIRCLE_ANGLE];
    }
    else {
        return fast_cossin_table[i&MASK_MAX_CIRCLE_ANGLE];
    }
};

/***********************************************************************
 *            fast cosinus implementation lookup table                 *
 ***********************************************************************/

OofVmath.fastcos = function(n) {
   var f = n * HALF_MAX_CIRCLE_ANGLE / M_PI;
   var i;
   i = Math.floor(f);
   if (i < 0) {
      return fast_cossin_table[((-i) + QUARTER_MAX_CIRCLE_ANGLE)&MASK_MAX_CIRCLE_ANGLE];
   } else {
      return fast_cossin_table[(i + QUARTER_MAX_CIRCLE_ANGLE)&MASK_MAX_CIRCLE_ANGLE];
   }
};

/***********************************************************************
 *                     fast atan implementation                       *
 ***********************************************************************/

OofVmath.fastatan = function(x)
{
    return M_PI_4*x - x*(Math.abs(x) - 1)*(0.2447 + 0.0663*Math.abs(x));
};


/***********************************************************************
 *                     fast atan2 implementation                       *
 ***********************************************************************/

OofVmath.fastatan2 = function(y, x) {
    var coeff_1 = OofVmath.M_PI / 4.0;
    var coeff_2 = 3.0 * coeff_1;
    var abs_y = Math.abs(y);
    var angle;

    if (x > 0.0) {
        var r = (x - abs_y) / (x + abs_y);
        angle = coeff_1 - coeff_1 * r;
    } else {
        var r = (x + abs_y) / (abs_y - x);
        angle = coeff_2 - coeff_1 * r;
    }
    
	return y < 0.0 ? -angle : angle;
};

/***********************************************************************/

OofVmath.vec_copy = function( v )
{
    var vr = new OofVec(v);
    return vr;
};

/***********************************************************************/

OofVmath.vec_cross = function( v1, v2 )
{
   var vr = new OofVec();
   vr.x = v1.y * v2.z - v2.y * v1.z;
   vr.y = v1.z * v2.x - v2.z * v1.x;
   vr.z = v1.x * v2.y - v2.x * v1.y;
   return vr;
};
    
/***********************************************************************/

OofVmath.vec_mul = function( v1, v2 )
{
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
};

/***********************************************************************/

OofVmath.vec_diff = function( v1, v2 )
{
   var vr = new OofVec();
   vr.x = v1.x - v2.x;
   vr.y = v1.y - v2.y;
   vr.z = v1.z - v2.z;
   return vr;
};

/***********************************************************************/

OofVmath.vec_add = function(v1, v2)
{
    var vr = new OofVec();
    vr.x = v1.x + v2.x;
    vr.y = v1.y + v2.y;
    vr.z = v1.z + v2.z;
    return vr;
};

/***********************************************************************/

OofVmath.vec_scale = function( v1, scale )
{
   var vr = new OofVec();

   vr.x = v1.x * scale;
   vr.y = v1.y * scale;
   vr.z = v1.z * scale;
   return vr;
};

/***********************************************************************/

OofVmath.vec_rotate = function( v1, ang )
{
    var vr = OofVmath.vec_copy(v1);
    
    OofVmath.rot_ax( OofVmath.vec_unit(ang), vr, 1, OofVmath.vec_abs(ang) );
    return vr;
};

/***********************************************************************/

OofVmath.vec_abs = function( v )
{
    return Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
};

/***********************************************************************/

OofVmath.vec_abssq = function( v )
{
    return v.x*v.x + v.y*v.y + v.z*v.z;
};

/***********************************************************************/

OofVmath.vec_unit = function( v )
{
    var vr = new OofVec();
    var l;
    l = OofVmath.vec_abs(v);
    if(Math.abs(l)>1.0E-50){
       vr.x=v.x/l;
       vr.y=v.y/l;
       vr.z=v.z/l;
    }
    else {
       vr.x=0.0;
       vr.y=0.0;
       vr.z=0.0;
    }
    return vr;
};

/***********************************************************************/

OofVmath.vec_xyz = function( x, y, z )
{
    var vr = new OofVec(x, y, z);
    return vr;
};

/***********************************************************************/

OofVmath.vec_xyvec = function( v )
{
    var vr = new OofVec(v.x, v.y, 0);
    return vr;
};

/***********************************************************************/

OofVmath.vec_ez = function()
{
   return OofVmath.vec_xyz(0.0,0.0,1.0);
};

/***********************************************************************/

OofVmath.vec_null = function() {
   return OofVmath.vec_xyz(0.0,0.0,0.0);
};

// = vec_null alias
OofVmath.vec_zero = function() {
   return OofVmath.vec_xyz(0.0,0.0,0.0);
};

/***********************************************************************/

OofVmath.rot_ax = function( ax, v, nr, phi )
{
    var dp = new OofVec();
    var dp2 = new OofVec();
    var nax;
    var i;

    if ( phi !==0.0 && OofVmath.vec_abs(ax)>0.0 ){

        var bz = OofVmath.vec_unit( ax );
        
        if( Math.abs(bz.x) <= Math.abs(bz.y) && Math.abs(bz.x) <= Math.abs(bz.z) )
            nax = OofVmath.vec_xyz(1.0,0.0,0.0);
        
        if( Math.abs(bz.y) <= Math.abs(bz.z) && Math.abs(bz.y) <= Math.abs(bz.x) )
            nax = OofVmath.vec_xyz(0.0,1.0,0.0);

        if( Math.abs(bz.z) <= Math.abs(bz.x) && Math.abs(bz.z) <= Math.abs(bz.y) )
            nax = OofVmath.vec_xyz(0.0,0.0,1.0);

        var bx = OofVmath.vec_unit(
            OofVmath.vec_diff(
                nax,
                OofVmath.vec_scale(
                    bz,
                    OofVmath.vec_mul(nax, bz)
                )
            )
        );
        var by = OofVmath.vec_cross(bz,bx);

        var sinphi = OofVmath.MATH_SIN(phi);
        var cosphi = OofVmath.MATH_COS(phi);

        for( i=0; i<nr; i++ ){
            // transform into axis-system
            dp.x = OofVmath.vec_mul( v[i], bx );
            dp.y = OofVmath.vec_mul( v[i], by );
            dp.z = OofVmath.vec_mul( v[i], bz );

            dp2.x = dp.x*cosphi - dp.y*sinphi;
            dp2.y = dp.y*cosphi + dp.x*sinphi;
            dp2.z = dp.z;

            // retransform back
            v[i].x = dp2.x * bx.x + dp2.y * by.x + dp2.z * bz.x;
            v[i].y = dp2.x * bx.y + dp2.y * by.y + dp2.z * bz.y;
            v[i].z = dp2.x * bx.z + dp2.y * by.z + dp2.z * bz.z;

        }
    }

};

/***********************************************************************/

/*
 * returns positive angle between 0 and M_PI
 */
OofVmath.vec_angle = function( v1, v2 ) {
    return Math.acos(
        OofVmath.vec_mul(
            OofVmath.vec_unit(v1),
            OofVmath.vec_unit(v2)
        )
    );
};

/***********************************************************************/

OofVmath.vec_proj = function( v1, v2 ) {

    var v2ls;
    v2ls = v2.x*v2.x + v2.y*v2.y + v2.z*v2.z;

    if( v2ls > 0.0 ){
        return OofVmath.vec_scale(
            v2,
            OofVmath.vec_mul(v1,v2) / v2ls
        );
    }
    return v1;
};

/***********************************************************************/

OofVmath.vec_ncomp = function( v1, v2 ) {
    return OofVmath.vec_diff(
        v1,
        OofVmath.vec_proj(v1, v2)
    );
};

/***********************************************************************/

/* normal distance of v to line(v1,v2) */
OofVmath.vec_ndist = function( v, v1, v2 ) {
    return OofVmath.vec_abs(
        OofVmath.vec_ncomp(
            OofVmath.vec_diff(v, v1),
            OofVmath.vec_diff(v2, v1)
        )
    );
};

/***********************************************************************/

OofVmath.vec_surf_proj = function( center, point, n, npos ) {
    
    var ndist_c, ndist_p;
    npos = OofVmath.vec_proj(npos,n);
    ndist_c = OofVmath.vec_mul(center,n) - OofVmath.vec_mul(npos,n);
    ndist_p = OofVmath.vec_mul(point,n) - OofVmath.vec_mul(npos,n);
    center = OofVmath.vec_ncomp(center,n);
    point = OofVmath.vec_ncomp(point,n);

    return OofVmath.vec_add(
        npos,
        OofVmath.vec_add(
            center,
            OofVmath.vec_scale(
                OofVmath.vec_diff(
                    point,
                    center
                ),
                ndist_c / ( ndist_c - ndist_p )
            )
        )
    );
};

/***********************************************************************/

OofVmath.matr4_rdot = function( m, v ) {
    var rvec = {};
    rvec.x = v.x*m.m[0]+v.y*m.m[4]+v.z*m.m[ 8]+m.m[12];
    rvec.y = v.x*m.m[1]+v.y*m.m[5]+v.z*m.m[ 9]+m.m[13];
    rvec.z = v.x*m.m[2]+v.y*m.m[6]+v.z*m.m[10]+m.m[14];
    return rvec;
};

/***********************************************************************/

OofVmath.tri_center = function( v1, v2, v3 ) {
    return OofVmath.vec_xyz(
        (v1.x+v2.x+v3.x)/3.0,
        (v1.y+v2.y+v3.y)/3.0,
        (v1.z+v2.z+v3.z)/3.0
    );
};

/***********************************************************************/

/* area of triangle ( +/- for ccw/cw ) */
OofVmath.tri_area_xy = function( v1, v2, v3 ) {
    return( ( (v1.x-v2.x)*(v1.y+v2.y) +
              (v2.x-v3.x)*(v2.y+v3.y) +
              (v3.x-v1.x)*(v3.y+v1.y) ) / 2.0 );
};

/***********************************************************************/

/* calc the volume of the space under (-z) the triangle (v1,v2,v3) */
OofVmath.tri_vol_xy = function( v1, v2, v3 ) {
    return OofVmath.tri_center(v1,v2,v3).z * OofVmath.tri_area_xy(v1,v2,v3);
};

/***********************************************************************/

//
// 角速度をクォータニオンに反映
//  
// @param angularVelocity ball.w OofVec
// @param dt
// @param orientation ball.orientation pc.Quat()
//        
//        
OofVmath.applyAngularVelocity = function( angularVelocity, dt, orientation ) {
    
    var length = OofVmath.vec_abs(angularVelocity);
    if (length <= Number.EPSILON) {
        return 0;
    }
    var avwork = OofVmath.vec_scale(angularVelocity, 1.0 / length);
    
    /*
    var qadd = new pc.Quat();
    var z = avwork.z;
    avwork.z = -avwork.y;
    avwork.y = -z;
    qadd.setFromAxisAngle(avwork, length * dt * pc.math.RAD_TO_DEG);
    
    orientation.mul(qadd);
    */

    var workq = new pc.Quat();
    workq.setFromAxisAngle(avwork, length * dt * pc.math.RAD_TO_DEG);
    var q = new pc.Quat(-workq.x, -workq.z, -workq.y, workq.w);
    orientation.mul2(q, orientation.clone());
    
};
