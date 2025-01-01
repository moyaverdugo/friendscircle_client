import {BrowserRouter, Routes, Route} from "react-router-dom";
import AuthFailPage from "./pages/AuthFailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PostPage from "./pages/PostPage.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<HomePage/>}></Route>
                <Route path="/auth-fail" element={<AuthFailPage/>}></Route>
                <Route path="/profile/:userid" element={<ProfilePage/>}></Route>
                <Route path="/post/:userid" element={<PostPage/>}></Route>
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

export default App
