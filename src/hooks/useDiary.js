import { useContext, useEffect, useState, useRef } from "react";
import { DiaryStateContext } from "../contexts/DiaryContext";
import { useNavigate } from "react-router";

const useDiary = (id) => {
  const data = useContext(DiaryStateContext);
  const [diary, setDiary] = useState();
  const navigate = useNavigate();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    const matchDiary = data.find((it) => String(it.id) === String(id));
    setDiary(matchDiary);
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      if (!matchDiary) {
        alert("일기가 존재하지 않습니다");
        navigate("/", { replace: true });
      }
    }
  }, [data, id, navigate]);
  return diary;
};
export default useDiary;
