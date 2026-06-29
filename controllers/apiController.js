import User from "../models/UserModel.js";

export const CalculateDistance = async (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.body;

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return res.status(400).json({
      status: false,
      message: "Please provide latitudes and longitudes for both locations.",
    });
  }

  const toRadians = (degree) => degree * (Math.PI / 180);

  const lat1Rad = toRadians(parseFloat(lat1));
  const lon1Rad = toRadians(parseFloat(lon1));
  const lat2Rad = toRadians(parseFloat(lat2));
  const lon2Rad = toRadians(parseFloat(lon2));

  const R = 6371;
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  const roundedDistance = parseFloat(distance.toFixed(2));

  const isFeasible = distance > 200;

  // Dynamic pricing logic
  const getDynamicPricing = (distance) => {
    if (distance <= 200) {
      return {
        basePrice: 100,
        distanceCharge: 20,
        surgePrice: 0,
      };
    } else if (distance > 200 && distance <= 500) {
      return {
        basePrice: 150,
        distanceCharge: 30,
        surgePrice: 10,
      };
    } else {
      return {
        basePrice: 200,
        distanceCharge: 25,
        surgePrice: 15,
      };
    }
  };

  const vehicles = [
    {
      vehicleName: "Toyota Prius",
      model: "2023",
      ac: true,
      details: "A reliable eco-friendly sedan with AC.",
    },
    {
      vehicleName: "Honda Civic",
      model: "2022",
      ac: true,
      details: "A comfortable sedan with AC, perfect for city commutes.",
    },
    {
      vehicleName: "Maruti Swift",
      model: "2020",
      ac: false,
      details: "A compact and fuel-efficient car.",
    },
  ];

  const rides = vehicles.map((v) => {
    const dynamicPricing = getDynamicPricing(roundedDistance);
    const price =
      dynamicPricing.basePrice +
      roundedDistance * dynamicPricing.distanceCharge +
      dynamicPricing.surgePrice;

    return {
      ...v,
      priceDetails: dynamicPricing,
      price: Math.round(price),
    };
  });

  if (isFeasible) {
    return res.status(200).json({
      status: true,
      distance: `${roundedDistance} km`,
      feasible: true,
      message: `The distance between the two points is ${roundedDistance} km. Ride options available.`,
      rides,
    });
  } else {
    return res.status(200).json({
      status: true,
      distance: `${roundedDistance} km`,
      feasible: false,
      message: `We are extremely sorry! No rides are possible as the distance is only ${roundedDistance} km, which is not feasible for a single-day ride.`,
    });
  }
};
export const getNotification = async (req, res) => {
  try {
    const notifications = [
      {
        id: 1,
        title: "Welcome to Plan My Trip!",
        message:
          "Thanks for joining! Explore and plan your next adventure with ease.",
        timestamp: new Date(),
        read: false,
        type: "welcome",
      },
      {
        id: 2,
        title: "Discover Historical Gems",
        message:
          "Check out the top heritage places in Ahmedabad curated just for you!",
        timestamp: new Date(),
        read: false,
        type: "info",
      },
    ];

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
      status: false,
    });
  }
};
const getProfile = async (req, res) => {
  const { user_id } = req.body;

  try {
    if (!user_id) {
      return res.status(400).json({
        message: "User ID is required",
        status: false,
      });
    }

    const user = await User.findOne({ user_id }).select("-password -__v -_id");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      status: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
      status: false,
    });
  }
};

export default { CalculateDistance, getNotification, getProfile };
