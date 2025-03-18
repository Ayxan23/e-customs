import React, { useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import { Dayjs } from "dayjs";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import Third from "./third/Third";
import Level from "./level/Level";
import Final from "./final/Final";
const countries = [
  { code: "031", label: "Azerbaijan", flag: "🇦🇿" },
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "DE", label: "Germany", flag: "🇩🇪" },
  { code: "FR", label: "France", flag: "🇫🇷" },
];

type FormValues = {
  nationality: string;
  fin: string;
  phone?: string;
  fin2?: string;
  birthDate: Dayjs | null;
  originCountry: "true" | "false";
};
type SecondValues = {
  phone?: string;
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

const Add: React.FC = () => {
  const [next, setNext] = useState<string>("1");
  const [data, setData] = useState<ApiResponse>();

  const [message, setMessage] = useState("");

  const [data2, setData2] = useState<string>("");

  const [isFirstOption, setIsFirstOption] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      nationality: "031",
      fin: "",
      fin2: "",
      birthDate: null,
      originCountry: "true",
    },
  });

  const {
    control: control2,
    handleSubmit: handleSubmit2,
    trigger: trigger2,
  } = useForm<SecondValues>({
    shouldFocusError: false,
    defaultValues: {
      phone: "",
    },
  });
  const onSecond = (data: SecondValues) => {
    if (data.phone != undefined) {
      setData2(data.phone);
    }
    setNext("3");
    console.log(data2);
  };

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const date =
      data.birthDate != null
        ? data.birthDate.format("YYYY-MM-DD")
        : data.birthDate;
    const url = `/api/v1/passenger-declaration/passenger?citizenship=${
      data.nationality
    }&isAdult=${data.originCountry}&passportNo=${data.fin}&birthDate=${date}${
      data.originCountry == "false" ? `&declarantDocNo=${data.fin2}` : ""
    }`;
    try {
      const response = await axios.get(url);
      setNext("2");
      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
      setMessage(
        "Daxil etdiyiniz FİN-koda və ya doğum tarixinə uyğun heç bir məlumat tapılmadı"
      );
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div>
      <Level next={next} />

      {/* Form */}
      <div
        className={styles.first}
        style={next == "1" ? {} : { display: "none" }}
      >
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Radio */}
            <Controller
              name="originCountry"
              control={control}
              rules={{ required: "Məcburi sahədir" }}
              render={({ field }) => (
                <FormControl error={!!errors.originCountry}>
                  <FormLabel id="origin-country-label">
                    Kimə məxsus malları bəyan edirsiniz?
                  </FormLabel>
                  <RadioGroup
                    {...field}
                    aria-labelledby="origin-country-label"
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("originCountry");
                      setIsFirstOption(e.target.value === "false");
                    }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Mənə məxsus"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="18 yaşına çatmamış şəxsə məxsus"
                    />
                  </RadioGroup>
                  {errors.originCountry && (
                    <span>{errors.originCountry.message}</span>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="nationality"
              control={control}
              rules={{ required: "Mütləq daxil edilməlidir" }}
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
                  onChange={(_, value) =>
                    field.onChange(value ? value.code : "")
                  }
                />
              )}
            />

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

            {/* FIN Input */}
            {isFirstOption && (
              <Controller
                name="fin2"
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
                    label="Bəyan edən şəxsin pasport nömrəsi (və ya FİN)"
                    error={!!errors.fin2}
                    helperText={errors.fin2?.message}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("fin2");
                    }}
                  />
                )}
              />
            )}
            <span className={styles.errorMsg}>{message}</span>
            <div className={styles.button}>
              {/* <Button variant="outlined" disabled>
               Geri
             </Button> */}
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#1647a3" }}
              >
                İrəli
              </Button>
            </div>
          </form>
        </div>

        <div className={styles.formInfo}>
          <h5>Məlumat</h5>
          <div></div>
          <span>Hörmətli istifadəçi!</span>
          <p>
            Bu elektron xidmətdən istifadə edərək gömrük sərhədindən
            keçirəcəyiniz mal, valyuta və ya nəqliyyat vasitələrini bəyan edin.
            Bəyannaməni təqdim etdikdən sonra onu çap edib və ya QR kodunu
            yükləyib gömrük əməkdaşına təqdim edin. Gömrük sərhədindən
            keçirəcəyiniz mal sizə aiddirsə, <span>“Mənə məxsus”</span> sahəsini
            seçin və şəxsi məlumatlarınızı daxil edin. Əgər yetkinlik yaşına
            çatmayan şəxsə məxsus mal bəyan edirsinizsə,{" "}
            <span>“18 yaşına çatmamış şəxsə məxsus”</span> sahəsini seçin, həmin
            şəxsin məlumatlarını və{" "}
            <span>“Bəyan edən şəxsin xarici pasport nömrəsi(və ya FİN)”</span>{" "}
            sahəsinə isə öz pasport nömrənizi daxil edin.
          </p>
        </div>
      </div>

      {/* Second */}
      <div
        className={styles.secondWrapper}
        style={next == "2" ? {} : { display: "none" }}
      >
        <div className={styles.second}>
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
            FİN-i
            <p>{data?.data.pin}</p>
          </div>

          <form onSubmit={handleSubmit2(onSecond)}>
            <Controller
              name="phone"
              control={control2}
              rules={{ required: "Telefon nömrəsi tələb olunur" }}
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
                      ref: field.ref,
                      name: "phone",
                      required: true,
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger2("phone");
                    }}
                  />
                  {fieldState.error && (
                    <span style={{ color: "#d32f2f", fontSize: "12px" }}>
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
            <div className={styles.button}>
              <Button
                variant="outlined"
                onClick={() => setNext("1")}
                style={{ color: "#1647a3", borderColor: "#1647a3" }}
              >
                Geri
              </Button>
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#1647a3" }}
              >
                İrəli
              </Button>
            </div>
          </form>
        </div>

        <div className={styles.formInfo}>
          <h5>Məlumat</h5>
          <div></div>
          <span>Hörmətli istifadəçi!</span>
          <p>
            Şəxsi məlumatlarınızı daxil edin. Əgər məlumatlar sistem tərəfindən
            avtomatik doldurulsa, onların doğru olduğundan əmin olun.
            <br />
            Telefon nömrəsini düzgün daxil etdiyinizdən əmin olun. Ehtiyac
            olduğu təqdirdə qeyd olunan nömrəyə SMS məlumatlar göndəriləcək
          </p>
        </div>
      </div>

      <div style={next == "3" ? {} : { display: "none" }}>
        <Third setNext={setNext} />
      </div>
      <div style={next == "4" ? {} : { display: "none" }}>
        <Final />
      </div>
    </div>
  );
};

export default Add;
