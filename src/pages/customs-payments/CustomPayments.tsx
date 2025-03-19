import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { IoIosSearch } from "react-icons/io";
import Title from "../../components/ui/title/Title";
import Info from "../../components/ui/info/Info";

const CustomPayments: React.FC = () => {
  useEffect(() => {}, []);
  const [inputData, setInputData] = useState("");
  const [selectData, setSelectData] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectData != "" && inputData != "") {
      const url = "/api/v1/customs-payment/by-type";
      try {
        const response = await axios.post(url, {
          paymentType: selectData,
          no: inputData,
        });
        setData(response.data);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  const optionData = [
    "Sadələşdirilmiş gömrük bəyannaməsi",
    "Gömrük bəyannaməsi",
    "Müvəqqəti saxlanc",
    "Nəqliyyat barkodu",
    "Cərimə",
    "Avans ödənişləri",
    "Ekspertiza",
  ];

  return (
    <section className="container">
      <Title
        title="Elektron gömrük ödənişləri"
        linkTitle="XİF iştirakçıları üçün"
        url="https://e.customs.gov.az/for-xif"
      />

      <div className={styles.inputBox}>
        <h6>Birbaşa ödənişlər</h6>
        <form onSubmit={handleSubmit}>
          <label>
            Ödənişin növü
            <select
              onChange={(e) => {
                setSelectData(e.target.value);
              }}
              value={selectData}
            >
              <option value="">seçin</option>
              {optionData.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sənəd nömrəsi
            <input
              type="text"
              value={inputData}
              onChange={(e) => {
                setInputData(e.target.value);
              }}
            />
          </label>
          <button type="submit">
            <IoIosSearch />
          </button>
          <button
            onClick={() => {
              if (inputData != "" && selectData != "") {
                setInputData("");
                setSelectData("");
              }
            }}
          >
            Təmizlə
          </button>
        </form>
      </div>

      <div className={styles.tableBox}>
        <h5>Borclar</h5>
        <table>
          <thead>
            <tr>
              <th>Sənəd nömrəsi</th>
              <th>Tarix</th>
              <th>Ödəyici</th>
              <th>Məbləğ</th>
              <th>Status</th>
            </tr>
          </thead>
          {data.length != 0 ? (
            <tbody>
              <tr>
                {data.map((item, i) => (
                  <td key={i}>{item}</td>
                ))}
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr className={styles.notFound}>
                <td>Məlumat yoxdur</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <Info
        title="Qeyd"
        desc="Borclar bölməsində yalnız sizin FİN-koda və ya VÖEN/GÖÖEN-ə bağlı
            olan ödənişlər göstərilir. Hər hansı digər gömrük ödənişlərini etmək
            üçün “Birbaşa ödənişlər” bölməsindən istifadə edə bilərsiniz"
      />
    </section>
  );
};

export default CustomPayments;
