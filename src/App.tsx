import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CreateAccount, Login, Layout, ProtectedRoute } from "./routes";
import { Suspense, lazy, useEffect, useState } from "react";
import { auth } from "./firebase";
import Loading from "./components/common/Loading";
import { styled } from "styled-components";
import { RecoilRoot } from "recoil";

const Home = lazy(() => import("./routes/Home"));
const Profile = lazy(() => import("./routes/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
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
