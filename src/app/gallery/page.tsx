import GalleryPageIntro from "@/components/GalleryPage/GalleryPageIntro/GalleryPageIntro";
import PhotoGroup from "@/components/GalleryPage/PhotoGroup/PhotoGroup";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

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
