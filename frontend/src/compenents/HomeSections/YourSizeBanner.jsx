import banner from "/Shop_your_size.jpg";

const YourSizeBanner = () => {
  return (
    <section className="w-full py-4 sm:py-8 md:py-10">
      <div className="max-w-[1440px] mx-auto px-0 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs xs:text-sm sm:text-[15px] md:text-base font-extrabold uppercase tracking-widest text-black mb-3 sm:mb-6 px-4">
          Shop Your Size
        </h2>

        <div className="w-full overflow-hidden bg-white">
          <img
            src={banner}
            alt="Shop Your Size Banner"
            className="w-full h-auto block object-cover sm:object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default YourSizeBanner;