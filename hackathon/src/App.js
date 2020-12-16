import MyComponent from './whatever';
import Header from './Header';

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="body">
        <MyComponent />
      </div>
    </div>
  );
};

export default App;
