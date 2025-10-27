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
    price: 145,
    averageTime: "45-60 minutes",
    process: "Consultation • Shampoo • Cut • Style • Finish",
    difficulty: "Medium",
    category: "Cut & Style"
  },
  {
    id: 2,
    title: "Coloring",
    description:
      "Transform your hair with our professional coloring services, from highlights to full color changes.",
    src: Coloring,
    price: 100,
    averageTime: "2-4 hours",
    process: "Consultation • Color Analysis • Application • Processing • Rinse • Style",
    difficulty: "High",
    category: "Color"
  },
  {
    id: 3,
    title: "Styling",
    description:
      "Revitalize your hair with our nourishing treatments designed to restore health and shine.",
    src: Styling,
    price: 120,
    averageTime: "30-45 minutes",
    process: "Shampoo • Treatment Application • Blow Dry • Finish Styling",
    difficulty: "Low",
    category: "Style"
  },
  {
    id: 4,
    title: "Hair Wash & Blowdry",
    description:
      "Refresh your hair with our professional wash and blowdry service for a polished finish.",
    src: Wash,
    price: 175,
    averageTime: "30-40 minutes",
    process: "Shampoo • Condition • Towel Dry • Blow Dry • Style",
    difficulty: "Low",
    category: "Basic Care"
  },
  {
    id: 5,
    title: "Hair Extensions",
    description:
      "Add length and volume to your hair with our premium quality hair extension services.",
    src: Extensions,
    price: 200,
    averageTime: "2-3 hours",
    process: "Consultation • Color Match • Sectioning • Application • Blending • Style",
    difficulty: "High",
    category: "Enhancement"
  },
  {
    id: 6,
    title: "Perms & Relaxers",
    description:
      "Change your hair texture with our professional perm and relaxer treatments for lasting results.",
    src: Perm,
    price: 150,
    averageTime: "2-3 hours",
    process: "Consultation • Pre-treatment • Application • Processing • Neutralizing • Style",
    difficulty: "High",
    category: "Chemical Treatment"
  },
  {
    id: 7,
    title: "Scalp Treatment",
    description:
      "Pamper your scalp with our therapeutic treatments designed to promote healthy hair growth.",
    src: Scalp,
    price: 145,
    averageTime: "45-60 minutes",
    process: "Scalp Analysis • Deep Cleanse • Treatment Massage • Nourishing Mask • Rinse",
    difficulty: "Medium",
    category: "Treatment"
  },
  {
    id: 8,
    title: "Bridal Hair",
    description:
      "Look stunning on your special day with our elegant bridal hair styling services.",
    src: Bridal,
    price: 215,
    averageTime: "1.5-2 hours",
    process: "Consultation • Hair Prep • Intricate Styling • Securing • Final Touches",
    difficulty: "High",
    category: "Special Occasion"
  },
  {
    id: 9,
    title: "Hair Consultation",
    description:
      "Get expert advice on hair care and styling with our personalized consultation services.",
    src: Consult,
    price: 75,
    averageTime: "30 minutes",
    process: "Hair Analysis • Lifestyle Discussion • Recommendation • Care Plan",
    difficulty: "Low",
    category: "Consultation"
  },
] as const;
