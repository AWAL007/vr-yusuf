/* ============================================================================
 * tour.js  —  Logika Virtual Reality (VR) Tour dengan A-Frame
 * ----------------------------------------------------------------------------
 * File ini berisi:
 *   1. tourData  : konfigurasi 17 spot + rute bercabang + objek 3D
 *   2. renderSpot: merender hotspot interaktif & objek 3D ke scene
 *   3. loadSpot  : berpindah spot (ganti skybox 360 + render ulang)
 *
 * Semua nilai posisi (X Y Z) dan skala objek 3D di tourData bisa Anda ubah
 * dengan bebas untuk menyesuaikan tampilan secara visual.
 * ========================================================================== */

/* ============================================================================
 * 1. KONFIGURASI TOUR
 * ----------------------------------------------------------------------------
 *  - image     : id <img> di <a-assets> (dipakai sebagai a-sky / background)
 *  - title     : nama spot yang tampil di HUD
 *  - hotspots  : daftar tombol pindah spot. Tiap tombol bisa dikustom:
 *                { target: id spot tujuan, label: teks tombol, pos: "X Y Z",
 *                  scale:    "X Y Z"  (opsional, ukuran tombol per hotspot),
 *                  rotation: "X Y Z"  (opsional, rotasi tombol/ikon),
 *                  model:    "#id"    (opsional, model 3D .glb, mis. "#panah-3d"),
 *                  icon:     "#id"    (opsional, gambar PNG kustom dari
 *                                       <a-assets>, mis. "#btn-pindah"),
 *                  color:    "#hex"   (opsional, warna tombol default) }
 *                pos hotspot relatif terhadap pusat (0,0,0) = posisi kamera.
 *                Y sebaiknya ~1.5 agar sejajar pandangan. Jarak ~3-5.
 *                scale: atur besar-kecil tombol SATU PER SATU / per spot.
 *                Tombol yang jauh dari kamera bisa dibuat lebih besar
 *                (mis. scale: "2 2 2") agar tetap mudah dilihat/klik; yang
 *                dekat bisa scale: "0.8 0.8 0.8". Ukuran dasar model diatur
 *                oleh MODEL_BASE_SCALE di createHotspotButton().
 *  - objects3D : daftar objek 3D yang ditempatkan di spot ini.
 *                { shape: primitif, pos: "X Y Z", rot: "X Y Z", scale: "X Y Z",
 *                  color: "#hex", label: teks opsional }
 *
 *  CATATAN OBJEK 3D:
 *   Folder assets/models masih kosong, jadi kita memakai primitif A-Frame
 *   (dodecahedron / box / sphere / torus / octahedron). Jika nanti file .glb
 *   tersedia, cukup tambahkan <a-asset-item id="model-N" src="...glb"> di
 *   index.html dan ganti pembuatan entitas objek menjadi a-gltf-model
 *   (lihat fungsi createObject3D di bawah).
 * ========================================================================== */
const tourData = {
  // ---------------------[ 1 ]---------------------
  spot1: {
    image: "#img-spot1",
    title: "Spot 1 — Titik Awal",
    hotspots: [
      { target: "spot2", label: "Ke Spot 2  ➜", pos: "-15 1.6 -4" },
      {
        target: "spot8",
        label: "Ke Spot 8  ➜",
        pos: "15 1.6 -4",
        scale: "1 1 1",
      },
      { target: "spot9", label: "Ke Spot 9  ➜", pos: "0 1.6 -15" },
    ],
    objects3D: [
      // Objek di sudut kanan depan
      {
        shape: "a-dodecahedron",
        color: "#ff7043",
        pos: "2.6 1.0 -3.2",
        rot: "0 0 0",
        scale: "0.8 0.8 0.8",
        label: "Kristal",
      },
    ],
  },

  // ---------------------[ 2 ]---------------------
  spot2: {
    image: "#img-spot2",
    title: "Spot 2",
    hotspots: [
      {
        target: "spot1",
        label: "↩  Kembali ke Spot 1",
        pos: "25 2 -40",
        scale: "4 4 4",
      },
      {
        target: "spot3",
        label: "Ke Spot 3 ➜",
        pos: "-5 1.5 -3",
        scale: "0.5 0.5 0.5",
      },
    ],
    objects3D: [],
  },

  // ---------------------[ 3 ]---------------------
  spot3: {
    image: "#img-spot3",
    title: "Spot 3",
    hotspots: [
      { target: "spot4", label: "↩  Ke spot 4", pos: "-10 1.6 -2" },
      {
        target: "spot9",
        label: "Ke Spot 9  ➜",
        pos: "-0.2 1.6 -5",
        scale: "0.5 0.5 0.5",
      },
      {
        target: "spot2",
        label: "Ke Spot 2  ➜",
        pos: "10 1.3 -0.6",
        scale: "0.5 0.5 0.5",
      },
    ],
    objects3D: [],
  },

  // ---------------------[ 4 ]---------------------
  spot4: {
    image: "#img-spot4",
    title: "Spot 4",
    hotspots: [
      { target: "spot3", label: "↩  Kembali ke Spot 3", pos: "8 1.6 -5" },
      {
        target: "spot5",
        label: "Ke Spot 5  ➜",
        pos: "-2.5 1.6 -4",
        scale: "0.5 0.5 0.5",
      },
    ],
    /*objects3D: [
      // Objek di sudut kiri depan
      { shape: "a-box", color: "#42a5f5", pos: "-2.6 1.0 -3.2", rot: "0 35 0", scale: "1 1 1", label: "Kubus" }
    ]*/
  },

  // ---------------------[ 5 ]---------------------
  spot5: {
    image: "#img-spot5",
    title: "Spot 5",
    hotspots: [
      {
        target: "spot4",
        label: "↩  Kembali ke Spot 4",
        pos: "10 1.6 -2",
        scale: "1 1 1",
      },
      { target: "spot6", label: "Ke Spot 6  ➜", pos: "-15 1 2" },
    ],
    objects3D: [],
  },

  // ---------------------[ 6 ]---------------------
  spot6: {
    image: "#img-spot6",
    title: "Spot 6",
    hotspots: [
      { target: "spot5", label: "↩  Kembali ke Spot 5", pos: "5.5 1.6 -6" },
      {
        target: "spot7",
        label: "Ke Spot 7  ➜",
        pos: "-3 1.6 -2",
        scale: "0.3 0.3 0.3",
      },
    ],
    objects3D: [],
  },

  // ---------------------[ 7 ]---------------------
  spot7: {
    image: "#img-spot7",
    title: "Spot 7",
    hotspots: [
      { target: "spot6", label: "↩  Kembali ke Spot 6", pos: "10 1.6 -4" },
      { target: "spot8", label: "Ke Spot 8  ➜", pos: "-10 1.6 2.6" },
      {
        target: "spot9",
        label: "Ke Spot 9  ➜",
        pos: "-1.6 1.6 -5",
        scale: "0.5 0.5 0.5",
      },
    ],
    objects3D: [],
  },

  // ---------------------[ 8 ]---------------------
  spot8: {
    image: "#img-spot8",
    title: "Spot 8 — Persimpangan",
    hotspots: [
      { target: "spot7", label: "↩  Ke Spot 7", pos: "10 1.6 3" },
      { target: "spot1", label: "Ke Spot 1  ➜", pos: "1 1.6 -9" },
    ],
    objects3D: [
      // Objek di sudut kanan belakang
      {
        shape: "a-torus",
        color: "#ab47bc",
        pos: "3.0 1.2 2.8",
        rot: "0 0 0",
        scale: "0.9 0.9 0.9",
        label: "Cincin",
      },
    ],
  },

  // ---------------------[ 9 ]---------------------
  spot9: {
    image: "#img-spot9",
    title: "Spot 9",
    hotspots: [
      {
        target: "spot1",
        label: "↩  Kembali ke Spot 1",
        pos: "0.1 1.5 4",
        scale: "0.2 0.2 0.2",
      },
      { target: "spot13", label: "Ke Spot 13  ➜", pos: "10 1.6 8" },
      { target: "spot11", label: "Ke Spot 11  ➜", pos: "-10 1.4 -5" },
      { target: "spot10", label: "Ke Spot 10  ➜", pos: "-10 1.6 10" },
      { target: "spot12", label: "Ke Spot 12  ➜", pos: "10 1.3 -7" },
      {
        target: "spot16",
        label: "Ke Spot 16  ➜",
        pos: "15 6 2",
        scale: "1.5 1.5 1.5",
      },
      {
        target: "spot14",
        label: "Ke Spot 14  ➜",
        pos: "-8 4 1",
        scale: "1 1 1",
      },
      { target: "spot15", label: "Ke Spot 15  ➜", pos: "0 5 10" },
    ],
    objects3D: [],
  },

  // ---------------------[ 10 ]---------------------
  spot10: {
    image: "#img-spot10",
    title: "Spot 10",
    hotspots: [{ target: "spot9", label: "Ke Spot 9  ➜", pos: "0 1.6 -8" }],
    objects3D: [],
  },

  // ---------------------[ 11 ]---------------------
  spot11: {
    image: "#img-spot11",
    title: "Spot 11",
    hotspots: [{ target: "spot9", label: "Ke Spot 9  ➜", pos: "-3 1.6 -8" }],
    objects3D: [
      // Objek di sudut kiri depan
      {
        shape: "a-octahedron",
        color: "#66bb6a",
        pos: "-2.6 1.0 -3.2",
        rot: "0 0 0",
        scale: "0.85 0.85 0.85",
        label: "Octahedron",
      },
    ],
  },

  // ---------------------[ 12 ]---------------------
  spot12: {
    image: "#img-spot12",
    title: "Spot 12",
    hotspots: [
      {
        target: "spot9",
        label: "Ke Spot 9  ➜",
        pos: "0.3 1.6 -4",
        scale: "0.6 0.6 0.6",
      },
    ],
    objects3D: [],
  },

  // ---------------------[ 13 ]---------------------
  spot13: {
    image: "#img-spot13",
    title: "Spot 13",
    hotspots: [{ target: "spot9", label: "Ke Spot 9  ➜", pos: "4 1.4 -8" }],
    objects3D: [],
  },

  // ---------------------[ 14 ]---------------------
  spot14: {
    image: "#img-spot14",
    title: "Spot 14",
    hotspots: [
      {
        target: "spot9",
        label: "⟳  Ke spot 9",
        pos: "1  1 -3",
        icon: "#btn-pindah",
        scale: "0.5 0.5 0.5",
      },
    ],
    objects3D: [],
  },

  // ---------------------[ 15 ]---------------------
  spot15: {
    image: "#img-spot15",
    title: "Spot 15",
    hotspots: [
      {
        target: "spot9",
        label: "⟳  Ke spot 9",
        pos: "0  1 -5",
        icon: "#btn-pindah",
        scale: "0.5 0.5 0.5",
      },
    ],
    objects3D: [
      // Objek di sudut kanan depan
      {
        shape: "a-sphere",
        color: "#ffa726",
        pos: "2.6 1.1 -3.2",
        rot: "0 0 0",
        scale: "0.9 0.9 0.9",
        label: "Bola",
      },
    ],
  },

  // ---------------------[ 16 ]---------------------
  spot16: {
    image: "#img-spot16",
    title: "Spot 16 — Tujuan Akhir",
    hotspots: [
      {
        target: "spot9",
        label: "⟳  Ke spot 9",
        pos: "0  1.3 -3",
        icon: "#btn-pindah",
        scale: "0.5 0.5 0.5",
      },
    ],
    objects3D: [
      // Objek di sudut kiri belakang (objek ke-5, tersebar di spot berbeda)
      {
        shape: "a-torus-knot",
        color: "#ef5350",
        pos: "-3.0 1.2 4",
        rot: "0 0 0",
        scale: "0.9 0.9 0.9",
        label: "Torus Knot",
      },
    ],
  },
};

/* ============================================================================
 * 1B. createHotspotButton(hs)  —  SATU TEMPAT untuk mengedit tampilan tombol
 * ----------------------------------------------------------------------------
 *  Ubah bentuk / warna / ukuran / model tombol hotspot HANYA di fungsi ini.
 *  Properti yang didukung pada tiap item `hotspots` di tourData:
 *    - scale    : "X Y Z"  -> ukuran tombol (opsional, default "1 1 1")
 *    - rotation : "X Y Z"  -> rotasi tombol, mis. "0 180 0" (opsional)
 *    - model    : "#id"    -> pakai model 3D (.glb) dari <a-assets>,
 *                             mis. model: "#panah-3d" (default tombol).
 *    - icon     : "#id"    -> pakai gambar PNG kustom dari <a-assets>,
 *                             mis. icon: "#btn-pindah" (dipakai bila model kosong).
 *    - color    : "#hex"    -> warna tombol default (opsional)
 *  PRIORITAS TAMPILAN: model 3D  >  icon PNG  >  lingkaran default.
 *  CATATAN: elemen tombol SELALU diberi class "clickable" agar bisa diklik
 *  mouse maupun gaze cursor VR.
 * ========================================================================== */
function createHotspotButton(hs) {
  var btn;

  // Ukuran DASAR model 3D tombol (berlaku untuk SEMUA hotspot).
  // Untuk membuat tombol lebih besar/kecil di SATU spot tertentu, atur
  // properti `scale` pada hotspot tersebut di tourData (mengalikan nilai ini).
  var MODEL_BASE_SCALE = "0.5 0.5 0.5";

  // Prioritas tampilan tombol:
  //   1) hs.model  -> <a-gltf-model> (model 3D, mis. "#panah-3d")
  //   2) hs.icon   -> <a-image> (gambar PNG, mis. "#btn-pindah")
  //   3) default   -> <a-gltf-model> "#panah-3d" (model 3D bawaan)
  var DEFAULT_MODEL = "#panah-3d";
  var modelSrc = hs.model || DEFAULT_MODEL;

  if (modelSrc) {
    // ---- Mode MODEL 3D: render <a-gltf-model> (panah_3d.glb) ----
    btn = document.createElement("a-gltf-model");
    btn.setAttribute("src", modelSrc); // contoh: "#panah-3d"
    // Ukuran DASAR model (berlaku untuk semua tombol).
    // -> Cara mengatur besar-kecil PER SPOT: pakai `scale` di tourData,
    //    contoh: { ... , scale: "1.5 1.5 1.5" }. Nilai itu akan mengali
    //    ukuran dasar ini. (Lihat createHotspot -> wrapper scale.)
    btn.setAttribute("scale", MODEL_BASE_SCALE);
    btn.setAttribute("position", "0 0 0");
  } else if (hs.icon) {
    // ---- Mode GAMBAR KUSTOM: render <a-image> dari src #id di <a-assets> ----
    btn = document.createElement("a-image");
    btn.setAttribute("src", hs.icon); // contoh: "#btn-pindah"
    btn.setAttribute("width", "1");
    btn.setAttribute("height", "1");
    btn.setAttribute("position", "0 0 0");
    // transparansi untuk PNG (latar tembus pandang)
    btn.setAttribute(
      "material",
      "shader: flat; transparent: true; alphaTest: 0.1",
    );
  } else {
    // ---- Mode DEFAULT: lingkaran A-Frame + ikon panah SVG (ala Bootstrap) ----
    btn = document.createElement("a-circle");
    btn.setAttribute("radius", "0.5");
    btn.setAttribute("color", hs.color || "#00ffcc");
    btn.setAttribute("material", "shader: flat; opacity: 0.9");

    // Ikon panah (SVG data-URI) di atas tombol
    var ARROW_SVG =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
          '<path fill="#003b36" d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4z"/>' +
          "</svg>",
      );

    var iconEl = document.createElement("a-plane");
    iconEl.setAttribute("width", "0.5");
    iconEl.setAttribute("height", "0.5");
    iconEl.setAttribute("position", "0 0 0.01");
    iconEl.setAttribute("material", {
      shader: "flat",
      transparent: true,
      alphaTest: 0.5,
      depthTest: false,
      src: ARROW_SVG,
    });
    btn.appendChild(iconEl);
  }

  // WAJIB: class clickable -> terdeteksi raycaster mouse & gaze VR
  btn.setAttribute("class", "clickable hotspot-btn");

  // Rotasi tombol/ikon (opsional), mis. "0 0 45" untuk memutar arah panah
  btn.setAttribute("rotation", hs.rotation || "0 0 0");

  // Animasi hover (membesar saat disentuh mouse)
  btn.setAttribute(
    "animation__hover",
    "property: scale; startEvents: mouseenter; to: 0.5 0.5 0.5; dur: 150",
  );
  btn.setAttribute(
    "animation__leave",
    "property: scale; startEvents: mouseleave; to: 0.5 0.5 0.5; dur: 150",
  );

  // Efek klik -> pindah ke spot tujuan
  btn.addEventListener("click", function () {
    window.loadSpot(hs.target);
  });

  return btn;
}

/* ============================================================================
 * 2. RENDER SPOT
 * ========================================================================== */
(function () {
  "use strict";

  let sceneEl = null;
  let contentEl = null;
  let skyEl = null;
  let hudSpot = null;

  // Inisialisasi setelah scene A-Frame siap
  document.addEventListener("DOMContentLoaded", function () {
    sceneEl = document.getElementById("scene");
    contentEl = document.getElementById("scene-content");
    skyEl = document.getElementById("skybox");
    hudSpot = document.getElementById("hud-spot");

    if (!sceneEl) return;

    // Tunggu scene benar-benar loaded (aset 360 selesai di-preload)
    if (sceneEl.hasLoaded) {
      startTour();
    } else {
      sceneEl.addEventListener("loaded", startTour, { once: true });
    }
  });

  function startTour() {
    loadSpot("spot1");

    // Sembunyikan layar loading
    var loading = document.getElementById("loading");
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(function () {
        loading.style.display = "none";
      }, 500);
    }
  }

  /**
   * loadSpot — berpindah ke spot tertentu.
   * Mengganti background 360, menghapus hotspot/objek lama, lalu merender ulang.
   */
  window.loadSpot = function (spotKey) {
    var data = tourData[spotKey];
    if (!data) {
      console.warn("Spot tidak ditemukan:", spotKey);
      return;
    }

    // 1. Ganti gambar background 360
    if (skyEl) skyEl.setAttribute("src", data.image);

    // 2. Update judul HUD
    if (hudSpot) hudSpot.textContent = data.title || spotKey;

    // 3. Bersihkan hotspot & objek 3D dari spot sebelumnya
    while (contentEl.firstChild) {
      contentEl.removeChild(contentEl.firstChild);
    }

    // 4. Render hotspot
    (data.hotspots || []).forEach(function (hs) {
      contentEl.appendChild(createHotspot(hs));
    });

    // 5. Render objek 3D
    (data.objects3D || []).forEach(function (obj) {
      contentEl.appendChild(createObject3D(obj));
    });

    console.log(
      "Loaded",
      spotKey,
      "| hotspots:",
      (data.hotspots || []).length,
      "| objek3D:",
      (data.objects3D || []).length,
    );
  };

  /* --------------------------------------------------------------------------
   * createHotspot — membungkus tombol (createHotspotButton) dengan:
   *   - look-at  : selalu menghadap kamera
   *   - scale    : ukuran per hotspot (dari data)
   *   - label    : teks di bawah tombol (ikut look-at karena jadi anak)
   * CATATAN: tampilan tombol sendiri diatur di createHotspotButton(hs).
   * ------------------------------------------------------------------------ */
  function createHotspot(hs) {
    // Wadah hotspot — look-at menghadap kamera, posisi sesuai data
    var wrapper = document.createElement("a-entity");
    wrapper.setAttribute("position", hs.pos);
    wrapper.setAttribute("look-at", "#camera"); // selalu hadap kamera

    // Ukuran per-tombol (opsional). Default 1 1 1.
    // Isi di tourData: scale: "1.5 1.5 1.5" pada masing-masing hotspot.
    wrapper.setAttribute("scale", hs.scale || "1 1 1");

    wrapper.setAttribute(
      "animation__float",
      "property: position; dir: alternate; dur: 1200; loop: true; " +
        "easing: easeInOutSine; from: " +
        hs.pos +
        "; to: " +
        floatUp(hs.pos),
    );

    // Tombol interaktif (bentuk / warna / gambar diatur di createHotspotButton)
    var btn = createHotspotButton(hs);
    wrapper.appendChild(btn);

    // Label teks di bawah tombol (ikut wrapper look-at)
    var label = document.createElement("a-text");
    label.setAttribute("value", hs.label);
    label.setAttribute("align", "center");
    label.setAttribute("color", "#ffffff");
    label.setAttribute("width", "1.6");
    label.setAttribute("wrap-count", "16");
    label.setAttribute("position", "0 -0.55 0");
    label.setAttribute("scale", "0.6 0.6 0.6");

    wrapper.appendChild(label);
    return wrapper;
  }

  /* --------------------------------------------------------------------------
   * createObject3D — membuat objek 3D (placeholder primitif) dengan:
   *   - rotasi perlahan (animation rotasi)
   *   - label opsional
   *
   * CATATAN: Ganti bagian shape dengan a-gltf-model bila file .glb tersedia.
   * ------------------------------------------------------------------------ */
  function createObject3D(obj) {
    // Jika model glb tersedia, gunakan:
    //   var el = document.createElement("a-gltf-model");
    //   el.setAttribute("src", obj.model);   // e.g. "#model-1"
    // Dan hapus setAttribute geometry/material di bawah.

    var el = document.createElement(obj.shape || "a-box");

    // Geometri primitif + material
    el.setAttribute("position", obj.pos || "0 1 0");
    el.setAttribute("rotation", obj.rot || "0 0 0");
    el.setAttribute("scale", obj.scale || "1 1 1");
    el.setAttribute("color", obj.color || "#ffffff");
    el.setAttribute(
      "material",
      "shader: standard; metalness: 0.2; roughness: 0.6",
    );

    // Animasi rotasi perlahan (sumbu Y)
    el.setAttribute(
      "animation__spin",
      "property: rotation; to: 0 360 0; loop: true; dur: 12000; easing: linear",
    );

    // Label opsional di atas objek
    if (obj.label) {
      var label = document.createElement("a-text");
      label.setAttribute("value", obj.label);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#ffffff");
      label.setAttribute("width", "1.4");
      label.setAttribute("position", "0 0.9 0");
      label.setAttribute("scale", "0.5 0.5 0.5");
      label.setAttribute("look-at", "#camera"); // label selalu hadap kamera
      el.appendChild(label);
    }

    return el;
  }

  /* --------------------------------------------------------------------------
   * Helper — menggeser Y sedikit untuk animasi apung hotspot
   * ------------------------------------------------------------------------ */
  function floatUp(pos) {
    var parts = pos.split(" ").map(Number);
    if (parts.length !== 3 || isNaN(parts[1])) return pos;
    parts[1] = (parts[1] + 0.12).toFixed(2);
    return parts.join(" ");
  }
})();
