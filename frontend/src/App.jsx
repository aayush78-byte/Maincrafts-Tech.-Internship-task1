import ItemList from "./components/ItemList.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header>
        <h1>MERN Stack — Task 1</h1>
        <p>React frontend fetching data from an Express + MongoDB API</p>
      </header>
      <main>
        <ItemList />
      </main>
    </div>
  );
}

export default App;
