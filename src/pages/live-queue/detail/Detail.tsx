import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

import axios from "axios";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useParams } from "react-router-dom";

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

type VehicleData = {
  numberInTurn: string;
  statusDesc: string;
  statusCode: number;
  avtoNo: string;
};

type ChildResponse = {
  data: {
    count: number;
    postName: string;
    data: VehicleData[];
  };
};
const flag = ["IR.svg", "GE.svg", "RU.svg", "AZ.svg", "TR.svg"];

const Detail: React.FC = () => {
  const [data, setData] = useState<ApiResponse>();
  const [child, setChild] = useState<ChildResponse>();
  const [pageCount, setPageCount] = useState<number>(1);

  const navigate = useNavigate();
  const [pages, setPage] = useState<number>();
  const { id, page } = useParams();

  useEffect(() => {
    const url = "/api/v1/transports/count";
    axios.get(url).then((res) => setData(res.data));

    const url2 = `/api/v1/transports/details?postCode=${id}&pageNumber=${page}&pageSize=20`;
    axios.get(url2).then((res) => {
      setChild(res.data);
      const num = Math.ceil(res.data.data.count / 20);
      setPageCount(num);
    });
  }, [id, page]);

  useEffect(() => {
    const url = "/api/v1/transports/count";
    axios.get(url).then((res) => setData(res.data));
  }, []);

  const fetchPage = (_event: React.ChangeEvent<unknown>, num: number) => {
    if (num != pages) {
      navigate(`/live-queue/detail/${id}/${num}`);
      setPage(num);
    }
  };

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
        <div className={styles.nav}>
          {data &&
            data.data.map((item, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.img}>
                  <img src={`/img/${flag[i]}`} alt="" />
                  <h4>{item.countryName}</h4>
                </div>
                {item.transports.map((desc, i) => (
                  <div
                    key={i}
                    style={
                      id == desc?.postCode.toString()
                        ? { backgroundColor: "rgb(219, 229, 235)" }
                        : {}
                    }
                    className={styles.name}
                    onClick={() => {
                      // fetchChild(desc.postCode);
                      navigate(`/live-queue/detail/${desc.postCode}/1`);
                    }}
                  >
                    <p>{desc.postName}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>

        <div className={styles.tableBox}>
          <div>
            <h6>
              {child ? child.data.postName : ""} üzrə gözləmədə olan nəqliyyat
              vasitələrinin siyahısı
            </h6>
            <table>
              <thead>
                <tr>
                  <th>Avtomobil nömrəsi</th>
                  <th>Növbədə sırası</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {child && child.data.count != 0 ? (
                  child?.data.data.map((item, i) => (
                    <tr key={i}>
                      <td>{item.avtoNo}</td>
                      <td>{item.numberInTurn}</td>
                      <td>{item.statusDesc}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Məlumat Yoxdur</td>
                    <td>Məlumat Yoxdur</td>
                    <td>Məlumat Yoxdur</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.pages}>
            <p>
              Sayı: <span>{child?.data.count}</span>
            </p>
            <Stack spacing={2}>
              <Pagination
                count={pageCount}
                onChange={fetchPage}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
