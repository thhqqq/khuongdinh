/* ==========================================================
   CAY TRI THUC - BAN 3D, GOC NHIN THU NHAT
   Ban la mot hoc tro dang di duoi san truong Khuong Dinh.
   Bam vao chiec la dang sang de xem ma QR cua tu lieu.
   ========================================================== */
"use strict";

var boot = document.getElementById("boot");
if (typeof THREE === "undefined") {
  document.getElementById("bootErr").style.display = "block";
  throw new Error("Thieu thu vien three.js");
}

var DATA = window.DATA || [];
var LABELS = { website:"Website tri ân", podcast:"Podcast lời thương",
               flipbook:"Flipbook kỷ yếu", padlet:"Padlet tư liệu" };
var TINT = { website:["#e6c173","#a87c2b"], podcast:["#e0a165","#a85c2c"],
             flipbook:["#55a894","#1f5546"], padlet:["#7ba775","#3d6a52"] };
var ICONS = {
  website:"M -9 0 A 9 9 0 1 0 9 0 A 9 9 0 1 0 -9 0 Z M -9 0 L 9 0 M 0 -9 C 4.8 -5 4.8 5 0 9 C -4.8 5 -4.8 -5 0 -9 Z M -7.7 -4.6 Q 0 -1.3 7.7 -4.6 M -7.7 4.6 Q 0 1.3 7.7 4.6",
  podcast:"M -3.4 -6.1 A 3.4 3.4 0 0 1 3.4 -6.1 L 3.4 -1.9 A 3.4 3.4 0 0 1 -3.4 -1.9 Z M -6.3 -2.4 A 6.3 6.3 0 0 0 6.3 -2.4 M 0 4 L 0 8 M -3.7 8 L 3.7 8",
  flipbook:"M 0 -5.2 C -2.6 -7.8 -6 -8.4 -9 -7.9 L -9 5.8 C -6 5.3 -2.6 5.9 0 8.5 C 2.6 5.9 6 5.3 9 5.8 L 9 -7.9 C 6 -8.4 2.6 -7.8 0 -5.2 Z M 0 -5.2 L 0 8.5",
  padlet:"M -8.6 -8.4 L -1.2 -8.4 L -1.2 -1 L -8.6 -1 Z M 1.2 -8.4 L 8.6 -8.4 L 8.6 -1 L 1.2 -1 Z M -8.6 1.2 L -1.2 1.2 L -1.2 8.6 L -8.6 8.6 Z M 1.2 1.2 L 8.6 1.2 L 8.6 8.6 L 1.2 8.6 Z"
};
var LEAF_D = "M 0 0 C -27 -19 -35 -50 0 -80 C 35 -50 27 -19 0 0 Z";

/* ---------- khung canh ---------- */
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x07121d);
scene.fog = new THREE.FogExp2(0x0a1a2a, 0.0145);

var camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.08, 500);
camera.position.set(0, 1.62, 13);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("app").appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x9ec4d8, 0x1b2f26, 0.55));
var moonLight = new THREE.DirectionalLight(0xd8e9ff, 1.05);
moonLight.position.set(-16, 26, -14);
moonLight.castShadow = true;
moonLight.shadow.mapSize.set(1024, 1024);
moonLight.shadow.camera.left = -22; moonLight.shadow.camera.right = 22;
moonLight.shadow.camera.top = 22;   moonLight.shadow.camera.bottom = -22;
moonLight.shadow.camera.far = 70;
scene.add(moonLight);
/* anh den vang hat len tan cay tu duoi goc */
var warm = new THREE.PointLight(0xffd79a, 2.1, 26, 2);
warm.position.set(0, 2.2, 0);
scene.add(warm);

/* ---------- hoa tiet ve bang canvas ---------- */
function cvs(w, h){ var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

function barkTexture(){
  var c = cvs(256, 256), g = c.getContext("2d");
  g.fillStyle = "#6b5437"; g.fillRect(0, 0, 256, 256);
  for (var i = 0; i < 240; i++) {
    g.strokeStyle = "rgba(0,0,0," + (0.04 + Math.random() * 0.16) + ")";
    g.lineWidth = 1 + Math.random() * 3.4;
    var x = Math.random() * 256;
    g.beginPath(); g.moveTo(x, 0);
    g.bezierCurveTo(x + 12 - Math.random() * 24, 85, x + 12 - Math.random() * 24, 170, x, 256);
    g.stroke();
  }
  for (var j = 0; j < 90; j++) {
    g.strokeStyle = "rgba(190,165,120," + (0.05 + Math.random() * 0.14) + ")";
    g.lineWidth = 1 + Math.random() * 2;
    var x2 = Math.random() * 256;
    g.beginPath(); g.moveTo(x2, 0); g.lineTo(x2 + 8 - Math.random() * 16, 256); g.stroke();
  }
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2);
  return t;
}

function glowTexture(hex, soft){
  var c = cvs(256, 256), g = c.getContext("2d");
  var gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, hex);
  gr.addColorStop(soft || 0.5, hex.replace("rgb", "rgba").replace(")", ",0.33)"));
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* la nho cho tan cay: khong vien den, co gan la va mang sang toi
   nen nhin gan khong bi giong mieng dan giay */
function foliageTexture(c1, c2){
  var c = cvs(128, 128), g = c.getContext("2d");
  g.translate(64, 124); g.scale(1.45, 1.45);
  var p = new Path2D(LEAF_D);

  var gr = g.createLinearGradient(0, -82, 0, 0);
  gr.addColorStop(0, c1);                 /* ngon la sang */
  gr.addColorStop(.58, c1);
  gr.addColorStop(1, c2);                 /* cuong la sam */
  g.fillStyle = gr; g.fill(p);

  g.save(); g.clip(p);
  var sh = g.createLinearGradient(-34, -72, 34, -8);   /* mang sang toi cheo */
  sh.addColorStop(0, "rgba(255,255,255,.17)");
  sh.addColorStop(.48, "rgba(255,255,255,0)");
  sh.addColorStop(1, "rgba(0,0,0,.20)");
  g.fillStyle = sh; g.fillRect(-40, -86, 80, 92);

  g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(0, -4); g.lineTo(0, -75); g.stroke();
  g.lineWidth = .85; g.strokeStyle = "rgba(255,255,255,.14)";
  for (var y = -15; y > -68; y -= 10) {                /* gan phu toa hai ben */
    g.beginPath(); g.moveTo(0, y); g.lineTo(-13, y - 9); g.stroke();
    g.beginPath(); g.moveTo(0, y); g.lineTo(13, y - 9); g.stroke();
  }
  g.restore();

  var t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}

/* chiec la tu lieu: co bieu tuong va so */
function docLeafTexture(it, mo){
  var c = cvs(256, 256), g = c.getContext("2d");
  g.translate(128, 244); g.scale(2.9, 2.9);
  var tint = TINT[it.category];
  var gr = g.createLinearGradient(-30, -80, 30, 0);
  gr.addColorStop(0, mo ? "#5f7b5c" : tint[0]);
  gr.addColorStop(1, mo ? "#2f4a38" : tint[1]);
  var leaf = new Path2D(LEAF_D);
  g.fillStyle = gr; g.fill(leaf);
  g.strokeStyle = mo ? "rgba(210,205,180,.3)" : "rgba(246,238,206,.75)";
  g.lineWidth = 2; g.stroke(leaf);
  var ic = new Path2D(ICONS[it.category]);
  g.save(); g.translate(0, -50); g.lineJoin = g.lineCap = "round";
  g.strokeStyle = "rgba(6,22,16,.5)"; g.lineWidth = 4.2; g.stroke(ic);
  g.strokeStyle = mo ? "rgba(225,232,215,.5)" : "#fdfaef"; g.lineWidth = 1.9; g.stroke(ic);
  g.restore();
  if (mo) { var tm = new THREE.CanvasTexture(c); tm.anisotropy = 4; return tm; }
  g.fillStyle = "rgba(243,238,215,.96)";
  g.beginPath(); g.arc(0, -18, 9.4, 0, 6.2832); g.fill();
  g.fillStyle = "#11322a"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "700 11px 'Be Vietnam Pro', Arial, sans-serif";
  g.fillText((it.id < 10 ? "0" : "") + it.id, 0, -17.5);
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4;
  return t;
}

/* ---------- san truong ---------- */
(function groundTex(){
  var c = cvs(512, 512), g = c.getContext("2d");
  g.fillStyle = "#162c25"; g.fillRect(0, 0, 512, 512);
  for (var i = 0; i < 2600; i++) {
    g.fillStyle = "rgba(" + (24 + Math.random()*30) + "," + (52 + Math.random()*40) + "," +
                  (40 + Math.random()*26) + ",.5)";
    g.fillRect(Math.random()*512, Math.random()*512, 2.5, 2.5);
  }
  /* gach lat quanh goc cay */
  g.strokeStyle = "rgba(120,150,120,.16)"; g.lineWidth = 1.6;
  for (var k = 0; k < 420; k++) {        /* vet co lo xo */
    var gx = Math.random()*512, gy = Math.random()*512;
    g.beginPath(); g.moveTo(gx, gy);
    g.lineTo(gx + (Math.random()-.5)*9, gy - 5 - Math.random()*9); g.stroke();
  }
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(34, 34);
  var m = new THREE.Mesh(new THREE.CircleGeometry(95, 64),
    new THREE.MeshStandardMaterial({ map: t, roughness: 1 }));
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  scene.add(m);
})();

/* ---------- troi sao va vang trang ---------- */
(function sky(){
  var g = new THREE.BufferGeometry(), v = [];
  for (var i = 0; i < 1100; i++) {
    var th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.92 + 0.02), R = 200;
    v.push(R*Math.sin(ph)*Math.cos(th), R*Math.cos(ph) + 8, R*Math.sin(ph)*Math.sin(th));
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xffffff, size: 1.15, sizeAttenuation: false, transparent: true, opacity: .85 })));

  var moon = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture("rgb(246,240,214)", .26), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  moon.position.set(-26, 40, -86); moon.scale.set(52, 52, 1);
  scene.add(moon);
})();

/* ==========================================================
   DAY NHA THPT KHUONG DINH - dung khoi that, co ban cong va cot
   ========================================================== */
(function campus(){
  var G = new THREE.Group();
  var wall  = new THREE.MeshStandardMaterial({ color: 0xcfd6d2, roughness: .9 });
  var slab  = new THREE.MeshStandardMaterial({ color: 0xe3e8e4, roughness: .85 });
  var deep  = new THREE.MeshStandardMaterial({ color: 0x1b2b33, roughness: 1 });
  var rail  = new THREE.MeshStandardMaterial({ color: 0x33434a, roughness: .8 });
  var litM  = new THREE.MeshBasicMaterial({ color: 0xffd48a });

  function box(w, h, d, x, y, z, mat, shadow){
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
    G.add(m); return m;
  }

  /* x bat dau, chieu rong, so tang */
  function wing(x0, w, floors, z){
    var H = floors * 3.4 + 1.2;
    box(w, H, 7, x0 + w/2, H/2, z - 1.6, wall);              /* khoi nha */
    box(w + .5, .5, 8.4, x0 + w/2, H, z + .4, slab);          /* mai */
    for (var f = 0; f < floors; f++) {
      var y = 1.2 + f * 3.4;
      box(w, 2.3, .35, x0 + w/2, y + 1.3, z + 1.9, deep, false);   /* hoc ban cong */
      box(w + .4, .35, 3.4, x0 + w/2, y, z + .5, slab);            /* san ban cong */
      box(w, .75, .18, x0 + w/2, y + .95, z + 2.08, rail);         /* lan can */
      for (var wx = x0 + 1.1; wx < x0 + w - 1.1; wx += 2.3) {      /* cua sang den */
        if (Math.random() > .42) continue;
        var L = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.5), litM);
        L.material = new THREE.MeshBasicMaterial({ color: 0xffd48a,
          transparent: true, opacity: .4 + Math.random() * .55 });
        L.position.set(wx, y + 1.45, z + 1.93);
        G.add(L);
      }
      for (var cx = x0; cx <= x0 + w; cx += 4.6)                   /* cot */
        box(.5, 3.4, .5, cx, y + 1.7, z + 2.2, slab);
    }
    return H;
  }

  var H = wing(-30, 26, 5, 0);          /* khoi chinh o giua */
  wing(-46, 15, 4, -5);                 /* canh trai lui ve sau */
  wing(-3,  20, 5, 0);
  wing(18,  14, 4, -5);                 /* canh phai lui ve sau */

  /* bang ten tren noc khoi chinh */
  var c = cvs(1024, 128), x = c.getContext("2d");
  x.fillStyle = "#13262f"; x.fillRect(0, 0, 1024, 128);
  x.fillStyle = "#e8864a"; x.textAlign = "center"; x.textBaseline = "middle";
  x.font = "700 60px 'Be Vietnam Pro', Arial, sans-serif";
  x.fillText("TRƯỜNG THPT KHƯƠNG ĐÌNH", 512, 70);
  var signTex = new THREE.CanvasTexture(c);
  box(27, 3.2, .6, -4, H + 2.4, 2.2, new THREE.MeshStandardMaterial({ color: 0x13262f }));
  var face = new THREE.Mesh(new THREE.PlaneGeometry(27, 3.2),
    new THREE.MeshBasicMaterial({ map: signTex, transparent: true }));
  face.position.set(-4, H + 2.4, 2.52);
  G.add(face);

  /* cot co */
  box(.22, 11, .22, 24, 5.5, 6, slab);
  var flag = new THREE.Mesh(new THREE.PlaneGeometry(3, 2),
    new THREE.MeshStandardMaterial({ color: 0xc4352b, side: THREE.DoubleSide, roughness: 1 }));
  flag.position.set(25.6, 10, 6); G.add(flag);

  G.position.set(2, 0, -46);
  scene.add(G);
})();

/* ==========================================================
   CAY: than chia nhanh nhieu cap, tan la dung hang nghin
   chiec la that trong khong gian chu khong phai anh dan
   ========================================================== */
var UP = new THREE.Vector3(0, 1, 0);
var barkMap  = barkTexture();
var woodMine = new THREE.MeshStandardMaterial({ map: barkMap, color: 0xc9b393, roughness: .96 });
var woodElse = new THREE.MeshStandardMaterial({ map: barkMap, color: 0x5f5947, roughness: 1 });

/* ---------- bien hieu gan tren than cay ---------- */
function signTexture(label){
  var c = cvs(256, 128), g = c.getContext("2d");
  g.fillStyle = label ? "#7a532e" : "#53463a";
  g.fillRect(0, 0, 256, 128);
  g.strokeStyle = "rgba(0,0,0,.3)"; g.lineWidth = 7; g.strokeRect(4, 4, 248, 120);
  g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = 2; g.strokeRect(13, 13, 230, 102);
  if (label) {
    g.fillStyle = "#d9b77a"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "600 19px 'Be Vietnam Pro', Arial, sans-serif";
    g.fillText("CHI ĐOÀN", 128, 33);
    g.fillStyle = "#fdf3d8";
    g.font = "700 58px 'Be Vietnam Pro', Arial, sans-serif";
    g.fillText(label, 128, 80);
  } else {                      /* bien mau, de trong */
    g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 5;
    g.beginPath(); g.moveTo(80, 64); g.lineTo(176, 64); g.stroke();
  }
  return new THREE.CanvasTexture(c);
}

/* ---------- dung mot cay ---------- */
var swayers = [];

function makeTree(ox, oz, s, mine, label){
  var G = new THREE.Group();
  G.position.set(ox, 0, oz);
  G.rotation.y = Math.random() * 6.28;          /* moi cay xoay mot huong */
  var wood = mine ? woodMine : woodElse;
  var tips = [];

  function grow(from, dir, len, rad, depth, collect){
    var geo = new THREE.CylinderGeometry(rad * .64, rad, len, depth > 2 ? 11 : 7, 1);
    geo.translate(0, len / 2, 0);
    var m = new THREE.Mesh(geo, wood);
    m.position.copy(from);
    m.quaternion.setFromUnitVectors(UP, dir.clone().normalize());
    if (mine) m.castShadow = true;
    G.add(m);
    var to = from.clone().addScaledVector(dir, len);
    if (depth <= 0) { if (collect) tips.push(to); return; }
    var n = depth > 2 ? 3 : 2;
    for (var i = 0; i < n; i++) {
      var d2 = dir.clone();
      var ax = new THREE.Vector3(Math.random() - .5, (Math.random() - .5) * .3, Math.random() - .5).normalize();
      d2.applyAxisAngle(ax, .40 + Math.random() * .38);
      if (d2.y < .14) d2.y = .14;
      grow(to, d2.normalize(), len * (.60 + Math.random() * .17), rad * .60, depth - 1, collect);
    }
  }
  /* cay lop khac: than manh hon, cao hon, van chia 4 cap cho tan day */
  var baseR = mine ? .82 : .55, baseL = mine ? 3.9 : 4.6;
  grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(.03, 1, .02), baseL * s, baseR * s, 4, true);
  var nflare = mine ? 7 : 5;
  for (var r = 0; r < nflare; r++) {
    var a2 = (r / nflare) * Math.PI * 2;
    grow(new THREE.Vector3(Math.cos(a2) * .5 * baseR * s, .04, Math.sin(a2) * .5 * baseR * s),
         new THREE.Vector3(Math.cos(a2), 1.7, Math.sin(a2)).normalize(),
         (mine ? 1.5 : .95) * s, .3 * baseR * s, 0, false);
  }

  /* tan la: ba lop mau khac nhau cho do sau */
  var BO = mine
    ? [["#a8c686", "#43734f"], ["#8fb074", "#35603f"], ["#c0cf7f", "#5c7b43"]]
    : [["#7e9c70", "#2f4e36"], ["#6b8a62", "#27442f"], ["#92a86f", "#3a5538"]];
  var per = mine ? 9 : 6;
  BO.forEach(function(cc){
    var geo = new THREE.PlaneGeometry(.72 * s, 1.0 * s);
    geo.translate(0, .5 * s, 0);
    var mat = new THREE.MeshStandardMaterial({
      map: foliageTexture(cc[0], cc[1]), transparent: true, alphaTest: .4,
      side: THREE.DoubleSide, roughness: .93 });
    var inst = new THREE.InstancedMesh(geo, mat, tips.length * per);
    var dum = new THREE.Object3D(), col = new THREE.Color(), n2 = 0;
    tips.forEach(function(t){
      for (var k = 0; k < per; k++) {
        dum.position.set(t.x + (Math.random() - .5) * 1.9 * s,
                         t.y + (Math.random() - .5) * 1.7 * s,
                         t.z + (Math.random() - .5) * 1.9 * s);
        dum.rotation.set(Math.random() * 3.14, Math.random() * 6.28, Math.random() * 3.14);
        var sc = (.8 + Math.random() * .6) * s; dum.scale.set(sc, sc, sc);
        dum.updateMatrix(); inst.setMatrixAt(n2, dum.matrix);
        var l = mine ? (.86 + Math.random() * .3) : (.52 + Math.random() * .26);
        col.setRGB(l, l, l);
        inst.setColorAt(n2, col); n2++;
      }
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    G.add(inst);
  });

  /* bien hieu */
  var plank = new THREE.Mesh(new THREE.BoxGeometry(1.3 * s, .66 * s, .09),
    new THREE.MeshStandardMaterial({ map: signTexture(label), roughness: .9,
      emissive: mine ? 0x3a2a12 : 0x000000 }));
  plank.position.set(0, 1.8 * s, .9 * baseR * s + .12);
  G.add(plank);
  var post = new THREE.Mesh(new THREE.BoxGeometry(.07, .5 * s, .07),
    new THREE.MeshStandardMaterial({ color: 0x4a3a28 }));
  post.position.set(0, 1.42 * s, .88 * baseR * s + .1); G.add(post);

  /* bong duoi tan */
  var sc2 = cvs(256, 256), gg = sc2.getContext("2d");
  var gr2 = gg.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr2.addColorStop(0, "rgba(0,0,0,.5)"); gr2.addColorStop(1, "rgba(0,0,0,0)");
  gg.fillStyle = gr2; gg.fillRect(0, 0, 256, 256);
  var sh2 = new THREE.Mesh(new THREE.CircleGeometry(8 * s, 32),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc2),
      transparent: true, depthWrite: false }));
  sh2.rotation.x = -Math.PI / 2; sh2.position.y = .02;
  G.add(sh2);

  if (mine) {
    var halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture("rgb(255,214,140)", .3), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: .44 }));
    halo.position.set(0, 5.6 * s, 0); halo.scale.set(18 * s, 18 * s, 1);
    G.add(halo);
  } else {
    /* lop khac cung co la tu lieu, nhung mo va khong bam duoc */
    for (var q2 = 0; q2 < 4; q2++) {
      var t2 = tips[Math.floor(Math.random() * tips.length)];
      var it2 = DATA[Math.floor(Math.random() * DATA.length)];
      var hl = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture("rgb(150,190,160)", .3), transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false, opacity: .16 }));
      hl.scale.set(2.1 * s, 2.1 * s, 1);
      hl.position.copy(t2);
      G.add(hl);
      var sp2 = new THREE.Sprite(new THREE.SpriteMaterial({
        map: docLeafTexture(it2, true), transparent: true,
        depthWrite: false, opacity: .72 }));
      sp2.scale.set(1.15 * s, 1.15 * s, 1);
      sp2.position.copy(t2);
      G.add(sp2);
    }
    swayers.push({ obj: G, ph: Math.random() * 6.28 });
  }

  scene.add(G);
  return tips.map(function(t){ return t.clone().applyAxisAngle(UP, G.rotation.y).add(G.position) });
}

/* cay cua lop minh o giua san */
var tips = makeTree(0, 0, 1, true, "11A");

/* cay cua cac lop khac quanh san: co la, co la tu lieu mo, khong bam duoc */
(function grove(){
  var spots = [[-19,-6],[18,-9],[-26,9],[24,8],[-11,18],[13,20],[-32,-14],
               [31,-16],[0,26],[-7,-24],[9,-27],[-36,4],[35,2]];
  spots.forEach(function(p, i){
    makeTree(p[0], p[1], .46 + (i % 5) * .07, false, null);
  });
})();

/* ==========================================================
   15 CHIEC LA TU LIEU - treo o ngon canh, sang len trong tan
   ========================================================== */
var leaves = [];

/* the go nho treo duoi la, ghi so va bieu tuong loai tu lieu */
function boTron(g, x, y, w, hh, r){
  g.beginPath();
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + hh - r); g.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh);
  g.lineTo(x + r, y + hh); g.quadraticCurveTo(x, y + hh, x, y + hh - r);
  g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
}
function tagTexture(it){
  var c = cvs(256, 168), g = c.getContext("2d");
  g.clearRect(0, 0, 256, 168);
  boTron(g, 12, 14, 232, 140, 20);
  g.fillStyle = "#ecdfc0"; g.fill();
  g.strokeStyle = "#9c7f4e"; g.lineWidth = 6; g.stroke();
  boTron(g, 24, 26, 208, 116, 14);
  g.strokeStyle = "rgba(120,96,56,.35)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "#9c7f4e";                       /* lo xo day */
  g.beginPath(); g.arc(128, 34, 9, 0, 6.2832); g.fill();
  g.globalCompositeOperation = "destination-out";
  g.beginPath(); g.arc(128, 34, 5, 0, 6.2832); g.fill();
  g.globalCompositeOperation = "source-over";
  var ic = new Path2D(ICONS[it.category]);       /* bieu tuong */
  g.save(); g.translate(88, 104); g.scale(1.55, 1.55);
  g.lineJoin = g.lineCap = "round";
  g.strokeStyle = "#5d4a26"; g.lineWidth = 1.9; g.stroke(ic);
  g.restore();
  g.fillStyle = "#3b2e15"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "700 52px 'Be Vietnam Pro', Arial, sans-serif";
  g.fillText((it.id < 10 ? "0" : "") + it.id, 176, 106);
  var t = new THREE.CanvasTexture(c); t.anisotropy = 8;
  return t;
}

(function docLeaves(){
  var dayMat = new THREE.MeshStandardMaterial({ color: 0x8c7047, roughness: 1 });

  /* 15 chiec la xep thanh 3 tang vong quanh cay.
     Moi tang lech goc va lech do cao, nen dung tu bat cu dau nhin vao
     cung thay 15 la tach bach, khong chiec nao che chiec nao.        */
  var TANG = [
    { y: 2.75, r: 5.6, lech: 0.00 },
    { y: 3.85, r: 4.9, lech: 0.42 },
    { y: 4.95, r: 5.3, lech: 0.84 }
  ];
  var MOI_TANG = Math.ceil(DATA.length / TANG.length);

  DATA.forEach(function(it, i){
    var tg = TANG[i % TANG.length];
    var thuTu = Math.floor(i / TANG.length);
    /* xe dich rat nho cho bot deu nhu may, van du cach de khong che nhau */
    var goc = tg.lech + thuTu * (Math.PI * 2 / MOI_TANG) + (Math.random() - .5) * .10;
    var bk  = tg.r + (Math.random() - .5) * .45;
    var t = new THREE.Vector3(Math.cos(goc) * bk,
                              tg.y + (Math.random() - .5) * .22,
                              Math.sin(goc) * bk);
    var grp = new THREE.Group();
    grp.position.copy(t);

    /* chiec la that: mat phang co huong rieng, bi canh che duoc */
    var tex = docLeafTexture(it);
    var geo = new THREE.PlaneGeometry(1.28, 1.75);
    geo.translate(0, .88, 0);
    var mat = new THREE.MeshStandardMaterial({
      map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: .46,
      transparent: true, alphaTest: .4, side: THREE.DoubleSide, roughness: .9 });
    var la = new THREE.Mesh(geo, mat);
    la.rotation.set((Math.random() - .5) * .5, Math.random() * 6.2832, (Math.random() - .5) * .4);
    grp.add(la);

    /* day treo va the go */
    /* day treo voi len tan la phia tren */
    var RU = Math.max(1.1, 7.3 - tg.y - 2.05);
    var dayTren = new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, RU, 5), dayMat);
    dayTren.position.set(0, 2.05 + RU / 2, 0);
    grp.add(dayTren);
    var day = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .52, 5), dayMat);
    day.position.set(0, -.26, 0);
    grp.add(day);
    var the = new THREE.Mesh(new THREE.PlaneGeometry(.88, .58),
      new THREE.MeshStandardMaterial({ map: tagTexture(it), transparent: true,
        alphaTest: .4, side: THREE.DoubleSide, roughness: .85,
        emissive: 0x6b5a30, emissiveIntensity: .35 }));
    the.position.set(0, -.72, 0);
    grp.add(the);

    /* dom sang nho bao hieu la bam duoc */
    var dom = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture("rgb(255,214,140)", .28), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: .55 }));
    dom.scale.set(2.2, 2.2, 1);
    dom.position.set(0, .68, 0);
    grp.add(dom);

    grp.userData = { item: it, la: la, the: the, dom: dom, ph: Math.random() * 6.2832 };
    scene.add(grp);
    leaves.push(grp);
  });
})();

/* ---------- dom dom ---------- */
var fireflies = [];
for (var q = 0; q < 54; q++) {
  var s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture("rgb(243,220,164)", .25), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: .85 }));
  s.scale.set(.24, .24, 1);
  s.userData = { a: Math.random() * 6.28, r: 3 + Math.random() * 15,
                 y: .4 + Math.random() * 6.5, sp: .09 + Math.random() * .26 };
  scene.add(s); fireflies.push(s);
}

/* ==========================================================
   BAN LA MOT HOC TRO: thay tay minh dua, dau nhun khi buoc,
   va co bong do duoi chan
   ========================================================== */
var body = new THREE.Group();
camera.add(body);
scene.add(camera);
var sleeveMat = new THREE.MeshStandardMaterial({ color: 0xeef0ea, roughness: .95 });
var handMat   = new THREE.MeshStandardMaterial({ color: 0xe0b894, roughness: .9 });
var arms = [];
[-1, 1].forEach(function(sx){
  var g = new THREE.Group();
  var sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.055, .048, .40, 9), sleeveMat);
  sleeve.position.set(0, -.20, 0); g.add(sleeve);
  var fore = new THREE.Mesh(new THREE.CylinderGeometry(.046, .040, .34, 9), handMat);
  fore.position.set(0, -.56, 0); g.add(fore);
  var hand = new THREE.Mesh(new THREE.SphereGeometry(.055, 10, 8), handMat);
  hand.position.set(0, -.75, 0); g.add(hand);
  g.position.set(sx * .33, -.29, -.44);
  g.rotation.set(-.62, sx * .30, sx * -.26);
  g.scale.setScalar(.92);
  body.add(g);
  arms.push(g);
});

var myShadow = (function(){
  var c = cvs(128, 128), g = c.getContext("2d");
  var gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  gr.addColorStop(0, "rgba(0,0,0,.5)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  var m = new THREE.Mesh(new THREE.CircleGeometry(.62, 24),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c),
      transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = .03;
  scene.add(m); return m;
})();

/* ==========================================================
   DIEU KHIEN
   ========================================================== */
var yaw = 0, pitch = .03, walk = 0, keys = {}, bob = 0;
var dragging = false, lastX = 0, lastY = 0, moved = 0;
var cv2 = renderer.domElement;

cv2.addEventListener("pointerdown", function(e){
  dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
  cv2.setPointerCapture(e.pointerId);
});
cv2.addEventListener("pointermove", function(e){
  if (!dragging) return;
  var dx = e.clientX - lastX, dy = e.clientY - lastY;
  lastX = e.clientX; lastY = e.clientY;
  moved += Math.abs(dx) + Math.abs(dy);
  yaw -= dx * .0035;
  pitch = Math.max(-.95, Math.min(.95, pitch - dy * .0032));
});
cv2.addEventListener("pointerup", function(e){
  dragging = false;
  if (moved < 6) pick(e.clientX, e.clientY);
});
cv2.addEventListener("pointercancel", function(){ dragging = false });

addEventListener("keydown", function(e){
  keys[e.code] = true;
  if (e.code === "Escape") hideCard();
  if (["ArrowUp","ArrowDown","Space"].indexOf(e.code) >= 0) e.preventDefault();
});
addEventListener("keyup", function(e){ keys[e.code] = false });

function holdBtn(id, dir){
  var b = document.getElementById(id);
  var on = function(e){ e.preventDefault(); walk = dir }, off = function(){ walk = 0 };
  b.addEventListener("pointerdown", on);
  b.addEventListener("pointerup", off);
  b.addEventListener("pointerleave", off);
  b.addEventListener("pointercancel", off);
}
holdBtn("fwd", 1); holdBtn("bwd", -1);

var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
var pickables = [];
leaves.forEach(function(g){ pickables.push(g.userData.la, g.userData.the) });
function hitAt(px, py){
  ndc.x = (px / innerWidth) * 2 - 1;
  ndc.y = -(py / innerHeight) * 2 + 1;
  ray.setFromCamera(ndc, camera);
  var hits = ray.intersectObjects(pickables, false);
  return hits.length ? hits[0].object.parent : null;
}
function pick(px, py){ var g = hitAt(px, py); if (g) showCard(g.userData.item) }

/* ---------- the QR ---------- */
var card = document.getElementById("card"), seen = {}, seenN = 0;
function showCard(it){
  document.getElementById("cTitle").textContent = it.title;
  document.getElementById("cChip").textContent = LABELS[it.category];
  var q = document.getElementById("cQr");
  q.src = it.qr; q.alt = "Mã QR của " + it.title;
  document.getElementById("cGo").href = it.url;
  var dl = document.getElementById("cDl");
  dl.href = it.qr; dl.download = "QR-" + (it.id < 10 ? "0" : "") + it.id + ".png";
  document.getElementById("cUrl").textContent = it.url;
  document.getElementById("cCopy").textContent = "Chép link";
  card.hidden = false; card.dataset.url = it.url;
  if (!seen[it.id]) { seen[it.id] = 1; seenN++;
    document.getElementById("count").textContent = seenN + " / " + DATA.length; }
}
function hideCard(){ card.hidden = true }
document.getElementById("cx").addEventListener("click", hideCard);
document.getElementById("cCopy").addEventListener("click", function(){
  var u = card.dataset.url, b = this;
  if (navigator.clipboard) navigator.clipboard.writeText(u)
    .then(function(){ b.textContent = "Đã chép ✓" }, function(){});
});

/* ==========================================================
   VONG LAP
   ========================================================== */
var reticle = document.getElementById("reticle"), look = document.getElementById("look");
/* Chuot: ngam ngay tai dau con tro, nen thay ten la nao la bam trung la do.
   Man hinh cam ung: ngam giua man hinh nhu cu.                        */
var TRO_NHAY = window.matchMedia("(pointer: fine)").matches;
var ngamX = innerWidth / 2, ngamY = innerHeight / 2;
if (TRO_NHAY) {
  reticle.style.display = "none";
  renderer.domElement.addEventListener("pointermove", function(e){
    ngamX = e.clientX; ngamY = e.clientY;
  }, { passive: true });
} else {
  addEventListener("resize", function(){ ngamX = innerWidth / 2; ngamY = innerHeight / 2 });
}
var clock = new THREE.Clock(), hot = null, fps = 0, fpsT = 0, frames = 0;

function frame(){
  requestAnimationFrame(frame);
  var dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  frames++; fpsT += dt;
  if (fpsT > 1) { fps = Math.round(frames / fpsT); frames = 0; fpsT = 0; window.__fps = fps; }

  /* di chuyen */
  var go = walk;
  if (keys.KeyW || keys.ArrowUp) go = 1;
  if (keys.KeyS || keys.ArrowDown) go = -1;
  var strafe = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  var moving = !!(go || strafe);
  if (moving) {
    var sp = 3.9 * dt;
    camera.position.x -= Math.sin(yaw) * go * sp;
    camera.position.z -= Math.cos(yaw) * go * sp;
    camera.position.x += Math.cos(yaw) * strafe * sp;
    camera.position.z -= Math.sin(yaw) * strafe * sp;
    var d = Math.hypot(camera.position.x, camera.position.z);
    if (d < 2.1) { camera.position.x *= 2.1 / d; camera.position.z *= 2.1 / d; }
    if (d > 40) { camera.position.x *= 40 / d; camera.position.z *= 40 / d; }
    bob += dt * 9.5;
  }
  /* dau nhun va tay dua khi buoc */
  camera.position.y = 1.62 + (moving ? Math.sin(bob) * .045 : Math.sin(t * 1.4) * .012);
  camera.rotation.set(pitch, yaw, 0, "YXZ");
  arms[0].rotation.x = -.62 + (moving ? Math.sin(bob) * .42 : Math.sin(t * 1.2) * .04);
  arms[1].rotation.x = -.62 - (moving ? Math.sin(bob) * .42 : Math.sin(t * 1.2) * .04);
  myShadow.position.set(camera.position.x, .03, camera.position.z);

  /* la tu lieu: lay theo gio, the go quay ve phia nguoi xem */
  for (var i = 0; i < leaves.length; i++) {
    var g = leaves[i], u = g.userData, nong = (g === hot);
    g.rotation.z = Math.sin(t * .85 + u.ph) * .07;
    g.rotation.x = Math.cos(t * .62 + u.ph) * .045;
    u.the.rotation.y = yaw;
    u.the.rotation.z = Math.sin(t * 1.5 + u.ph) * .11;
    u.dom.material.opacity = .32 + Math.abs(Math.sin(t * .9 + u.ph)) * .4;
    u.la.material.emissiveIntensity = nong ? .95 : .46;
    var sc3 = nong ? 1.13 : 1;
    g.scale.set(sc3, sc3, sc3);
  }
  /* dom dom */
  for (var f2 = 0; f2 < fireflies.length; f2++) {
    var s2 = fireflies[f2], u = s2.userData;
    u.a += u.sp * dt;
    s2.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t * .7 + u.a) * .5, Math.sin(u.a) * u.r);
  }

  /* gio lay nhe cac cay quanh san */
  for (var s3 = 0; s3 < swayers.length; s3++) {
    var sw = swayers[s3];
    sw.obj.rotation.z = Math.sin(t * .55 + sw.ph) * .016;
    sw.obj.rotation.x = Math.cos(t * .43 + sw.ph) * .012;
  }

  /* la dang nam giua tam nhin */
  var g2 = hitAt(ngamX, ngamY);
  if (g2 !== hot) {
    hot = g2;
    reticle.classList.toggle("hot", !!g2);
    if (g2) {
      look.innerHTML = "<b>" + g2.userData.item.title + "</b><i>" +
        LABELS[g2.userData.item.category] + " · bấm để xem QR</i>";
      look.classList.add("on");
    } else look.classList.remove("on");
  }
  if (hot && TRO_NHAY) {
    look.style.left = ngamX + "px";
    look.style.top  = (ngamY + 26) + "px";
  }

  renderer.render(scene, camera);
}
frame();
setTimeout(function(){ boot.classList.add("gone") }, 700);

addEventListener("resize", function(){
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
