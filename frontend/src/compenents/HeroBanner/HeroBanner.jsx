import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./HeroBanner.css";

// 4 banner slides ka data
const slides = [
  {
    img: "/banner1.png",
    title: "LINEN EDIT",
    subtitle: "Soft on skin. Sharp on style.",
  },
  {
    img: "/banner2.png",
    title: "SUMMER SHIRTS",
    subtitle: "Starting at ₹899",
  },
  {
    img: "/banner3.png",
    title: "MOBILE SPECIAL",
    subtitle: "Exclusive mobile deals",
  },
  {
    img: "/banner4.png",
    title: "FULL DESKTOP",
    subtitle: "Complete collection view",
  },
];

const HeroBanner = () => {
  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={true}
        loopedSlides={4}
        speed={7000}
        grabCursor={true}
        centeredSlides={true}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          640: {
            slidesPerView: 1.15,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1.3,
            spaceBetween: 12,
          },
          // Desktop: 3 full equal images, no centering offset
          1024: {
            slidesPerView: 2.45,
            spaceBetween: 10,
            centeredSlides: false,
          },
        }}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Har slide ek tall image card hai */}
            <div className="relative overflow-hidden hero-slide h-180 ">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover "
              />
              {/* Text overlay — image ke niche darkening gradient ke saath */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-6 right-6">
                <h2 className="text-white text-2xl font-bold tracking-wide uppercase">
                  {slide.title}
                </h2>
                <p className="text-white/80 text-sm mt-1">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;
