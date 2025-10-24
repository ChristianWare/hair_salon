import GalleryPageIntro from "@/components/GalleryPage/GalleryPageIntro/GalleryPageIntro";
import PhotoGroup from "@/components/GalleryPage/PhotoGroup/PhotoGroup";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footer from "@/components/shared/Footer/Footer";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function GalleryPage() {
  return (
    <main>
      <GalleryPageIntro />
      <PhotoGroup />
      <FinalCTA />
      <InstaFeed />
      <Footer />
    </main>
  );
}
