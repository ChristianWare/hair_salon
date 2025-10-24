import AboutPageIntro from "@/components/AboutPage/AboutPageIntro/AboutPageIntro";
import AboutUsDetails from "@/components/AboutPage/AboutUsDetails/AboutUsDetails";
import OurTeamDetails from "@/components/AboutPage/OurTeamDetails/OurTeamDetails";
import WhyUs from "@/components/AboutPage/WhyUs/WhyUs";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footer from "@/components/shared/Footer/Footer";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function AboutPage() {
  return (
    <main>
      <AboutPageIntro />
      <AboutUsDetails />
      <WhyUs />
      <OurTeamDetails />
      <InstaFeed />
      <FinalCTA />
      <Footer />
    </main>
  );
}
