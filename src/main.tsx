// 12-may-2025
// import React from "react";
// import { StrictMode } from "react";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(
//   // <StrictMode>
//   //   <App />
//   // </StrictMode>,
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import App from "./App";
import "./index.css";
// import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <HashRouter> */}
        <App />
      {/* </HashRouter> */}
    </PersistGate>
  </Provider>
);
