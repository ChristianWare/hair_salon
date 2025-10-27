import AllServices from "@/components/ServicesPage/AllServices/AllServices";
import ServicePageIntro from "@/components/ServicesPage/ServicePageIntro/ServicePageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function ServicesPage() {
  return (
    <main>
      <ServicePageIntro />
      <AllServices />
      <FinalCTA />
      <InstaFeed />
      <Footerii />
    </main>
  );
}
