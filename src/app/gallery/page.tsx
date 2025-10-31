import GalleryPageIntro from "@/components/GalleryPage/GalleryPageIntro/GalleryPageIntro";
import PhotoGroup from "@/components/GalleryPage/PhotoGroup/PhotoGroup";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export const metadata = {
  title: "Gallery",
  description:
    "Explore our gallery showcasing stunning hair transformations and styles at Velvet & Vine. Get inspired for your next look!",
};

export default function GalleryPage() {
  return (
    <main>
      <GalleryPageIntro />
      <PhotoGroup />
      <FinalCTA />
      <InstaFeed />
      <Footerii />
    </main>
  );
}
