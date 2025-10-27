import AboutUs from "@/components/HomePage/AboutUs/AboutUs";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Hero from "@/components/HomePage/Hero/Hero";
import Locations from "@/components/HomePage/Locations/Locations";
import OurTeam from "@/components/HomePage/OurTeam/OurTeam";
import Quote from "@/components/HomePage/Quote/Quote";
import Values from "@/components/HomePage/Values/Values";
import Welcome from "@/components/HomePage/Welcome/Welcome";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";
import AboutServicesPreview from "@/components/AboutPage/AboutServicesPreview/AboutServicesPreview";
import Footerii from "@/components/shared/Footerii/Footerii";

export default function Home() {
  return (
    <main>
      <Hero />
      <Welcome />
      <AboutUs />
      <Quote />
      <AboutServicesPreview />
      <OurTeam />
      <Locations />
      <Values />
      <FinalCTA />
      <InstaFeed />
      <Footerii />
    </main>
  );
}
