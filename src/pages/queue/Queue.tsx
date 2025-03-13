import React from "react";
import styles from "./styles.module.css";
import { IoIosWarning } from "react-icons/io";
const Queue: React.FC = () => {
  return (
    <section className="container">
      <div className={styles.wrapper}>
        <span>
          <IoIosWarning size={140} />
          <div></div>
        </span>
        <p>
          e-xidmətin yeni versiyası hazırlıq mərhələsindədir. Əvvəlki versiyadan
          istifadə etmək üçün bu{" "}
          <a href="https://c2b.customs.gov.az/queue.aspx" target="_blank">
            Linkə
          </a>{" "}
          keçid edin
        </p>
      </div>
    </section>
  );
};

export default Queue;
