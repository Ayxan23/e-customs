import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const countries = [
  { code: "031-AZE", label: "Azerbaijan", flag: "🇦🇿" },
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "DE", label: "Germany", flag: "🇩🇪" },
  { code: "FR", label: "France", flag: "🇫🇷" },
];

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

type FinalResponse = {
  code: number;
  data: {
    person: {
      surname: string;
      name: string;
      fatherName: string;
      birthDate: string;
      serialNumber: string | null;
      pin: string | null;
      issuuiAuthority: string | null;
      issuingDate: string | null;
      expiryDate: string | null;
    };
    status: string;
    gooen: string;
  };
  exception: string | null;
};

const Gooen: React.FC = () => {
  const [next, setNext] = useState<null | boolean>(null);
  const [data, setData] = useState<ApiResponse>();
  const [final, setFinal] = useState<FinalResponse>();
  const [nationality, setNationality] = useState("");
  const [message, setMessage] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
      setNationality(data.nationality);
      setNext(true);
      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
      setMessage(
        "Daxil etdiyiniz FİN-koda və ya doğum tarixinə uyğun heç bir məlumat tapılmadı"
      );
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const onFinal = async () => {
    const url = "/api/v1/gooen";
    try {
      if (data) {
        const { data: obj } = data;
        obj.birthDate = dayjs(obj.birthDate).format("YYYY-MM-DD");
        obj.countryId = nationality;
        const response = await axios.post(url, obj);
        setFinal(response.data);
        setNext(false);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <section className="container" style={{ paddingBottom: "40px" }}>
      {/* Title */}
      <div className={styles.title}>
        <h2>GÖÖEN - Gömrük ödənişlərinin ödəyicisinin eyniləşdirmə nömrəsi</h2>
        <p>
          <a href="https://e.customs.gov.az/for-individuals" target="_blank">
            Fiziki şəxslər üçün
          </a>
          <span>/</span>
          GÖÖEN
        </p>
      </div>


      {/* Level */}
      <div className={styles.level}>
        <p
          className={
            next == null || next == true || next == false ? styles.active : ""
          }
        >
          <span>1</span><span>Axtarış</span>
        </p>
        <div></div>
        <p className={next == true || next == false ? styles.active : ""}>
          <span>2</span><span>Şəxsi məlumatlar</span>
        </p>
        <div></div>
        <p className={next == false ? styles.active : ""}>
          <span>3</span><span>Son</span>
        </p>
      </div>

      {/* Info */}
      <div
        className={styles.info}
        style={next == null ? {} : { display: "none" }}
      >
        <span>
          <IoIosInformationCircleOutline size={22} />
        </span>
        <div>
          <p>
            Gömrük ödənişlərinin ödəyicisinin eyniləşdirmə nömrəsi (GÖÖEN) -
            vergi ödəyicisi olmayan fiziki şəxslərə VÖEN əvəzi verilir və həmin
            şəxslərin gömrük sərhədindən keçirdikləri rüsuma cəlb olunan
            malların və nəqliyyat vasitələrinin üzərində gömrük
            rəsmiləşdirilməsi aparmasına imkan verir. Hüquqi şəxslər gömrük
            əməliyyatları aparmaq üçün mütləq VÖEN-ə sahib olmalıdırlar və bu
            səbəbdən onlara GÖÖEN verilmir.
          </p>
          <h6>
            Diqqət! Şəxsin razılığı olmadan onun haqqında məlumatların
            yayılmasına görə Azərbaycan Respublikasının Cinayət Məcəlləsinə
            əsasən hüquqi məsuliyyət daşıyırsınız.
          </h6>
        </div>
      </div>

      {/* Form */}
      <div
        className={styles.formWrapper}
        style={next == null ? {} : { display: "none" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            name="nationality"
            control={control}
            rules={{ required: "Nationality is required" }}
            render={({ field }) => (
              <Autocomplete
                options={countries}
                getOptionLabel={(option) => `${option.flag} ${option.label}`}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.flag} {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vətəndaşlıq"
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
                  />
                )}
                value={
                  countries.find((country) => country.code === field.value) ||
                  null
                }
                onChange={(_, value) => field.onChange(value ? value.code : "")}
              />
            )}
          />

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

          <span className={styles.errorMsg}>{message}</span>
          <div className={styles.button}>
            <Button variant="outlined" disabled>
              Geri
            </Button>
            <Button variant="contained" type="submit">
              İrəli
            </Button>
          </div>
        </form>
      </div>

      {/* Second */}
      <div
        className={styles.second}
        style={next == true ? {} : { display: "none" }}
      >
        <div>
          Soyad
          <p>{data?.data.surname}</p>
        </div>
        <div>
          Ad
          <p>{data?.data.name}</p>
        </div>
        <div>
          Ata adı
          <p>{data?.data.fatherName}</p>
        </div>
        <div>
          Doğum tarixi
          <p>{dayjs(data?.data.birthDate).format("DD.MM.YYYY")}</p>
        </div>
        <div>
          FİN-i
          <p>{data?.data.pin}</p>
        </div>
      </div>

      {/* Final */}
      <div
        className={styles.final}
        style={next == false ? {} : { display: "none" }}
      >
        <div>
          <FaCheck size={120} style={{ color: "#1647a3" }} />
          <p>
            Sizin artıq <span>{final?.data.gooen}</span> nömrəli GÖÖEN var
          </p>
          <button onClick={() => reactToPrintFn()}>Çap</button>
        </div>
      </div>

      {/* Buttons */}
      <div
        className={styles.button}
        style={next != null && next != false ? {} : { display: "none" }}
      >
        <Button variant="contained" onClick={() => setNext(null)}>
          Geri
        </Button>
        <Button variant="contained" onClick={onFinal}>
          İrəli
        </Button>
      </div>

      {/* Print */}
      <div style={{ display: "none" }}>
        <div ref={contentRef} className={styles.print}>
          <h6>Azərbaycan Respublikası Dövlət Gömrük Komitəsi</h6>
          <div>
            <p>
              <span>Soyad:</span>
              <span>Ad:</span>
              <span>Ata adı:</span>
              <span>GÖÖEN:</span>
            </p>
            <p>
              <span>{data?.data.surname}</span>
              <span>{data?.data.name}</span>
              <span>{data?.data.fatherName}</span>
              <span style={{ color: "#f12b2c" }}>{final?.data.gooen}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gooen;
