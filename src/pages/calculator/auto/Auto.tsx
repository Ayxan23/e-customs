import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import { Dayjs } from "dayjs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const carTypes = [{ code: "0", label: "Minik-avtomobili" }];
const fuelTypes = [
  { code: "0", label: "Benzin" },
  { code: "1", label: "Dizel" },
  { code: "2", label: "Qaz" },
  { code: "3", label: "Hibrid-benzin" },
  { code: "4", label: "Hibrid-dizel" },
  { code: "5", label: "Elektrik" },
];

type FormValues = {
  carType: string | null;
  fuelType: string | null;
  num1: string;
  num2: string;
  num3: string;
  num4: string;
  birthDate: Dayjs | null;
  originCountry: "free" | "nonFree";
};

type Duty = {
  code: string;
  name: string;
  value: number;
};

type Total = {
  code: string;
  name: string;
  value: number;
};

type AutoDuty = {
  duties: Duty[];
  total: Total;
  customsCost: number;
};

type Data = {
  usdCourseString: string;
  usdCourse: number;
  autoDuty: AutoDuty;
};

type ApiResponse = {
  code: number;
  data: Data;
  exception: string | null;
};

const Auto: React.FC = () => {
  const [data, setData] = useState<ApiResponse>();
  const [info, setInfo] = useState<{ time: string; price: string }>();
  console.log(data);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      carType: null,
      fuelType: null,
      birthDate: null,
      num1: "",
      num2: "",
      num3: "",
      num4: "",
      originCountry: "nonFree",
    },
  });

  useEffect(() => {
    const url = "/api/v1/dictionaries/calAutoDuty";
    const autoInfo = {
      autoType: "Car",
      commerceType: "Free",
      engine: 1300,
      engineType: "Petrol",
      issueDate: "01.04.2020",
      price: 0,
    };
    axios
      .post(url, autoInfo)
      .then((res) => setData(res.data))
      .catch((error) => console.error(error));
    setInfo({
      time: "",
      price: "0",
    });
  }, []);

  const onSubmit = async (data: FormValues) => {
    const url = "/api/v1/dictionaries/calAutoDuty";
    try {
      const autoInfo = {
        autoType: data.carType,
        commerceType: data.originCountry,
        engine: data.num4,
        engineType: data.fuelType,
        issueDate:
          data.birthDate != null
            ? data.birthDate.format("DD.MM.YYYY")
            : data.birthDate,
        otherExpenses: data.num3,
        price: data.num1,
        transportExpenses: data.num2,
      };
      const response = await axios.post(url, autoInfo);
      if (data.birthDate != null && data.num1 != null) {
        setInfo({
          time: data.birthDate.format("DD.MM.YYYY"),

          price: data.num1,
        });
      }
      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cart}>
        <h3>Nəqliyyat vasitəsinin məlumatları</h3>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            name="carType"
            control={control}
            rules={{ required: "Mütləq daxil edilməlidir" }}
            render={({ field }) => (
              <Autocomplete
                options={carTypes}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nəqliyyat vasitəsinin növü"
                    error={!!errors.carType}
                    helperText={errors.carType?.message}
                  />
                )}
                value={carTypes.find((car) => car.code === field.value) || null}
                onChange={(_, value) => field.onChange(value ? value.code : "")}
              />
            )}
          />
          <Controller
            name="fuelType"
            control={control}
            rules={{ required: "Mütləq daxil edilməlidir" }}
            render={({ field }) => (
              <Autocomplete
                options={fuelTypes}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mühərrikin növü"
                    error={!!errors.fuelType}
                    helperText={errors.fuelType?.message}
                  />
                )}
                value={
                  fuelTypes.find((fuel) => fuel.code === field.value) || null
                }
                onChange={(_, value) => field.onChange(value ? value.code : "")}
              />
            )}
          />
          <div className={styles.numInput}>
            {/* number Input */}
            <Controller
              name="num1"
              control={control}
              rules={{
                required: "Mütləq daxil edilməlidir",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ width: "100%" }}
                  type="number"
                  label="İnvoys dəyəri (USD)"
                  error={!!errors.num1}
                  helperText={errors.num1?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("num1");
                  }}
                />
              )}
            />

            <Controller
              name="num2"
              control={control}
              rules={{
                required: "Mütləq daxil edilməlidir",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ width: "100%" }}
                  type="number"
                  label="Nəqliyyat xərci (USD)"
                  error={!!errors.num2}
                  helperText={errors.num2?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("num2");
                  }}
                />
              )}
            />
          </div>
          <div className={styles.numInput}>
            <Controller
              name="num3"
              control={control}
              rules={{
                required: "Mütləq daxil edilməlidir",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ width: "100%" }}
                  type="number"
                  label="Digər xərclər (USD)"
                  error={!!errors.num3}
                  helperText={errors.num3?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("num3");
                  }}
                />
              )}
            />

            <Controller
              name="num4"
              control={control}
              rules={{
                required: "Mütləq daxil edilməlidir",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ width: "100%" }}
                  type="number"
                  label="Mühərrikin həcmi (sm3)"
                  error={!!errors.num4}
                  helperText={errors.num4?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("num4");
                  }}
                />
              )}
            />
          </div>
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
                  label="İstehsal tarixi"
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
          {/* Radio */}
          <Controller
            name="originCountry"
            control={control}
            rules={{ required: "Məcburi sahədir" }}
            render={({ field }) => (
              <FormControl error={!!errors.originCountry}>
                <FormLabel id="origin-country-label">
                  Mənşə (istehsal) ölkəsi və göndərən ölkə haqqında
                </FormLabel>
                <RadioGroup
                  {...field}
                  aria-labelledby="origin-country-label"
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("originCountry");
                  }}
                >
                  <FormControlLabel
                    value="nonFree"
                    control={<Radio />}
                    label="Digər ölkələr"
                  />
                  <FormControlLabel
                    value="free"
                    control={<Radio />}
                    label="Azad ticarət sazişi bağlanan ölkədə istehsal olunub və oradan gətirilir"
                  />
                </RadioGroup>
                {errors.originCountry && (
                  <span>{errors.originCountry.message}</span>
                )}
              </FormControl>
            )}
          />

          <div className={styles.button}>
            <Button
              variant="contained"
              type="submit"
              style={{ background: "#1647a3" }}
            >
              Hesabla
            </Button>
            <Button
              onClick={() => reset()}
              variant="outlined"
              style={{ color: "#1647a3", borderColor: "#1647a3" }}
            >
              Təmizlə
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className={styles.info}>
          <span>
            <IoIosInformationCircleOutline size={22} />
          </span>
          <div>
            <p>
              Malların gömrük dəyəri{" "}
              <a
                href="https://customs.gov.az/uploads/payment/1/ca57a4eb1883c0d465afb0b832e8c071.pdf?v=1640724100"
                target="_blank"
              >
                “Gömrük tarifi haqqında”
              </a>{" "}
              Azərbaycan Respublikasının qanunu və{" "}
              <a
                href="https://customs.gov.az/uploads/payment/13/ed4ec77148167c793ac6a60ba6f7c7dc.pdf?v=1699363188"
                target="_blank"
              >
                “Gömrük dəyərinin müəyyən edilməsinin vahid metodikası”
              </a>{" "}
              əsasında müəyyən edilir.
            </p>
          </div>
        </div>

        <div className={styles.apiInfo}>
          <IoIosSettings size={30} />
          API təqdim olunur.
          <a href="https://e.customs.gov.az/open-data/1" target="_blank">
            Ətraflı
          </a>
        </div>
      </div>

      <div className={styles.cart} style={!data ? { display: "none" } : {}}>
        <h3>Nəticə</h3>
        <div className={styles.result}>
          {data?.data.autoDuty.duties.map((node, i) => (
            <div key={i}>
              <p>
                <span></span>
                {node.name}
              </p>
              <p className={styles.price}>{node.value} AZN</p>
            </div>
          ))}
        </div>
        <p className={styles.usd}>USD = 1.7 AZN</p>

        <div className={styles.total}>
          <div>
            Cəmi gömrük ödənişləri:{" "}
            <span> {data?.data.autoDuty.total.value} AZN</span>
          </div>
          <p
            className={styles.totalP}
            style={info?.price == "0" ? { display: "none" } : {}}
          >
            Minik-avtomobili, {info?.time}, {info?.price}$
          </p>
          <h6>
            Gömrük dəyəri = {data?.data.autoDuty.customsCost} AZN *
            <span>
              * Gömrük dəyəri = (İnvoys dəyəri +Nəqliyyat xərci + Digər xərclər)
              * USD kursu
            </span>
          </h6>
          <p className={styles.totalInfo}>
            Hesablama qaydası və digər məlumatları almaq üçün{" "}
            <a
              href="https://customs.gov.az/az/ferdler-ucun/avtomobillerin-getirilmesi"
              target="_blank"
            >
              keçid edin...
            </a>
          </p>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <span>
            <IoIosInformationCircleOutline size={22} />
          </span>
          <div>
            <p>
              Diqqət! Gömrük ödənişləri daxil edilmiş məlumatlar əsasında
              hesablanmışdır. Gömrük rəsmiləşdirilməsi zamanı malların gömrük
              dəyərinin müəyyənləşdirilməsi üsulundan asılı olaraq cəmi gömrük
              ödənişlərində fərqlər yarana bilər.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auto;
