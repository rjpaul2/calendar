import "./styles.css";
import Row from "./Row";
import Header from "./Header";
import CanvasProvider from "./Canvas";
import Select from "./Select";
export default function App() {
  var data = [
    new Date(),
    new Date(2021, 7, 21, 12, 30),
    new Date(2021, 7, 3, 5, 30),
    new Date(2021, 7, 3, 6, 45),
    new Date(2021, 8, 3, 6, 45),
    new Date(2021, 8, 17, 10, 45),
    new Date(2021, 8, 17, 6, 45),
    new Date(2021, 8, 18, 0, 0)
  ];
  return (
    <div className="App">
      <CanvasProvider>
        <Select />
        <Header />
        <Row data={data} />
      </CanvasProvider>
    </div>
  );
}
