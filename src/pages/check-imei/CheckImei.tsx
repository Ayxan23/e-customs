import React, { useState } from "react";
import styles from "./styles.module.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineWarningAmber } from "react-icons/md";

type FormValues = {
  fin: string;
};

type ApiResponse = {
  code: number;
  data: {
    status: "warning" | "success" | "error";
    message: string;
  };
  exception: string | null;
};

const CheckImei: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      fin: "",
    },
  });

  const validateIMEI = (value: string) => {
    if (!/^\d{15}$/.test(value)) return "IMEI must be exactly 15 digits";

    let sum = 0;
    for (let i = 0; i < 15; i++) {
      let digit = parseInt(value[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    if (sum % 10 !== 0) return "Invalid IMEI number";

    return true;
  };

  const onSubmit = async (data: FormValues) => {
    const url = `/api/v1/dictionaries/check-imei/${data.fin}`;

    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="container">
      <div className="title">
        <h2>IMEI nömrəsinin qeydiyyatını yoxlayın</h2>
        <p>
          <a href="https://e.customs.gov.az/" target="_blank">
            Şəxsi kabinet
          </a>
          <span>/</span>
          IMEI nömrəsinin qeydiyyatını yoxlayın
        </p>
      </div>

      <div className={styles.input}>
        {/* Info */}
        <div className={styles.info}>
          <span>
            <IoIosInformationCircleOutline size={22} />
          </span>
          <div>
            <p>Mobil cihazların IMEI nömrəsinin yoxlanılması</p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* FIN Input */}
            <Controller
              name="fin"
              control={control}
              rules={{
                required: "IMEI is required",
                validate: validateIMEI,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="IMEI nömrəsini daxil edin"
                  error={!!errors.fin}
                  helperText={errors.fin?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("fin");
                  }}
                />
              )}
            />

            <div className={styles.button}>
              <Button variant="contained" type="submit">
                Yoxlayın
              </Button>
            </div>
          </form>
        </div>

        {/* Response */}
        <div
          className={
            data?.data.status != "warning" ? styles.response : styles.warning
          }
          style={data ? { display: "block" } : { display: "none" }}
        >
          <div className={styles.info}>
            <span>
              {data?.data.status != "warning" ? (
                <IoMdCheckmarkCircleOutline size={22} />
              ) : (
                <MdOutlineWarningAmber size={22}/>
              )}
            </span>
            <div>
              <p>{data?.data.message}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckImei;
