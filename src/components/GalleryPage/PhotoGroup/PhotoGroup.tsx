// components/shared/PhotoGroup/PhotoGroup.tsx
import styles from "./PhotoGroup.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import fs from "fs";
import path from "path";
import PhotoGroupClient from "./PhotoGroup/PhotoGroupClient";

function getImages() {
  const dir = path.join(process.cwd(), "public", "images");
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => allowed.has(path.extname(f).toLowerCase()))
    .map((f) => `/images/${f}`);
}

export default function PhotoGroup() {
  const images = getImages();
  const pattern = [
    "",
    "vStretch",
    "hStretch",
    "",
    "",
    "vStretch",
    "bigStretch",
    "",
    "hStretch",
    "",
    "",
    "",
    "vStretch",
    "",
    "bigStretch",
    "",
    "hStretch",
    "",
    "bigStretch",
    "",
    "",
  ];

  return (
    <div className={styles.container}>
      <LayoutWrapper>
        <PhotoGroupClient images={images} pattern={pattern} />
      </LayoutWrapper>
    </div>
  );
}
