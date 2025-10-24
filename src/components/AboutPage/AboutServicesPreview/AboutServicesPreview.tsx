import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./AboutServicesPreview.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Button from "@/components/shared/Button/Button";
import Scissors from "@/components/shared/icons/Scissors/Scissors";
import Color from "@/components/shared/icons/Color/Color";
import Wedding from "@/components/shared/icons/Wedding/Wedding";
import Pipette from "@/components/shared/icons/Pipette/Pipette";
import Listing from "@/components/shared/icons/Listing/Listing";
import Luxury from "@/components/shared/icons/Luxury/Luxury";

const data = [
  {
    id: 1,
    title: "Haircuts & Shaping",
    description:
      "Precision cuts and personalized styling to enhance your natural beauty.",
    icon: <Scissors className={styles.icon} />,
  },
  {
    id: 2,
    title: "Coloring",
    description:
      "Vibrant colors and expert techniques to create your perfect look.",
    icon: <Color className={styles.icon} />,
  },
  {
    id: 3,
    title: "Styling",
    description:
      "Professional styling for special occasions or everyday elegance.",
    icon: <Wedding className={styles.icon} />,
  },
  {
    id: 4,
    title: "Hair Treatments",
    description:
      "Deep conditioning and restorative treatments to keep your hair healthy.",
    icon: <Pipette className={styles.icon} />,
  },
  {
    id: 5,
    title: "Bridal Services",
    description:
      "Complete bridal packages for your special day with hair and makeup.",
    icon: <Luxury className={styles.icon} />,
  },
  {
    id: 6,
    title: "Extensions",
    description:
      "Add length and volume with our premium hair extension services.",
    icon: <Listing className={styles.icon} />,
  },
];

export default function AboutServicesPreview() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <SectionHeading text='What we do' />
            <h2 className={styles.heading}>
              Learn more about <br className={styles.br} /> Our Services
            </h2>
            <p className={styles.copy}>
              We offer a full range of premium hair services tailored to meet
              your unique needs. Whether you&apos;re looking for a fresh
              haircut, vibrant color, or a stunning style for a special event,
              our talented team is here to bring your vision to life. From
              expert cuts and color transformations to nourishing treatments and
              flawless styling, we&apos;re committed to delivering results that
              make you look and feel your best.
            </p>
          </div>
          <div className={styles.bottom}>
            <div className={styles.mapDataContainer}>
              {data.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <div className={styles.iconContainer}>{item.icon}</div>
                  </div>
                  <div className={styles.cardRight}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.desc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.btnContainer}>
            <Button href='/' text='See All Services' btnType='brown' />
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
