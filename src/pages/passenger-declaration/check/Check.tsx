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
import { MdEdit } from "react-icons/md";
import Info from "../../../components/ui/info/Info";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

type FormValues = {
  fin: string;
  birthDate: Dayjs | null;
  phone: string;
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
  const [message, setMessage] = useState("");
  console.log(data);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      fin: "",
      phone: "",
      birthDate: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const url = `/api/v1/passenger-declaration/unauthorized?PassportNo=${
      data.fin
    }&BirthDate=${
      data.birthDate != null
        ? data.birthDate.format("YYYY-MM-DD")
        : data.birthDate
    }&phoneNo=${data.phone}`;
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
      setMessage("Heç bir məlumat tapılmadı");
      setTimeout(() => setMessage(""), 3000);
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
        <Info
          title="Qeyd"
          desc="Əgər bəyannaməni qeydiyyatdan keçmədən tərtib etmisinizsə, pasport
              nömrənizi (və ya FİN-kod), doğum tarixinizi və mobil nömrənizi
              daxil edərək bəyannaməni tapa və düzəliş edə bilərsiniz."
        />
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* FIN Input */}
          <Controller
            name="fin"
            control={control}
            rules={{
              required: "Mütləq daxil edilməlidir",
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
            rules={{ required: "Mütləq daxil edilməlidir" }}
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

          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Mütləq daxil edilməlidir",
              pattern: {
                value: /^(\+?\d{1,4}|0)?\d{6,14}$/,
                message: "Telefon nömrəsi düzgün formatda deyil",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <PhoneInput
                  {...field}
                  country="az"
                  enableSearch
                  inputStyle={{
                    width: "100%",
                    borderColor: fieldState.error ? "#d32f2f" : "#c4c4c4",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: "4px",
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  specialLabel=""
                  placeholder="Telefon nömrəsini daxil edin"
                />
                {fieldState.error && (
                  <span
                    style={{
                      color: "#d32f2f",
                      fontSize: "12px",
                      marginLeft: "14px",
                      marginTop: "-17px",
                    }}
                  >
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
          <span className={styles.errorMsg}>{message}</span>

          <div className={styles.button}>
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
