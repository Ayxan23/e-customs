import { Outlet } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { ImHammer2 } from "react-icons/im";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";

const NomenLayout = () => {
  const [title, setTitle] = useState("");

  return (
    <section className="container">
      <div className={styles.title}>
        <h2>Malların nomenklaturası</h2>
        <p className={styles.chName}>
          <a href="https://e.customs.gov.az/for-individuals" target="_blank">
            Fiziki şəxslər üçün
          </a>
          <span>/</span>
          Malların nomenklaturası
          {title != "" ? (
            <span className={styles.chName}>
              <span>/</span>
              {title}
            </span>
          ) : (
            ""
          )}
        </p>
      </div>

      <div className={styles.nav}>
        <Link to="/goods-nomenclature/nomenc">Malların nomenklaturası</Link>
        <div></div>
        <Link to="/goods-nomenclature/defining-code">
          <span>
            <IoMdSettings />
          </span>
          XİF MN Tövsiyə Sistemi
        </Link>
        <div></div>
        <Link to="/goods-nomenclature/mandatory-decision">
          <span>
            <ImHammer2 />
          </span>
          Malların təsnifatı üzrə qəbul edilmiş Məcburi Qərarlar
        </Link>
        {/* <div></div>
        <Link to="/goods-nomenclature/value-classification">
          Rəqəmsal dəyər təsnifatı
        </Link> */}
      </div>
      <Outlet context={{ setTitle }} />
    </section>
  );
};

export default NomenLayout;
