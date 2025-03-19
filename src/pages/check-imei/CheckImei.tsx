import React, { useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineWarningAmber } from "react-icons/md";
import Title from "../../components/ui/title/Title";
import Info from "../../components/ui/info/Info";

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
      <Title
        title="IMEI nömrəsinin qeydiyyatını yoxlayın"
        linkTitle="Şəxsi kabinet"
        url="https://e.customs.gov.az/"
      />

      <div className={styles.input}>
        {/* Info */}
        <Info desc="Mobil cihazların IMEI nömrəsinin yoxlanılması" />

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
                <MdOutlineWarningAmber size={22} />
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
