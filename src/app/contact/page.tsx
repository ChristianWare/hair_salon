import WhyUs from "@/components/AboutPage/WhyUs/WhyUs";
import ContactPageIntro from "@/components/ContactPage/ContactPageIntro/ContactPageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footer from "@/components/shared/Footer/Footer";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function ContactPage() {
  return (
    <div>
      <ContactPageIntro />
      <WhyUs />
      <FinalCTA />
      <InstaFeed />
      <Footer />
    </div>
  );
}
