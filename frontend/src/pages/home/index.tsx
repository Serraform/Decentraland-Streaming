import Streams from "components/streams";
import Assets from "components/assets";
import UploaderProgress from "components/uploader-progress";
import { useReducer } from "react";
type LIST_TYPE = "streams" | "assets";  
const Home = () => {
  const [list, setList] = useReducer(
    (prev: any, next: any) => {
      const newEvent = { ...prev, ...next };
      return newEvent;
    },
    {
      type: "streams" as LIST_TYPE,
    }
  );

  const handleChangeType = (event: any) => {
    setList({ [event.target.name]: event.target.value });
  };
  return (
    <>
      <div className="container pt-10 flex flex-row justify-end">
        <form>
          <label className="mr-2 font-montserratregular text-black  dark:text-white ">
            <input
              type="radio"
              className="mr-1"
              name="type"
              value="streams"
              checked={list.type === "streams"}
              onClick={(e) => handleChangeType(e)}
            />
            Streams
          </label>
          <label className="ml-2 font-montserratregular text-black  dark:text-white ">
            <input
              type="radio"
              className="mr-1"
              name="type"
              value="assets"
              checked={list.type === "assets"}
              onClick={(e) => handleChangeType(e)}
            />
            Assets
          </label>
        </form>
      </div>
      {list.type === "streams" ? <Streams /> : <Assets />}
      <UploaderProgress />
    </>
  );
};

export default Home;
