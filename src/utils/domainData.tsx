type Frequency = {
  key: string;
  planKey: string;
  price: number;
  oldPrice: number;
};

type Package = {
  frequencies: Frequency[];
};

type Packages = {
  bronze?: Package;
  silver?: Package;
  gold?: Package;
};

type Domain = {
  packages: Packages;
  group: string;
  category: string;
  title: string;
  subTitle: string;
};

type Domains = {
  [key: string]: Domain;
};

const domainData: Domains = {
  mydjlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Entertainment",
    title: "Take requests. Get booked. Grow your DJ brand.",
    subTitle: "Built for DJs and live performers.",
  },
  myinfluencerlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Creator",
    title: "Grow your audience. Share your content. Build your influence.",
    subTitle: "For creators building reach and engagement.",
  },
  mystudentlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Service",
    title: "Share your life. Connect your world. Keep it simple.",
    subTitle: "For students building their personal space.",
  },
  myrestaurantlife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Service",
    title: "Manage operations. Track performance. Grow your restaurant.",
    subTitle: "Built for restaurant owners and operators.",
  },
  mybusinesslife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Business",
    title: "Manage operations. Track performance. Scale your business.",
    subTitle: "For business owners focused on growth and efficiency.",
  },
  mycheflife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Creator",
    title: "Show your creations. Share your passion. Build your name.",
    subTitle: "For chefs and culinary creators starting their journey.",
  },
  mymusiclife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Entertainment",
    title: "Share your sound. Grow your audience. Build your music brand.",
    subTitle: "For artists and musicians.",
  },
  mypizzalife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Business",
    title: "Promote your menu. Track performance. Increase your sales.",
    subTitle: "For pizza shops focused on revenue and growth.",
  },
  mystorelife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Personal",
    title: "Promote your products. Track sales. Increase your revenue.",
    subTitle: "For retail businesses and shop owners.",
  },
  mybartendinglife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Service",
    title: "Share your work. Promote your services. Build your brand.",
    subTitle: "For bartenders getting started and growing their presence.",
  },
  myfreelancerlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Show your work. Get clients. Grow your freelance business.",
    subTitle: "For freelancers building income and reputation.",
  },
  myservicelife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Retail",
    title: "Show your services. Get clients. Grow your business.",
    subTitle: "For service professionals building their brand.",
  },
  mytemplife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Community",
    title: "Track your work. Share your journey. Stay organized.",
    subTitle: "For temporary workers and flexible careers.",
  },
  mycookinglife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Creator",
    title: "Share your recipes. Show your skills. Inspire your audience.",
    subTitle: "For home cooks and creators building their presence.",
  },
  mycpalife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Show your expertise. Attract clients. Build your practice.",
    subTitle: "For CPAs growing their client base and reputation.",
  },
  myentertainmentlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Entertainment",
    title: "Promote your talent. Engage your audience. Grow your brand.",
    subTitle: "For entertainers building visibility and reach.",
  },
  mynightlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Entertainment",
    title: "Promote the night. Engage the crowd. Build your scene.",
    subTitle: "For nightlife promoters and personalities.",
  },
  myailife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Business",
    title: "Build smarter systems. Automate your world. Scale with AI.",
    subTitle: "For builders using AI to create, optimize, and grow.",
  },
  myclublife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Venue",
    title: "Drive the crowd. Track performance. Maximize your revenue.",
    subTitle: "Built for nightlife venues and operators.",
  },
  mymedialife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Creator",
    title: "Share your content. Grow your audience. Build your brand.",
    subTitle: "For media creators and content producers.",
  },
  mystylistlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Personal",
    title: "Show your style. Book clients. Grow your brand.",
    subTitle: "For stylists and beauty professionals.",
  },
  mydevlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Creator",
    title: "Show your projects. Share your work. Build your portfolio.",
    subTitle: "For developers creating and showcasing their skills.",
  },
  mylatinlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Community",
    title: "Share your culture. Express your identity. Connect your world.",
    subTitle: "For celebrating and sharing Latin life.",
  },
  mymakerlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Creator",
    title: "Show what you create. Share your builds. Grow your craft.",
    subTitle: "For makers and creators of all kinds.",
  },
  mysaloonlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Promote your space. Engage your crowd. Grow your brand.",
    subTitle: "For saloons and local hangouts.",
  },
  mybarberlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Show your cuts. Get booked. Build your barber brand.",
    subTitle: "Made for barbers growing their chair and clientele.",
  },
  mygymlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Promote your training. Engage clients. Grow your fitness brand.",
    subTitle: "For trainers and fitness professionals.",
  },
  mynitelife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Retail",
    title: "Run the vibe. Engage your crowd. Own the night.",
    subTitle: "For nightlife brands and experiences.",
  },
  mysalonlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Venue",
    title: "Show your work. Book clients. Grow your salon brand.",
    subTitle: "For beauty professionals building their business.",
  },
  myworldlife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Business",
    title:
      "Connect everything. Track performance. Grow your brand and business.",
    subTitle: "Your all-in-one hub for life, business, and beyond.",
  },
  mybarlife: {
    packages: {
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "POWER_SILVER_YEARLY",
            price: 499.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "POWER_GOLD_MONTHLY",
            price: 99.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "POWER_GOLD_YEARLY",
            price: 999.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "POWER",
    category: "Venue",
    title: "Run smarter nights. Track performance. Drive more revenue.",
    subTitle: "Built for bar owners and operators focused on results.",
  },
  myeventlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Event",
    title: "Promote your events. Engage your audience. Drive attendance.",
    subTitle: "For event hosts and organizers.",
  },
  mybandlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Entertainment",
    title: "Promote your band. Share your music. Grow your audience.",
    subTitle: "Your space for music, links, and connecting with fans.",
  },
  myvibelife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Business",
    title: "Feel the connection. Share the moment. Live the experience.",
    subTitle: "For connecting, sharing, and experiencing together.",
  },
  myagentlife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Build trust. Grow your client list",
    subTitle: "A simple page for agents to connect and be found",
  },
  myinsurancelife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Make insurance easier to request",
    subTitle: "A simple page for agents, brokers, and clients",
  },
  myphotolife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_BRONZE_YEARLY",
            price: 19.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "yearly",
            planKey: "SPARK_SILVER_YEARLY",
            price: 99.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "SPARK_GOLD_MONTHLY",
            price: 19.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "SPARK_GOLD_YEARLY",
            price: 199.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "SPARK",
    category: "Creator",
    title: "Capture the moment. Share your view. Build your portfolio.",
    subTitle:
      "For hobbyists, shutterbugs, and visual creators sharing their perspective.",
  },
  myphotographylife: {
    packages: {
      bronze: {
        frequencies: [
          {
            key: "yearly",
            planKey: "PULSE_BRONZE_YEARLY",
            price: 49.99,
            oldPrice: 0,
          },
        ],
      },
      silver: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_SILVER_MONTHLY",
            price: 14.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_SILVER_YEARLY",
            price: 149.99,
            oldPrice: 0,
          },
        ],
      },
      gold: {
        frequencies: [
          {
            key: "monthly",
            planKey: "PULSE_GOLD_MONTHLY",
            price: 29.99,
            oldPrice: 0,
          },
          {
            key: "yearly",
            planKey: "PULSE_GOLD_YEARLY",
            price: 299.99,
            oldPrice: 0,
          },
        ],
      },
    },
    group: "PULSE",
    category: "Service",
    title: "Frame your passion. Book clients. Grow your studio brand.",
    subTitle:
      "For professional photographers building a client base and showcasing premium work.",
  },
};

export default domainData;
