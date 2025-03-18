import styles from "./styles.module.css";
const Level = ({ next }: { next: string }) => {
  return (
    <>
      {/* Level */}
      <div className={styles.level}>
        <p className={styles.active}>
          <span>1</span>
          <span>Başla</span>
        </p>
        <div></div>
        <p className={next != "1" ? styles.active : ""}>
          <span>2</span>
          <span>Şəxsi məlumatlar</span>
        </p>
        <div></div>
        <p className={next != "1" && next != "2" ? styles.active : ""}>
          <span>3</span>
          <span>İstiqamət</span>
        </p>
        {/* <div></div>
      <p
        className={
          next != "1" && next != "2" && next != "3" ? styles.active : ""
        }
      >
        <span>4</span>
        <span>Mallar/valyuta haqqında məlumatlar</span>
      </p> */}
        <div></div>
        <p className={next == "4" ? styles.active : ""}>
          <span>4</span>
          <span>Təqdim edin</span>
        </p>
      </div>
    </>
  );
};

export default Level;
