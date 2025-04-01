import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import cardImg from "../../../../assets/img/card.webp"
import cashImg from "../../../../assets/img//cash.jpg"
import { useNavigate } from "react-router-dom";


const UserPayments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex">
      
      <div className="flex-1 p-8">
        <Typography variant="h3" className="mb-6 text-gray-800">
          Choose Payment Method
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cash Option */}
          <Card
            className="p-6 shadow-md hover:shadow-lg cursor-pointer transition-all"
            onClick={() => navigate("/cashpay")}
          >
            <CardBody className="flex flex-col items-center text-center">
              <img src={cashImg} alt="Cash" className="h-20 mb-4" />
              <Typography variant="h5" className="mb-2">Cash Payment</Typography>
              <Typography className="text-gray-600">Pay with cash at the time of delivery or service.</Typography>
            </CardBody>
          </Card>

          {/* Card Option */}
          <Card
            className="p-6 shadow-md hover:shadow-lg cursor-pointer transition-all"
            onClick={() => navigate("/cardpay")}
          >
            <CardBody className="flex flex-col items-center text-center">
              <img src={cardImg} alt="Card" className="h-20 mb-4" />
              <Typography variant="h5" className="mb-2">Card Payment</Typography>
              <Typography className="text-gray-600">Pay online securely with your credit or debit card.</Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPayments;
