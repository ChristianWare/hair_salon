import AboutUs from "@/components/HomePage/AboutUs/AboutUs";
import Hero from "@/components/HomePage/Hero/Hero";
import Quote from "@/components/HomePage/Quote/Quote";
import ServicesPreview from "@/components/HomePage/ServicesPreview/ServicesPreview";
import Welcome from "@/components/HomePage/Welcome/Welcome";

export default function Home() {
  return (
    <main>
      <Hero />
      <Welcome />
      <AboutUs />
      <ServicesPreview />
      <Quote />
    </main>
  );
}
