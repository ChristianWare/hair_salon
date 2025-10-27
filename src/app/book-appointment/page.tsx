import BookAppointmentIntro from "@/components/BookAppointment/BookAppointmentIntro/BookAppointmentIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export default function BookAppointmentPage() {
  return (
    <main>
      <BookAppointmentIntro />
      <FinalCTA />
      <InstaFeed />
      <Footerii />
    </main>
  );
}
