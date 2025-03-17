import React, { useState } from "react";
import styles from "./styles.module.css";
import { HiDocumentAdd } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdEdit } from "react-icons/md";

type FormValues = {
  nationality: string;
  fin: string;
  birthDate: Dayjs | null;
};

type ApiResponse = {
  code: number;
  data: {
    surname: string;
    name: string;
    fatherName: string;
    birthDate: string;
    serialNumber: string | null;
    pin: string | null;
    issuuiAuthority: string | null;
    issuingDate: string | null;
    expiryDate: string | null;
    countryId: string | null;
  };
  exception: string | null;
};
const Chekc: React.FC = () => {
  const [data, setData] = useState<ApiResponse>();
  console.log(data);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      nationality: "031-AZE",
      fin: "",
      birthDate: null,
    },
  });
  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const url = "/api/v1/gooen/step-one";
    try {
      const response = await axios.post(url, {
        birthDate:
          data.birthDate != null
            ? data.birthDate.format("YYYY-MM-DD")
            : data.birthDate,
        countryId: data.nationality,
        passportNumber: null,
        pin: data.fin,
      });

      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.new}>
        <HiDocumentAdd size={140} />
        <p>Yeni bəyannamə yaradın</p>
        <Link to="/passenger-declaration/add">+ Yeni</Link>
      </div>

      {/* Form */}
      <div className={styles.formWrapper}>
        {/* Info */}
        <div className={styles.info}>
          <span>
            <IoIosInformationCircleOutline size={22} />
          </span>
          <div>
            <h6>Qeyd</h6>
            <p>
              Əgər bəyannaməni qeydiyyatdan keçmədən tərtib etmisinizsə, pasport
              nömrənizi (və ya FİN-kod), doğum tarixinizi və mobil nömrənizi
              daxil edərək bəyannaməni tapa və düzəliş edə bilərsiniz.
            </p>
          </div>
        </div>
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
                label="Pasport nömrəsi ( və ya FİN )"
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
            {/* <Button variant="outlined" disabled>
              Geri
            </Button> */}
            <Button
              variant="contained"
              type="submit"
              style={{ background: "#126e4f" }}
            >
              <MdEdit size={16} style={{ marginRight: "5px" }} />
              Düzəliş edin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chekc;
