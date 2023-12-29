import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  CreateAccount,
  Login,
  Home,
  Profile,
  Layout,
  ProtectedRoute,
} from "./routes";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Loading from "./components/common/Loading";
import { styled } from "styled-components";
import { RecoilRoot } from "recoil";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <RecoilRoot>
      <Wrapper>
        {isLoading ? <Loading /> : <RouterProvider router={router} />}
      </Wrapper>
    </RecoilRoot>
  );
}

export default App;
