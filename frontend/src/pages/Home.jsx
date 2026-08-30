import React from "react";
import Header from "../compenents/Header/Header.jsx";
import HeroBanner from "../compenents/HeroBanner/HeroBanner.jsx";
import FeaturedCategories from "../compenents/FeaturedCategories/FeaturedCategories.jsx";
import EditorialRow from "../compenents/HomeSections/EditorialRow.jsx";
import PromoGrid from "../compenents/HomeSections/PromoGrid.jsx";
import YourSizeBanner from "../compenents/HomeSections/YourSizeBanner.jsx";
import NewArrivalSection from "../compenents/NewAndPopularSection/NewArrivalSection.jsx";
import Footer from "../compenents/Footer/Footer.jsx";
import { useAuth } from "../hook/auth.hook.jsx";

const Home = () => {
  const { user, logoutHandle } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col ">

      {/* Header + Category Navbar */}
      <Header />
      <div className = "lg:mx-25 flex-1">
        {/* Hero Banner Slider */}
        <HeroBanner />

        {/* Featured Categories — DB se aate hain */}
        <FeaturedCategories />

        {/* Editorial Row — horizontal scroll on mobile */}
        <EditorialRow />

        {/* Promo Grid — 2x2 on mobile, 4-col on desktop */}
        <PromoGrid />

        {/* YourSizeBanner */}
        <YourSizeBanner />

        {/* NewArrival Section */}
        <NewArrivalSection/> 
      </div>      

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
