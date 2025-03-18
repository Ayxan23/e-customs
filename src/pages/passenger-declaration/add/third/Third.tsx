import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

type FormValues = {
  nationality: string;
  typeCustom: string;
  originCountry: "true" | "false";
};

type TransportType = {
  id: string;
  code: string | null;
  name: string;
  abbreviation2: string | null;
  abbreviation3: string | null;
  content: string | null;
  amount: number | null;
};

type CountryType = {
  id: string;
  code: string;
  name: string;
  abbreviation2: string | null;
  abbreviation3: string | null;
  content: string | null;
  amount: number | null;
};

interface ThirdProps {
  setNext: React.Dispatch<React.SetStateAction<string>>;
}

const Third: React.FC<ThirdProps> = ({ setNext }) => {
  const [countries, setCountries] = useState<CountryType[] | null>(null);
  const [transport, setTransport] = useState<TransportType[] | null>(null);

  useEffect(() => {
    const url = "/api/v1/dictionaries/list";
    axios
      .post(url, { dictionaryType: ["transportTypes", "countries"] })
      .then((res) => {
        setCountries(res.data.data.Countries);
        setTransport(res.data.data.TransportTypes);
      });
  }, []);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      nationality: "031",
      originCountry: "true",
      typeCustom: "2",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    setNext("4");
  };

  return (
    <div className={styles.thirdWrapper}>
      <div className={styles.third}>
        {" "}
        {/* Form */}
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Radio */}
            <Controller
              name="originCountry"
              control={control}
              rules={{ required: "Məcburi sahədir" }}
              render={({ field }) => (
                <FormControl error={!!errors.originCountry}>
                  <RadioGroup
                    {...field}
                    aria-labelledby="origin-country-label"
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("originCountry");
                    }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Ölkəyə Giriş"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="Ölkədən Çıxış"
                    />
                  </RadioGroup>
                  {errors.originCountry && (
                    <span>{errors.originCountry.message}</span>
                  )}
                </FormControl>
              )}
            />

            {countries != null && (
              <Controller
                name="nationality"
                control={control}
                rules={{ required: "Mütləq daxil edilməlidir" }}
                render={({ field }) => (
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li {...props} key={option.code}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Gəldiyiniz ölkəni seçin"
                        error={!!errors.nationality}
                        helperText={errors.nationality?.message}
                      />
                    )}
                    value={
                      countries.find(
                        (country) => country.code === field.value
                      ) || null
                    }
                    onChange={(_, value) =>
                      field.onChange(value ? value.code : "")
                    }
                  />
                )}
              />
            )}

            <Controller
              name="typeCustom"
              control={control}
              rules={{ required: "Məcburi sahədir" }}
              render={({ field }) => (
                <FormControl error={!!errors.typeCustom}>
                  <FormLabel id="origin-country-label">
                    Sərhədkeçmə növü
                  </FormLabel>
                  <RadioGroup
                    {...field}
                    aria-labelledby="origin-country-label"
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("typeCustom");
                      // setIsFirstOption(e.target.value === "false");
                    }}
                  >
                    {transport != null
                      ? transport.map((item, i) => (
                          <FormControlLabel
                            key={i}
                            value={item.id}
                            control={<Radio />}
                            label={item.name}
                          />
                        ))
                      : ""}
                  </RadioGroup>
                  {errors.typeCustom && (
                    <span>{errors.typeCustom.message}</span>
                  )}
                </FormControl>
              )}
            />

            <div className={styles.button}>
              <Button
                variant="outlined"
                onClick={() => setNext("3")}
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
      </div>
      <div className={styles.formInfo}>
        <h5>Məlumat</h5>
        <div></div>
        <p>
          Müvafiq istiqaməti qeyd edin. Gəldiyiniz və ya getdiyiniz ölkəni qeyd
          edin. Bəyan etdiyiniz malların daşınması və ya səyahətiniz üçün
          istifadə etdiyiniz nəqliyyat vasitəsini seçin.
        </p>
      </div>
    </div>
  );
};

export default Third;
