// ── NeuroCut AI — Background Remover ──
// Library loads via <script> tag in index.html
// removeBackground comes from window scope via UMD build

const fileInput     = document.getElementById("fileInput");
const dropArea      = document.getElementById("dropArea");
const loader        = document.getElementById("loader");
const resultSection = document.getElementById("resultSection");
const beforeImage   = document.getElementById("beforeImage");
const afterImage    = document.getElementById("afterImage");
const downloadBtn   = document.getElementById("downloadBtn");
const newBtn        = document.getElementById("newBtn");

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

// ── Main Processing ──
async function processImage(file) {
  beforeImage.src = URL.createObjectURL(file);
  dropArea.classList.add("hidden");
  resultSection.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const imgUrl = URL.createObjectURL(file);

    // backgroundRemoval is the global from the UMD CDN script
    const resultBlob = await backgroundRemoval.removeBackground(imgUrl, {
      publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
      model: "small",
      output: {
        format: "image/png",
        quality: 1,
      }
    });

    outputBlob = resultBlob;
    afterImage.src = URL.createObjectURL(resultBlob);

    loader.classList.add("hidden");
    resultSection.classList.remove("hidden");

  } catch (err) {
    console.error("Error:", err);
    loader.classList.add("hidden");
    dropArea.classList.remove("hidden");
    alert("⚠️ Error: " + err.message + "\n\nDobara try karo.");
  }
}

// ── Download ──
downloadBtn.addEventListener("click", () => {
  if (!outputBlob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(outputBlob);
  a.download = "neurocut-bg-removed.png";
  a.click();
});

// ── New Image ──
newBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  dropArea.classList.remove("hidden");
  fileInput.value = "";
  outputBlob = null;
  beforeImage.src = "";
  afterImage.src = "";
});
