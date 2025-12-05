import Header from "../components/Header";
import Button from "../components/Button";
import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../contexts/DiaryContext";
import { getMonthRangeByDate, setPageTitle } from "../util";
import DiaryList from "../components/DiaryList";

const Home = () => {
  const data = useContext(DiaryStateContext);
  const [pivoteDate, setPivotDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const headerTitle = `${pivoteDate.getFullYear()}년 ${
    pivoteDate.getMonth() + 1
  }월`;

  useEffect(() => {
    setPageTitle("한영진의 감정 일기장");
  }, []);

  useEffect(() => {
    if (data.length >= 1) {
      const { beginTimeStamp, endTimeStamp } = getMonthRangeByDate(pivoteDate);
      setFilteredData(
        data.filter(
          (it) => beginTimeStamp <= it.date && it.date <= endTimeStamp
        )
      );
    } else {
      setFilteredData([]);
    }
  }, [data, pivoteDate]);

  const onIncreaseMonth = () =>
    setPivotDate(new Date(pivoteDate.getFullYear(), pivoteDate.getMonth() + 1));

  const onDecreaseMonth = () =>
    setPivotDate(new Date(pivoteDate.getFullYear(), pivoteDate.getMonth() - 1));

  return (
    <div>
      <Header
        title={headerTitle}
        leftChild={<Button text={"<"} onClick={onDecreaseMonth} />}
        rightChild={<Button text={">"} onClick={onIncreaseMonth} />}
      />
      <DiaryList data={filteredData} />
    </div>
  );
};

export default Home;
