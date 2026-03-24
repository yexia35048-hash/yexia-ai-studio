import AdmZip from "adm-zip";

const zip = new AdmZip();
zip.addLocalFolder("src", "src");
zip.addLocalFolder("public", "public");
zip.addLocalFile("index.html");
zip.addLocalFile("package.json");
zip.addLocalFile("vite.config.ts");
zip.addLocalFile("tsconfig.json");
zip.addLocalFile("metadata.json");
zip.writeZip("public/sudoku-source.zip");
console.log("Source zip created successfully.");
