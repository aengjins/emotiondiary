import { useEffect, useReducer, useRef, useState } from "react";
import { Route, Routes } from "react-router";
import {
  DiaryDispatchContext,
  DiaryStateContext,
} from "./contexts/DiaryContext";
import { createClient } from "@supabase/supabase-js";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE": {
      const newState = [action.data, ...state];
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "UPDATE": {
      const newState = state.map((it) =>
        String(it.id) === String(action.data.id) ? { ...action.data } : it
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "DELETE": {
      const newState = state.filter(
        (it) => String(it.id) !== String(action.targetId)
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    default: {
      return state;
    }
  }
}

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  useEffect(() => {
    const rawData = localStorage.getItem("diary");
    if (!rawData) {
      setIsDataLoaded(true);
      return;
    }
    const localData = JSON.parse(rawData);
    localData.sort((a, b) => Number(b.id) - Number(a.id));
    idRef.current = localData[0].id + 1;
    dispatch({ type: "INIT", data: localData });
    setIsDataLoaded(true);
  }, []);

  const getDiary = async () => {
    const { data } = await supabase.from("diary").select();
    if (data) {
      const diary = data.map((it) => ({
        ...it,
        date: new Date(it.date).getTime(),
      }));
      dispatch({ type: "INIT", data: diary });
      setIsDataLoaded(true);
    }
  };
  useEffect(() => {
    getDiary();
  }, []);

  const createDiary = async (dispatch, action) => {
    const it = action.data;
    const { data, error } = await supabase
      .from("diary")
      .insert({
        date: new Date(it.date),
        content: it.content,
        emotionId: it.emotionId,
      })
      .select()
      .single();
    if (error) {
      it.id = data.id;
      dispatch(action);
    }
  };

  const onCreate = (date, content, emotionId) => {
    createDiary(dispatch, {
      type: "CREATE",
      data: {
        id: idRef.current,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
    idRef.current += 1;
  };

  const updateDiary = async (dispatch, action) => {
    const it = action.data;
    const { error } = await supabase
      .from("diary")
      .update([
        {
          ...it,
          date: new Date(it.date),
        },
      ])
      .eq("id", it.id);
    if (error) {
      dispatch(action);
    }
  };

  const onUpdate = (targetId, date, content, emotionId) => {
    updateDiary(dispatch, {
      type: "UPDATE",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
  };

  const deleteDiary = async (dispatch, action) => {
    const { error } = await supabase
      .from("diary")
      .delete()
      .eq("id", action.targetId);
    if (error) {
      dispatch(action);
    }
  };

  const onDelete = (targetId) => {
    deleteDiary(dispatch, {
      type: "DELETE",
      targetId,
    });
  };

  if (!isDataLoaded) {
    return <div>데이터를 불러오는 중입니다</div>;
  } else {
    return (
      <DiaryStateContext value={data}>
        <DiaryDispatchContext
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/diary/:id" element={<Diary />} />
              <Route path="/edit/:id" element={<Edit />} />
            </Routes>
          </div>
        </DiaryDispatchContext>
      </DiaryStateContext>
    );
  }
}

export default App;
