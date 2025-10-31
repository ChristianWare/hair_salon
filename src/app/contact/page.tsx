import WhyUs from "@/components/AboutPage/WhyUs/WhyUs";
import ContactPageIntro from "@/components/ContactPage/ContactPageIntro/ContactPageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact our hair salon to book an appointment or inquire about our services. We're here to help you achieve your perfect look!",
};

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
