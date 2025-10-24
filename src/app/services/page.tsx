import AllServices from "@/components/ServicesPage/AllServices/AllServices";
import ServicePageIntro from "@/components/ServicesPage/ServicePageIntro/ServicePageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footer from "@/components/shared/Footer/Footer";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function ServicesPage() {
  return (
    <main>
      <ServicePageIntro />
      <AllServices />
      <FinalCTA />
      <InstaFeed />
      <Footer />
    </main>
  );
}
