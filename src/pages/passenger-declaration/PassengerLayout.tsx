import { Outlet } from "react-router-dom";

const PassengerLayout = () => {
  return (
    <section className="container">
      <div className="title">
        <h2>Sərnişinlər üçün sadələşdirilmiş bəyannamə</h2>
        <p>
          <a href="https://e.customs.gov.az/for-individuals" target="_blank">
            Fiziki şəxslər üçün
          </a>
          <span>/</span>
          Sərnişinlər üçün sadələşdirilmiş bəyannamə
        </p>
      </div>

      <Outlet />
    </section>
  );
};

export default PassengerLayout;
