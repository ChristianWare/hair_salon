import AboutUs from "@/components/HomePage/AboutUs/AboutUs";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Hero from "@/components/HomePage/Hero/Hero";
import Locations from "@/components/HomePage/Locations/Locations";
import OurTeam from "@/components/HomePage/OurTeam/OurTeam";
import Quote from "@/components/HomePage/Quote/Quote";
import ServicesPreview from "@/components/HomePage/ServicesPreview/ServicesPreview";
import Values from "@/components/HomePage/Values/Values";
import Welcome from "@/components/HomePage/Welcome/Welcome";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";
import Footer from "@/components/shared/Footer/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Welcome />
      <AboutUs />
      <ServicesPreview />
      <Quote />
      <OurTeam />
      <Locations />
      <Values />
      <FinalCTA />
      <InstaFeed />
      <Footer />
    </main>
  );
}
