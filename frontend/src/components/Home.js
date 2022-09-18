import Tripwindow from "./home/Tripwindow";
import Placewindow from "./home/Placewindow";
import Carouselmain from "./home/Carouselmain";
import Searchbar from "./home/Searchbar";
import Info from "./home/Info";


const Home = () => {


  return (
    <div>
      <Carouselmain />
      <Searchbar />
      <Info/>
      <Tripwindow />
      <Placewindow />
    </div>
  );
};

export default Home;
