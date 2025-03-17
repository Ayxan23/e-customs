import React, { useState } from "react";
import styles from "./styles.module.css";
import Items from "../../assets/mocks/main.json";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faIdBadge,
  faCar,
  faRectangleList,
  faFilePowerpoint,
  faCalculator,
  faFileLines,
  faBuilding,
  faFileContract,
  faFilm,
  faList,
  faGrip,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Main: React.FC = () => {
  const [active, setActive] = useState(false);
  const [frameLink, setFrameLink] = useState("/");

  const obj = [
    faCreditCard,
    faIdBadge,
    faCar,
    faRectangleList,
    faFilePowerpoint,
    faCalculator,
    faFileLines,
    faBuilding,
    faFileContract,
  ];

  return (
    <section className="container">
      <h4 className={styles.title}>Qeydiyyatsız xidmətlər</h4>
      <div className={styles.inputBox}>
        <div>
          <span
            style={!active ? { background: "#e6edf7" } : {}}
            onClick={() => setActive(false)}
          >
            <FontAwesomeIcon icon={faGrip} />
          </span>
          <span
            style={active ? { background: "#e6edf7" } : {}}
            onClick={() => setActive(true)}
          >
            <FontAwesomeIcon icon={faList} />
          </span>
        </div>
      </div>

      <div className={active ? styles.cardBox2 : styles.cardBox}>
        {Items.map((item, i) => (
          <Link to={item.link ?? ""} className={styles.card} key={item.id}>
            <div className={styles.icons} style={{ color: item.icon }}>
              <FontAwesomeIcon icon={obj[i]} />
            </div>
            <div className={active ? styles.content2 : styles.content}>
              <span>
                <h3>{item.title}</h3>
                <span>{item.desc}</span>
              </span>
              <div className={styles.hoverIcons}>
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.pdfLink == "") return;
                    const url = item.pdfLink;
                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  style={{ color: item.pdfLink != "" ? "#1647a3" : "" }}
                >
                  <FontAwesomeIcon icon={faFileContract} />
                  <div className={styles.hoverIcon}>Təlimat</div>
                  <div className={styles.triangle}></div>
                </span>
                <span
                  style={{ color: item.videoLink != "" ? "#1647a3" : "" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.videoLink == "") return;
                    setFrameLink(item.videoLink);
                  }}
                >
                  <FontAwesomeIcon icon={faFilm} />
                  <div className={styles.hoverIcon}>Video təlimat</div>
                  <div className={styles.triangle}></div>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className={frameLink != "/" ? styles.video : styles.displayNone}>
        <div>
          <p>Video təlimat</p>
          <iframe
            src={frameLink}
            title="GÖÖEN  elektron xidməti"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <span onClick={() => setFrameLink("/")}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>
      </div>
    </section>
  );
};

export default Main;
