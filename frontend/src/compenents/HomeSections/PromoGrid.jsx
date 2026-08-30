// Promo cards data — marketing/offer content, hardcoded
// Image layout: first 2 = desktop, 3rd = mobile, 4th = mobile scrollable, 5th = desktop layout, last = full desktop section
const promoCards = [
  {
    img: "/promo1.png",
    label: "BUY 2 @",
    price: "1999",
    tag: "TOP WEAR",
  },
  {
    img: "/promo2.png",
    label: "BUY 2 @",
    price: "1999",
    tag: "BOTTOM WEAR",
  },
  {
    img: "/promo3.png",
    label: "Sunglasses",
    price: "₹999",
    tag: "Per",
  },
  {
    img: null,             // Last card — full desktop version, SALE text only, no image (different section)
    label: null,
    price: "SALE",
    tag: null,
    isSale: true,
  },
];

const PromoGrid = () => {
  return (
    <section className=" px-4 sm:px-6 ">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full max-w-[832px] mx-auto">
        {promoCards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden aspect-square ${
              card.isSale
                ? "bg-white border border-black/10 flex items-center justify-center"
                : ""
            }`}
          >
            {card.isSale ? (
              <p className="text-5xl sm:text-6xl font-black text-orange-500 tracking-tight">
                SALE
              </p>
            ) : (
              <>
                <img
                  src={card.img}
                  alt={card.tag}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4">
                  <p className="text-black text-xs font-medium">
                    {card.label}
                  </p>
                  <p className="text-black text-2xl font-black leading-none">
                    {card.price}
                  </p>
                  <p className="text-black text-xs font-medium uppercase mt-0.5">
                    {card.tag}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
export default PromoGrid;