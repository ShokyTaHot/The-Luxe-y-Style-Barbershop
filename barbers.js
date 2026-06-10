/* ============================================================
   THE LUXE & STYLE — barbers.js
   Datos de especialistas. Para agregar uno nuevo, copia un
   bloque y cambia los valores. IIFE pattern, sin ES modules.
   ============================================================ */
(function () {
  "use strict";

  window.BARBERS = [
    {
      id: 1,
      name: "Marlen",
      business: "Marlen Hair Beauty",
      flag: "🇩🇴",
      specialty: "Trenzas & Cabello Natural",
      phone: "18604949974",
      photo: "assets/img/perfil1.png",
      gallery: [
        "assets/img/braid1.jpg",
        "assets/img/braid2.jpg",
        "assets/img/braid3.jpg",
        "assets/img/braid4.jpg",
        "assets/img/braid5.jpg",
        "assets/img/braid6.jpg"
      ],
      tags: ["Box Braids", "Cornrows", "Fulani Braids", "Cabello Natural", "Servicios para Mujeres"],
      timeSlots: [
        "9:00 AM","9:30 AM","10:00 AM","10:30 AM",
        "11:00 AM","11:30 AM","12:00 PM","12:30 PM",
        "1:00 PM","1:30 PM","2:00 PM","2:30 PM",
        "3:00 PM","3:30 PM","4:00 PM","4:30 PM",
        "5:00 PM","5:30 PM"
      ],
      services: [
        {
          category: "Trenzas y Cabello Natural",
          items: [
            { name: "Consulta",                   price: "Gratis"   },
            { name: "Scalp Detox",                price: "$20"      },
            { name: "Wash & Blow Dry Natural",    price: "$25"      },
            { name: "Blow Dry Natural",           price: "$20"      },
            { name: "Braids Only (6)",            price: "$65"      },
            { name: "Braids Full Service",        price: "$90"      },
            { name: "Pop Smoke Braids",           price: "$72"      },
            { name: "Box Braids Full Head",       price: "$90"      },
            { name: "Fulani Braids",              price: "$121.50"  },
            { name: "Two Strand Twists",          price: "$100"     },
            { name: "Flat Twist Full Head",       price: "$90"      },
            { name: "Barrel Twist Top",           price: "$99"      },
            { name: "Barrel Twist Full Head",     price: "$112.50"  },
            { name: "Design Braids Freestyle",    price: "$90"      },
            { name: "Loc Retwist Full Head",      price: "$112.50"  },
            { name: "Kamikaze Twist",             price: "$85.50"   }
          ]
        },
        {
          category: "Servicios para Mujeres",
          items: [
            { name: "All In One (Wash+Cut+Blow+Style)", price: "$95"      },
            { name: "Hair Color",                       price: "$100"     },
            { name: "Female Haircut",                   price: "$42.75"   },
            { name: "Small Amount of Braids",           price: "$40"      },
            { name: "Wash + Blow Dry + Style",          price: "$47.50"   },
            { name: "Blow Dry + Style",                 price: "$38"      },
            { name: "Repair & Nourish",                 price: "$71.25"   },
            { name: "Hair Relaxer",                     price: "$85.50"   },
            { name: "Texture Hair Wash + Silk Press",   price: "$52.25"   },
            { name: "Keratin Treatment",                price: "$332.50"  },
            { name: "Highlights",                       price: "$190"     },
            { name: "Botox Hair Treatment",             price: "$142.50"  }
          ]
        },
        {
          category: "Niños (4-7 años)",
          items: [
            { name: "Wash & Blow Dry Kids",  price: "$28.50" },
            { name: "Blow Dry & Style Kids", price: "$23.75" },
            { name: "Cornrows (4) Kids",     price: "$47.50" }
          ]
        }
      ]
    }
    /* ── Para agregar otro especialista, pega aquí un bloque nuevo ── */
  ];

})();
