import WhyUs from "@/components/AboutPage/WhyUs/WhyUs";
import ContactPageIntro from "@/components/ContactPage/ContactPageIntro/ContactPageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function ContactPage() {
  return (
    <div>
      <ContactPageIntro />
      <WhyUs />
      <FinalCTA />
      <InstaFeed />
      <Footerii />
    </div>
  );
}
