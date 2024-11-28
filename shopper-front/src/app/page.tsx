import HomeSection from "./components/homeSection/HomeSection";
import LoginForm from "./components/login/LoginForm";

export default function Home() {
  return (
    <main className="loginPage container">
      <HomeSection />
      <LoginForm />
    </main>
  );
}
