import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./OurTeamDetails.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/brooke.jpg";
import Img2 from "../../../../public/images/tahir.jpg";
import Img3 from "../../../../public/images/fellipe.jpg";
import Img4 from "../../../../public/images/stylist.jpg";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

const data = [
  {
    id: 1,
    name: "Johanna D.",
    role: "Senior Stylist",
    bio: "With 10+ years of experience in hair styling, Johanna is known for creative cuts.",
    photoUrl: Img1,
  },
  {
    id: 2,
    name: "Jane S.",
    role: "Junior Stylist",
    bio: "Jane is a rising star in the styling world, with a passion for modern cuts.",
    photoUrl: Img2,
  },
  {
    id: 3,
    name: "Fellipe S.",
    role: "Barber",
    bio: "Fellipe specializes in men's grooming and classic cuts.",
    photoUrl: Img3,
  },
  {
    id: 4,
    name: "Brooke J.",
    role: "Colorist",
    bio: "Brooke is an expert in hair coloring techniques and trends.",
    photoUrl: Img4,
  },
];

export default function OurTeamDetails() {
  return (
    <div className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 className={styles.heading}>Meet our team</h2>
            <p className={styles.copy}>
              Our team is a group of passionate and skilled stylists who are
              dedicated to making you look and feel your best. With expertise in
              everything from cutting-edge hair trends to timeless styles, each
              stylist brings their unique creativity and precision to every
              client.
            </p>
          </div>
          <div className={styles.mapDataContainer}>
            {data.map((member) => (
              <div key={member.id} className={styles.card}>
                <div className={styles.imgContainer}>
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    className={styles.img}
                  />
                </div>
                <div className={styles.meta}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <SectionHeading text={member.role} />
                  <p className={styles.bio}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
