import { Outlet } from "react-router-dom";
import Title from "../../components/ui/title/Title";
const PassengerLayout = () => {
  return (
    <section className="container">
      <Title
        title="Sərnişinlər üçün sadələşdirilmiş bəyannamə"
        linkTitle="Fiziki şəxslər üçün"
        url="https://e.customs.gov.az/for-individuals"
      />

      <Outlet />
    </section>
  );
};

export default PassengerLayout;
