import { Route, Routes } from "react-router-dom";
import { Dashboard, Redirect, Send, Signin, Signup } from "./pages/index.pages";

function App() {
  return (
    <div className=" min-h-screen w-full bg-stone-900 text-white">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <Redirect>
              <Dashboard />
            </Redirect>
          }
        />
        <Route
          path="/send"
          element={
            <Redirect>
              <Send />
            </Redirect>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
