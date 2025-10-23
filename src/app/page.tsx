import AboutUs from "@/components/HomePage/AboutUs/AboutUs";
import Hero from "@/components/HomePage/Hero/Hero";
import ServicesPreview from "@/components/HomePage/ServicesPreview/ServicesPreview";
import Welcome from "@/components/HomePage/Welcome/Welcome";

export default function Home() {
  return (
    <main>
      <Hero />
      <Welcome />
      <AboutUs />
      <ServicesPreview />
    </main>
  );
}
