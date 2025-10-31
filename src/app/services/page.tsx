import AllServices from "@/components/ServicesPage/AllServices/AllServices";
import ServicePageIntro from "@/components/ServicesPage/ServicePageIntro/ServicePageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export const metadata = {
  title: "Our Services",
  description:
    "Explore our comprehensive range of hair care services designed to meet all your styling needs. From trendy cuts to vibrant colors, our expert stylists are here to help you look and feel your best.",
};

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
