import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { FaCarAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Transport = {
  postCode: number;
  postName: string;
  countInWay: number;
  countInQueue: number;
};

type CountryData = {
  countryCode: number;
  abbreviation: string;
  shortName: string | null;
  countryName: string;
  transports: Transport[];
};

type ApiResponse = {
  data: CountryData[];
};

const flag = ["IR.svg", "GE.svg", "RU.svg", "AZ.svg", "TR.svg"];

const LiveQueue: React.FC = () => {
  const [data, setData] = useState<ApiResponse>();
  useEffect(() => {
    const url = "/api/v1/transports/count";
    axios.get(url).then((res) => setData(res.data));
  }, []);
  const navigate = useNavigate();
  return (
    <section className="container">
      {/* Title */}
      <div className="title">
        <h2>Sərhəddə yük nəqliyyat vasitələrinin sayı</h2>
        <p>
          <a href="https://e.customs.gov.az/for-individuals" target="_blank">
            Fiziki şəxslər üçün
          </a>
          <span>/</span>
          Sərhəddə yük nəqliyyat vasitələrinin sayı
        </p>
      </div>

      <div className={styles.wrapper}>
        {data &&
          data.data.map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.img}>
                <img src={`/img/${flag[i]}`} alt="" />
                <h4>{item.countryName}</h4>
              </div>
              {item.transports.map((desc, i) => (
                <div key={i}>
                  <div className={styles.name}>
                    <FaCarAlt />
                    <p>{desc.postName}</p>
                  </div>
                  <div className={styles.info}>
                    <p>
                      Bu posta istiqamətlənən yük nəqliyyat vasitələrinin sayı:{" "}
                      <span>{desc.countInWay}</span>
                    </p>
                    <p>
                      Çıxışda canlı növbədə olan yük nəqliyyat vasitələrinin
                      sayı: <span>{desc.countInQueue}</span>
                    </p>
                  </div>
                  <div
                    className={styles.link}
                    onClick={() =>
                      navigate(`/live-queue/detail/${desc.postCode}/1`)
                    }
                  >
                    <span>
                      Ətraflı
                      <IoIosArrowForward />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
};

export default LiveQueue;
