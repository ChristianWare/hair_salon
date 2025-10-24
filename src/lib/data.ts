import Haircut from "../../public/images/curls.jpg";
import Coloring from "../../public/images/coloring.jpg";
import Styling from "../../public/images/styling.jpg";
import Wash from "../../public/images/wash.jpg";
import Extensions from "../../public/images/extensions.jpg";
import Perm from "../../public/images/perm.jpg";
import Scalp from "../../public/images/scalp.jpg";
import Bridal from "../../public/images/bridal.jpg";
import Consult from "../../public/images/consult.jpg";

export const servicesData = [
  {
    id: 1,
    title: "Haircut",
    description:
      "Experience a fresh new look with our expert haircut  services tailored to your preferences.",
    src: Haircut,
  },
  {
    id: 2,
    title: "Coloring",
    description:
      "Transform your hair with our professional coloring services, from highlights to full color changes.",
    src: Coloring,
  },
  {
    id: 3,
    title: "Styling",
    description:
      "Revitalize your hair with our nourishing treatments designed to restore health and shine.",
    src: Styling,
  },
  {
    id: 4,
    title: "Hair Wash & Blowdry",
    description:
      "Refresh your hair with our professional wash and blowdry service for a polished finish.",
    src: Wash,
  },
  {
    id: 5,
    title: "Hair Extensions",
    description:
      "Add length and volume to your hair with our premium quality hair extension services.",
    src: Extensions,
  },
  {
    id: 6,
    title: "Perms & Relaxers",
    description:
      "Change your hair texture with our professional perm and relaxer treatments for lasting results.",
    src: Perm,
  },
  {
    id: 7,
    title: "Scalp Treatment",
    description:
      "Pamper your scalp with our therapeutic treatments designed to promote healthy hair growth.",
    src: Scalp,
  },
  {
    id: 8,
    title: "Bridal Hair",
    description:
      "Look stunning on your special day with our elegant bridal hair styling services.",
    src: Bridal,
  },
  {
    id: 9,
    title: "Hair Consultation",
    description:
      "Get expert advice on hair care and styling with our personalized consultation services.",
    src: Consult,
  },
] as const;
