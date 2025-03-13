import { Link, Outlet } from "react-router-dom";
import styles from "./styles.module.css";

import { Tabs, Tab, Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useState } from "react";

const CalculatorLayout = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <section className="container">
      <div className="title">
        <h2>Gömrük ödənişlərini özün hesabla</h2>
        <p>
          <a href="https://e.customs.gov.az/for-individuals" target="_blank">
            Fiziki şəxslər üçün
          </a>
          <span>/</span>
          Gömrük ödənişlərini özün hesabla
        </p>
      </div>
      <div className={styles.nav}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="navigation tabs"
            textColor="primary"
            indicatorColor="primary"
            selectionFollowsFocus
          >
            <Tab
              className={styles.text}
              icon={<DirectionsCarIcon />}
              label="Nəqliyyat vasitələri"
              iconPosition="start"
              component={Link}
              to="/calculator/auto"
            />
            <Tab
              className={styles.text}
              icon={<InventoryIcon />}
              label="Digər mallar"
              iconPosition="start"
              component={Link}
              to="/calculator/goods"
            />
          </Tabs>
        </Box>
      </div>
      <Outlet />
    </section>
  );
};

export default CalculatorLayout;
