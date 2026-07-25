import archiver from "archiver";
import { spawnSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloadsDir = "public/downloads";
const downloadArchive = `${downloadsDir}/open-source-barware-download-package.zip`;
const sourceArchive = `${downloadsDir}/open-source-barware-source.zip`;

const downloadPackageFiles = [
  `${downloadsDir}/README.md`,
  `${downloadsDir}/LICENSE.txt`,
  `${downloadsDir}/NOTICE.md`,
  `${downloadsDir}/SOURCE-OFFER.md`,
  `${downloadsDir}/Bar-Inventory-Master.xlsx`,
  `${downloadsDir}/Quick-Count-Sheet.xlsx`,
  `${downloadsDir}/Variance-Calculator.xlsx`,
  `${downloadsDir}/Product-Database.xlsx`,
  `${downloadsDir}/master-prompt.md`,
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });

  if (result.status !== 0) {
    const detail = result.stderr || result.stdout || `${command} failed`;
    throw new Error(detail.trim());
  }

  return result.stdout ?? "";
}

function removeIfPresent(file) {
  const absolute = path.join(root, file);
  if (existsSync(absolute)) {
    unlinkSync(absolute);
  }
}

function assertFiles(files) {
  const missing = files.filter((file) => !existsSync(path.join(root, file)));
  if (missing.length > 0) {
    throw new Error(`Missing package files:\n${missing.join("\n")}`);
  }
}

async function createZip(archivePath, files, { flat = false } = {}) {
  await new Promise((resolve, reject) => {
    const output = createWriteStream(path.join(root, archivePath));
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);

    for (const file of files) {
      archive.file(path.join(root, file), {
        name: flat ? path.basename(file) : file,
      });
    }

    archive.finalize();
  });
}

mkdirSync(path.join(root, downloadsDir), { recursive: true });
assertFiles(downloadPackageFiles);

removeIfPresent(downloadArchive);
await createZip(downloadArchive, downloadPackageFiles, { flat: true });

const listedFiles = run("git", [
  "ls-files",
  "--cached",
  "--modified",
  "--others",
  "--exclude-standard",
]);

const excludedFromSource = new Set([downloadArchive, sourceArchive]);
// Cloudflare Pages hard limit is 25 MiB per file. Full-tree zip with media
// exceeds it; keep source offer lean (code + docs). Full tree remains on GitHub.
const sourceSkip =
  /^(public\/videos\/|public\/images\/|campaign\/|public\/B-ATCAVE\/fcr\/|public\/downloads\/.*\.zip$)/i;
const sourceFiles = Array.from(
  new Set(listedFiles.split(/\r?\n/).filter(Boolean)),
)
  .filter((file) => !excludedFromSource.has(file))
  .filter((file) => !file.startsWith(".git/"))
  .filter((file) => !sourceSkip.test(file))
  .filter((file) => !/\.(mp4|webm|png|jpe?g|webp|gif|pdf)$/i.test(file))
  .filter((file) => existsSync(path.join(root, file)));

assertFiles(sourceFiles);
removeIfPresent(sourceArchive);
await createZip(sourceArchive, sourceFiles);

console.log(`Wrote ${downloadArchive}`);
console.log(`Wrote ${sourceArchive}`);