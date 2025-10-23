import AboutUs from "@/components/HomePage/AboutUs/AboutUs";
import Hero from "@/components/HomePage/Hero/Hero";
import Locations from "@/components/HomePage/Locations/Locations";
import OurTeam from "@/components/HomePage/OurTeam/OurTeam";
import Quote from "@/components/HomePage/Quote/Quote";
import ServicesPreview from "@/components/HomePage/ServicesPreview/ServicesPreview";
import Values from "@/components/HomePage/Values/Values";
import Welcome from "@/components/HomePage/Welcome/Welcome";

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
    </main>
  );
}
