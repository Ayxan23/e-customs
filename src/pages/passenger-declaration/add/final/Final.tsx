import React from "react";
import styles from "./styles.module.css";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
const Final: React.FC = () => {
  return (
    <div className={styles.finalWrapper}>
      <span>
        <TbRosetteDiscountCheckFilled size={150} />
      </span>
      <p>Bəyannamə Hazırdır</p>
      <Link to="/">
        <IoMdExit size={22}/>
      </Link>
    </div>
  );
};

export default Final;
