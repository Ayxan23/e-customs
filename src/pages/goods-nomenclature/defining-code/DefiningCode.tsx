import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { IoIosSearch } from "react-icons/io";
import styles from "./style.module.css";

import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Info from "../../../components/ui/info/Info";

const counts = [
  { code: "1", label: "1" },
  { code: "2", label: "2" },
  { code: "3", label: "3" },
  { code: "4", label: "4" },
  { code: "5", label: "5" },
];

type FormValues = {
  resCount: string;
  fin: string;
};

type ContextType = {
  setTitle: Dispatch<SetStateAction<string>>;
};

type GoodsItem = {
  hsCode: string;
  score: number;
  description: string;
  isGpt: boolean;
};

type ApiResponse = {
  code: number;
  data: {
    goodsList: GoodsItem[];
  };
};

const DefiningCode: React.FC = () => {
  const [data, setData] = useState<null | ApiResponse>();
  const onSubmit = async (data: FormValues) => {
    const url = `/api/v1/goods/prediction/?description=${data.fin}&count=${data.resCount}`;
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      resCount: "3",
      fin: "",
    },
  });

  const { setTitle } = useOutletContext<ContextType>();

  useEffect(() => setTitle("XİF MN Tövsiyə Sistemi"), [setTitle]);

  return (
    <div className={styles.wrapper}>
      {/* Info */}
      <Info
        desc="Diqqət! Axtarış son iki ildə gömrüyə bəyan edilən malların
            təsvirləri əsasında aparılır. Tövsiyyə olunan XİFMN kodarı yalnız
            maarifləndirmə xarakteri daşıyır və malın kodunun təyin edilməsi
            üçün əsas deyil."
      />

      {/* Form */}
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            name="resCount"
            control={control}
            rules={{ required: "Count is required" }}
            render={({ field }) => (
              <Autocomplete
                options={counts}
                className={styles.countStyle}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={styles.countStyle}
                    label="Nəticələrin sayı"
                    error={!!errors.resCount}
                    helperText={errors.resCount?.message}
                  />
                )}
                value={
                  counts.find((count) => count.code === field.value) || null
                }
                onChange={(_, value) => field.onChange(value ? value.code : "")}
              />
            )}
          />
          <div className={styles.search}>
            {/* search Input */}
            <Controller
              name="fin"
              control={control}
              rules={{
                required: "FIN is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ width: "100%" }}
                  label="Malın ticari adı"
                  error={!!errors.fin}
                  helperText={errors.fin?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("fin");
                  }}
                />
              )}
            />
          </div>

          <div className={styles.button}>
            <Button
              variant="contained"
              type="submit"
              style={{ background: "#1647a3" }}
            >
              <IoIosSearch size={22} />
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                reset();
                setData(null);
              }}
              style={{ color: "#1647a3", borderColor: "#1647a3" }}
            >
              Təmizlə
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.result} style={!data ? { display: "none" } : {}}>
        <div className={styles.card}>
          <h4>Tövsiyyə olunan nəticələr</h4>
          {data &&
            data.data.goodsList
              .filter((item) => !item.isGpt)
              .map((node, i) =>
                node.description.length > 10 ? (
                  <div className={styles.cardInfo} key={i}>
                    <div>
                      <p>
                        Kodu
                        <span>{node.hsCode}</span>
                      </p>
                      <Gauge
                        value={node.score}
                        height={100}
                        className={styles.gauge}
                        startAngle={0}
                        endAngle={360}
                        innerRadius="80%"
                        outerRadius="100%"
                        sx={() => ({
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#e43438",
                          },
                        })}
                      />
                    </div>
                    <p>
                      Təsviri
                      <span>{node.description}</span>
                    </p>
                  </div>
                ) : (
                  ""
                )
              )}
        </div>

        <div className={styles.card}>
          <h4>ChatGPT-nin tövsiyyə etdiyi</h4>
          {data &&
            data.data.goodsList
              .filter((item) => item.isGpt)
              .map((node, i) =>
                node.description.length > 10 ? (
                  <div className={styles.cardInfo} key={i}>
                    <div>
                      <p>
                        Kodu
                        <span>{node.hsCode}</span>
                      </p>
                      <Gauge
                        value={100}
                        height={100}
                        className={styles.gauge}
                        startAngle={0}
                        endAngle={360}
                        innerRadius="80%"
                        outerRadius="100%"
                        sx={() => ({
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#77dabf",
                          },
                        })}
                      />
                    </div>
                    <p>
                      Təsviri
                      <span>{node.description}</span>
                    </p>
                  </div>
                ) : (
                  ""
                )
              )}
        </div>
      </div>
    </div>
  );
};

export default DefiningCode;
