import { useNavigate, useParams } from "react-router";
import { getFormattedDate, setPageTitle } from "../util";
import { useEffect } from "react";
import useDiary from "../hooks/useDiary";
import Header from "../components/Header";
import Button from "../components/Button";
import Viewer from "../components/Viewer";

const Diary = () => {
  const { id } = useParams();
  const data = useDiary(id);
  console.log(data);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const goEdit = () => navigate(`/edit/${id}`);

  useEffect(() => {
    setPageTitle(`${id}번 일기`);
  }, [id]);

  if (!data) return <div>일기를 불러오고 있습니다...</div>;
  else {
    const { date, emotionId, content } = data;
    const title = `${getFormattedDate(new Date(Number(date)))}`;
    return (
      <div>
        <Header
          title={title}
          leftChild={<Button text={"< 뒤로 가기"} onClick={goBack} />}
          rightChild={<Button text={"수정하기"} onClick={goEdit} />}
        />
        <div>{id}번 일기</div>
        <div>Diary 페이지입니다</div>
        <Viewer content={content} emotionId={emotionId} />
      </div>
    );
  }
};

export default Diary;
