import styles from "./styles.module.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
type Props = { title?: string; desc: string; clr?: string };

const Info = ({ title, desc, clr }: Props) => {
  return (
    <div className={styles.infos}>
      <span>
        <IoIosInformationCircleOutline size={22} />
      </span>
      <div>
        <h6 style={clr == "red" ? { color: "#f12b2c" } : {}}>{title}</h6>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default Info;

// import Info from "../../components/ui/info/Info";
// <Info title="" desc="" />
