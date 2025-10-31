import AboutPageIntro from "@/components/AboutPage/AboutPageIntro/AboutPageIntro";
import AboutUsDetails from "@/components/AboutPage/AboutUsDetails/AboutUsDetails";
import OurTeamDetails from "@/components/AboutPage/OurTeamDetails/OurTeamDetails";
import WhyUs from "@/components/AboutPage/WhyUs/WhyUs";
import ServicesPreview from "@/components/HomePage/ServicesPreview/ServicesPreview";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Velvet & Vine, our mission to simplify booking, and how we help businesses reduce no-shows and increase revenue with custom booking websites.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutPageIntro />
      <AboutUsDetails />
      <WhyUs />
      <OurTeamDetails />
      <ServicesPreview />
      <InstaFeed />
      <FinalCTA />
      <Footerii />
    </main>
  );
}
