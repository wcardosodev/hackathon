import MyComponent from './whatever';
// import Header from './header';

const App = () => {
  return (
    <div className="App">
      {/* <Header /> */}
      <header className="App-header">
        <h1>#Team Fuzz Hackathon Stuff :D</h1>
      </header>
      <div className="body">
        <MyComponent />
      </div>
    </div>
  );
};

export default App;
