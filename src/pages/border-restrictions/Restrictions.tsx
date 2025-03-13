import React, { useState } from "react";
import styles from "./styles.module.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

type FormValues = {
  nationality: string;
  fin: string;
  birthDate: Dayjs | null;
};

type ApiResponse = {
  code: number;
};

const Restrictions: React.FC = () => {
  const [data, setData] = useState<ApiResponse | boolean>(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      fin: "",
      birthDate: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const url = `/api/v1/user/border/${data.fin}/${
      data.birthDate != null
        ? data.birthDate.format("YYYY-MM-DD")
        : data.birthDate
    }`;

    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setData(false);
    }
  };

  return (
    <section className="container">
      <div className="title">
        <h2>Sərhədkeçmə məhdudiyyətinin yoxlanılması</h2>
        <p>
          <a href="https://e.customs.gov.az/for-individuals" target="_blank">
            Fiziki şəxslər üçün
          </a>
          <span>/</span>
          Sərhədkeçmə məhdudiyyətinin yoxlanılması
        </p>
      </div>

      <div className={styles.input}>
        {/* Info */}
        <div className={styles.info}>
          <span>
            <IoIosInformationCircleOutline size={22} />
          </span>
          <div>
            <p>
              Diqqət! Yalnız Dövlət Gömrük Komitəsi tərəfindən gömrük
              öhdəlikləri üzrə sərhədkeçməyə qoyulan məhdudiyyət barədə məlumat
              almaq olar.
            </p>
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
                required: "FIN is required",
                minLength: {
                  value: 7,
                  message: "FIN must be at least 7 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="FİN-i"
                  error={!!errors.fin}
                  helperText={errors.fin?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("fin");
                  }}
                />
              )}
            />

            {/* Birth Date Picker */}
            <Controller
              name="birthDate"
              control={control}
              rules={{ required: "Birth date is required" }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    {...field}
                    format="DD.MM.YYYY"
                    label="Doğum tarixi"
                    onChange={(date) => {
                      field.onChange(date);
                      trigger("birthDate");
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.birthDate,
                        helperText: errors.birthDate?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <div className={styles.button}>
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#1647a3" }}
              >
                Axtar
              </Button>
            </div>
          </form>
        </div>

        {/* Response */}
        <div
          className={styles.response}
          style={!data ? { display: "block" } : { display: "none" }}
        >
          <div className={styles.info}>
            <span>
              <IoMdCheckmarkCircleOutline size={22} />
            </span>
            <div>
              <p>
                Daxil etdiyiniz pasport nömrəsinə uyğun məlumat "Xüsusi Diqqət
                siyahısı" siyahısında tapılmadı. Dövlət Gömrük Komitəsi
                tərəfindən sərhədkeçməyə məhdudiyyət qoyulmayıb.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Restrictions;
