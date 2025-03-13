import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import styles from "./style.module.css";
import axios from "axios";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IoIosInformationCircleOutline } from "react-icons/io";

type ContextType = {
  setTitle: Dispatch<SetStateAction<string>>;
};

type Item = {
  id: number;
  code: string;
  description: string;
};

type ApiResponse = {
  code: number;
  data: {
    totalCount: number;
    data: Item[];
  };
  exception: string | null;
};

const MandatoryDecision: React.FC = () => {
  const [data, setData] = useState<ApiResponse>();
  const [page, setPage] = useState<number>();

  useEffect(() => {
    const url = "/api/v1/goods/forced-decision/?key=&page=1&pageSize=5";
    axios.get(url).then((res) => setData(res.data));
  }, []);

  const fetchChildren = (_event: React.ChangeEvent<unknown>, num: number) => {
    if (num != page) {
      const url = `/api/v1/goods/forced-decision/?key=&page=${num}&pageSize=5`;
      axios.get(url).then((res) => setData(res.data));
      setPage(num);
    }
  };

  const { setTitle } = useOutletContext<ContextType>();
  useEffect(
    () => setTitle("Malların təsnifatı üzrə qəbul edilmiş Məcburi Qərarlar"),
    [setTitle]
  );

  return (
    <>
      <div className={styles.tableBox}>
        {/* Info */}
        <div className={styles.info}>
          <span>
            <IoIosInformationCircleOutline size={22} />
          </span>
          <div>
            <p>
              Malların təsnifatı üzrə qəbul edilmiş məcburi qərarların
              siyahısının nəşrinin əsas məqsədi tövsiyyə xarakteri daşımaqla
              gömrük bəyannamələrinin daha düzgün formada tərtib olunması üçün
              xarici ticarət iştirakçılarına əlavə imkanların yaradılmasından
              ibarətdir.
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Malın XİF MN üzrə kodu</th>
              <th>Malın təsviri</th>
            </tr>
          </thead>
          {data && data.data.data.length != 0 ? (
            <tbody>
              {data.data.data.map((item, i) => (
                <tr key={i}>
                  <td>{item.code}</td>
                  <td className={styles.desc}>{item.description}</td>
                </tr>
              ))}
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

      <Stack spacing={2}>
        <Pagination
          count={85}
          className={styles.pages}
          onChange={fetchChildren}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
    </>
  );
};

export default MandatoryDecision;
