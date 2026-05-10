const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const loader = document.getElementById("loader");
const resultSection = document.getElementById("resultSection");

const beforeImage = document.getElementById("beforeImage");
const afterImage = document.getElementById("afterImage");

const downloadBtn = document.getElementById("downloadBtn");

let outputBlob = null;

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (e) => {

  const file = e.target.files[0];

  if(!file) return;

  beforeImage.src = URL.createObjectURL(file);

  loader.classList.remove("hidden");

  const formData = new FormData();
  formData.append("image", file);

  try{

    const response = await fetch("/remove-bg", {
      method:"POST",
      body:formData
    });

    const blob = await response.blob();

    outputBlob = blob;

    const outputUrl = URL.createObjectURL(blob);

    afterImage.src = outputUrl;

    loader.classList.add("hidden");

    resultSection.classList.remove("hidden");

  }catch(error){

    alert("Something went wrong.");

    loader.classList.add("hidden");

  }

});

downloadBtn.addEventListener("click", () => {

  if(!outputBlob) return;

  const a = document.createElement("a");

  a.href = URL.createObjectURL(outputBlob);

  a.download = "removed-background.png";

  a.click();

});