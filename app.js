// ── NeuroCut AI — Browser-only Background Remover ──
// Uses @imgly/background-removal (browser build) via CDN
// No server, no backend, 100% free

const fileInput    = document.getElementById("fileInput");
const uploadLabel  = document.getElementById("uploadLabel");
const dropArea     = document.getElementById("dropArea");
const loader       = document.getElementById("loader");
const resultSection= document.getElementById("resultSection");
const beforeImage  = document.getElementById("beforeImage");
const afterImage   = document.getElementById("afterImage");
const downloadBtn  = document.getElementById("downloadBtn");
const newBtn       = document.getElementById("newBtn");

let outputBlob = null;

// ── File Input ──
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) processImage(file);
});

// ── Drag & Drop ──
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("drag-over");
});
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("drag-over");
});
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) processImage(file);
});

// ── Main Processing Function ──
async function processImage(file) {
  // Show before image
  beforeImage.src = URL.createObjectURL(file);

  // Show loader, hide others
  dropArea.classList.add("hidden");
  resultSection.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    // Convert file to blob URL for the library
    const imgUrl = URL.createObjectURL(file);

    // imglyRemoveBackground is loaded from CDN script tag
    // It runs entirely in the browser using WebAssembly
    const resultBlob = await imglyRemoveBackground(imgUrl, {
      publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/",
      model: "small", // 'small' = faster, 'medium' = better quality
      output: {
        format: "image/png",
        quality: 1,
      }
    });

    outputBlob = resultBlob;
    afterImage.src = URL.createObjectURL(resultBlob);

    // Show result
    loader.classList.add("hidden");
    resultSection.classList.remove("hidden");

  } catch (err) {
    console.error("Background removal failed:", err);
    loader.classList.add("hidden");
    dropArea.classList.remove("hidden");

    // User-friendly error
    alert("⚠️ Kuch gadbad ho gayi!\n\nDobara try karo ya koi doosri image use karo.\n\nError: " + err.message);
  }
}

// ── Download ──
downloadBtn.addEventListener("click", () => {
  if (!outputBlob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(outputBlob);
  a.download = "neurocut-removed-bg.png";
  a.click();
});

// ── Upload New ──
newBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  dropArea.classList.remove("hidden");
  fileInput.value = "";
  outputBlob = null;
  beforeImage.src = "";
  afterImage.src = "";
});

