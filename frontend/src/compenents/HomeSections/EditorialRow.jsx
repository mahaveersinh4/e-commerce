import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const editorialCards = [
  { img: "/ed1.png", title: "FORMAL", subtitle: "New" },
  { img: "/ed2.png", title: "STREET", subtitle: "Loved by everyone" },
  { img: "/ed3.png", title: "BASICS", subtitle: "Daily" },
  { img: "/ed4.png", title: "LUXURY", subtitle: "Curated" },
  { img: "/ed5.png", title: "TRAVEL", subtitle: "I have the world to go" },
  { img: "/banner1.png", title: "LINEN EDIT", subtitle: "Soft on skin" },
];

const EditorialRow = () => {
  return (
    <section className="py-10 justify-center flex">
      <Swiper
        loop={true}
        slidesPerView="auto"
        spaceBetween={8}
        className="px-4 sm:px-6 lg:px-0"
      >
        {editorialCards.map((card, index) => (
          <SwiperSlide
            key={index}
            className="
              !w-[9rem]
              !h-[12.5rem]

              sm:!w-[11rem]
              sm:!h-[15rem]

              lg:!w-[13rem]
              lg:!h-[18rem]
            "
          >
            <div
              className="
                relative
                overflow-hidden
                shrink-0

                w-[9rem]
                h-[12.5rem]

                sm:w-[11rem]
                sm:h-[15rem]

                lg:w-[13rem]
                lg:h-[18rem]
              "
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover block"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default EditorialRow;