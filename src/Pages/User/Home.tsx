import { FC } from "react";
import Navbar from "../../Components/Navbar";
import Card from "../../Components/Card";

const Home: FC = () => {
  const cardsData = [
    {
      image: "https://via.placeholder.com/400x300",
      title: "Card 1",
      description: "This is the description for card 1."
    },
    {
      image: "https://via.placeholder.com/400x300",
      title: "Card 2",
      description: "This is the description for card 2."
    },
    {
      image: "https://via.placeholder.com/400x300",
      title: "Card 3",
      description: "This is the description for card 3."
    },
  ];

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              image={card.image}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
