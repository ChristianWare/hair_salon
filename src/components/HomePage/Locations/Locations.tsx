import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./Locations.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/location1.jpg";
import Img2 from "../../../../public/images/location2.jpg";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Button from "@/components/shared/Button/Button";

export default function Locations() {
  return (
    <div className={styles.container}>
      <LayoutWrapper>
        <div className={styles.top}>
          <SectionHeading text='Locations' />
          <h2 className={styles.heading}>Where you can find us</h2>
          <div className={styles.btnContainer}>
            <Button href='/' text='Book your appointment' btnType='tanBorder' />
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.card}>
            <div className={styles.imgContainer}>
              <Image src={Img1} alt='Location 1' fill className={styles.img} />
            </div>
            <div className={styles.cardBottom}>
              <SectionHeading text='480-555-8877' />
              <h3 className={styles.locationName}>Scottsdale</h3>
              <p className={styles.address}>
                123 Main St, Scottsdale, AZ 85254
              </p>
              <p className={styles.description}>
                Our Scottsdale location offers a luxurious salon experience in
                the heart of Old Town.
              </p>

              <div className={styles.btnContainer}>
                <Button href='/' text='Get Directions' btnType='tanBorder' />
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.imgContainer}>
              <Image src={Img2} alt='Location 2' fill className={styles.img} />
            </div>
            <div className={styles.cardBottom}>
              <SectionHeading text='602-555-4877' />
              <h3 className={styles.locationName}>Phoenix</h3>
              <p className={styles.address}>
                456 Central Ave, Phoenix, AZ 85004
              </p>
              <p className={styles.description}>
                Located in downtown Phoenix, our salon combines urban chic with
                a welcoming atmosphere.
              </p>

              <div className={styles.btnContainer}>
                <Button href='/' text='Get Directions' btnType='tanBorder' />
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
