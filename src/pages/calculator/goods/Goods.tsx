import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { FormControlLabel, Checkbox } from "@mui/material";
import { FaList } from "react-icons/fa";
import Nomenc from "../../goods-nomenclature/nomenc/Nomenc";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const prosess = [
  { code: "1", label: "İdxal" },
  { code: "2", label: "İxrac" },
];

type FormValues = {
  num1: string;
  num2: string;
  num3: string;
  num4: string;
  mtiyaz: string | null;
  proses: string | null;
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
type Data = {
  duties: Duty[];
  total: Total;
  customsCost: number;
  usdCourse: number;
};
type ApiResponse = {
  code: number;
  data: Data;
  exception: string | null;
};
type Privilege = {
  id: number | null;
  code: string;
  name: string;
  abbreviation2: string | null;
  abbreviation3: string | null;
  content: string | null;
  amount: number | null;
};

const Goods: React.FC = () => {
  const [data, setData] = useState<ApiResponse>();
  const [list, setList] = useState<Privilege[] | null>(null);
  const [info, setInfo] = useState<{ time: string; price: string }>();

  const [close, setClose] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      proses: null,
      num1: "",
      num2: "",
      num3: "",
      num4: "",
    },
  });

  useEffect(() => {
    const url = "/api/v1/goods/duty-list";
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((error) => console.error(error));
    setInfo({
      time: "",
      price: "0",
    });

    const url2 = "/api/v1/dictionaries/list";
    axios
      .post(url2, { dictionaryType: ["Privilege"] })
      .then((res) => setList(res.data.data.Privilege));
  }, []);

  const onSubmit = async (data: FormValues) => {
    const url = "/api/v1/goods/calculate-duty";
    console.log(data);
    try {
      const declaration = {
        declarationMode: data.proses,
        dependedFields: [],
        hsCode: data.num4,
        invoice: data.num1,
        otherExpenses: data.num3,
        privilege: data.mtiyaz,
        transportExpenses: data.num2,
      };
      const response = await axios.post(url, declaration);
      setData(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setValue("mtiyaz", "210");
    } else {
      setValue("mtiyaz", "");
    }

    trigger("mtiyaz");
  };

  const handleProses = (some: string) => {
    setValue("num4", some);
    setClose(true)
    trigger("proses");
  
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tree} style={close ? { display: "none" } : {}}>
        <div>
          <span className={styles.close} onClick={() => setClose(true)}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
          <Nomenc onSelect={handleProses}/>
        </div>
      </div>

      <div className={styles.cart}>
        <h3>Mal barədə məlumat</h3>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.numInput}>
            {/* number Input */}
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
                  label="Malın XİF MN kodu"
                  error={!!errors.num4}
                  helperText={errors.num4?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("num4");
                  }}
                />
              )}
            />
            <div className={styles.treeButton} onClick={() => setClose(false)}>
              <FaList />
            </div>
          </div>
          <Controller
            name="proses"
            control={control}
            rules={{ required: "Mütləq daxil edilməlidir" }}
            render={({ field }) => (
              <Autocomplete
                options={prosess}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prosedur"
                    error={!!errors.proses}
                    helperText={errors.proses?.message}
                  />
                )}
                value={prosess.find((car) => car.code === field.value) || null}
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
          </div>
          <div className={styles.numInput}>
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
          </div>

          {list != null && (
            <Controller
              name="mtiyaz"
              control={control}
              rules={{ required: "Mütləq daxil edilməlidir" }}
              render={({ field }) => (
                <Autocomplete
                  options={list}
                  getOptionLabel={(option: Privilege) =>
                    `${option.code} | ${option.name}`
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.code}>
                      {option.code} | {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="İmtiyaz"
                      error={!!errors.mtiyaz}
                      helperText={errors.mtiyaz?.message}
                    />
                  )}
                  value={
                    list.find((car: Privilege) => car.code === field.value) ||
                    null
                  }
                  onChange={(_, value: Privilege | null) => {
                    field.onChange(value ? value.code : "");
                  }}
                />
              )}
            />
          )}

          <FormControlLabel
            control={<Checkbox onChange={handleCheckboxChange} />}
            label="Azad ticarət sazişi bağlanan ölkədə istehsal olunub və oradan gətirilir"
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
          {data?.data.duties.map((node, i) => (
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
            Cəmi gömrük ödənişləri: <span> {data?.data.total.value} AZN</span>
          </div>
          <p
            className={styles.totalP}
            style={info?.price == "0" ? { display: "none" } : {}}
          >
            Minik-avtomobili, {info?.time}, {info?.price}$
          </p>
          <h6>
            Gömrük dəyəri = {data?.data.customsCost} AZN *
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

export default Goods;
