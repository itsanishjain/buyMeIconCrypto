import { Navbar, Welcome, Footer, Services, Transactions } from "./components";

const App = () => (
  <div className="min-h-screen">
    <h2 className="text-2xl text-center text-blue-900">Need to install ICONex or Hana  wallet to use this App</h2>
    <div className="gradient-bg-welcome">

      <Navbar />
      <Welcome />
    </div>
    <Services />
    {/* <Transactions /> */}
    <Footer />
  </div>
);

export default App;
