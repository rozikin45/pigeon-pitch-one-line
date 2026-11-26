import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ENTRY =
  "We are Uber, but for breadcrumbs: a flock of ten thousand couriers, zero salaries, and we already own every park bench in the city.";

// Gate from the competition rules: the entry must be 1 to 200 characters.
const MAX_CHARS = 200;

const outputPath = fileURLToPath(new URL("/output/entry.txt", import.meta.url));
const tempPath = `${outputPath}.tmp-${process.pid}`;

writeFileSync(tempPath, ENTRY, "utf8");
renameSync(tempPath, outputPath);

const written = readFileSync(outputPath, "utf8");
const writtenBytes = readFileSync(outputPath);

if (!writtenBytes.equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("[byte-equality] output bytes do not match the entry line");
}
if (written.length < 1 || written.length > MAX_CHARS) {
  throw new Error(
    `[length] output is ${written.length} characters, outside the 1 to ${MAX_CHARS} character gate`,
  );
}
if (written.includes("\n")) {
  throw new Error("[single-line] output must be a single line");
}
if (written.trim().length === 0) {
  throw new Error("[non-whitespace] output must not be only whitespace");
}
for (const ch of written) {
  if (ch.codePointAt(0)! < 0x20) {
    throw new Error(
      `[control-character] output contains a control character U+${ch
        .codePointAt(0)!
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")}`,
    );
  }
}

console.log(`wrote ${written.length} characters to ${outputPath}`);
