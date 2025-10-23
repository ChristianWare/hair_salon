import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./OurTeam.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/team.jpg";
import Button from "@/components/shared/Button/Button";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

export default function OurTeam() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.imgContainer}>
            <Image
              src={Img1}
              alt='Team'
              title='Our Team'
              fill
              className={styles.img}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <LayoutWrapper>
              <div className={styles.sectionHeadingContainer}>
                <SectionHeading text='Our Stylists' />
              </div>
              <h2 className={styles.heading}>Meet Our Team</h2>
              <p className={styles.copy}>
                We take pride in our talented team of stylists, each with a
                passion for creativity and a commitment to excellence. Our
                experts specialize in everything from precision cuts and vibrant
                color to styling for special occasions. With years of experience
                and a keen eye for detail, our team is dedicated to making you
                look and feel amazing with every visit. Get to know our
                stylists, and let us help you achieve the hair of your dreams!
                We can’t wait to meet you and show you what we can do.
              </p>
              <div className={styles.btnContainer}>
                <Button href='/' text='Learn more' btnType='tanBorder' />
              </div>
            </LayoutWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
