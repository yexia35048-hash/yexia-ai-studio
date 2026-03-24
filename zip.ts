import AdmZip from "adm-zip";

const zip = new AdmZip();
zip.addLocalFolder("dist", "dist");
zip.writeZip("public/sudoku-dist.zip");
console.log("Zip created successfully.");
