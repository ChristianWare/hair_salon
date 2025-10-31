import BookAppointmentIntro from "@/components/BookAppointment/BookAppointmentIntro/BookAppointmentIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";

export const metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your next hair appointment at Velvet & Vine. Experience personalized service and expert care in a relaxing environment.",
};

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
