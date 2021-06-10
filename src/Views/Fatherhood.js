import MainWrapper from '../Components/MainWrapper/MainWrapper';
import OrdersTable from '../Components/MainWrapper/OrdersTable';

const Fatherhood = () => {
  return (
    <MainWrapper>
      <OrdersTable tab="fatherhood" disableFilter />
    </MainWrapper>
  );
};

export default Fatherhood;
