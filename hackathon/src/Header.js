import React from 'react';

const Header = () => {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="middle" href="https://statsbomb.com">
            <img
              src="https://statsbomb.com/wp-content/themes/statsbomb-2019/images/statsbomb-logo-white.svg"
              alt="Statsbomb"
              width="224"
              height="56"
            />
          </a>
        </div>
      </nav>

      <header className="App-header">
        <h1 className="title margin-top-lg has-text-centered">
          #Team Fuzz Hackathon Stuff :D
        </h1>
      </header>
    </>
  );
};

export default Header;
