const { addRumours } = require("./Models/addRumours.js");

const data = [
  {
    ID: 1,
    txnHash:
      "3a27d218da4e70f27dd197160b1278f056145a316a60af5c41cddb032787b13e",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098727890,
    post: "Astronauts' height can increase by up to 2 inches in microgravity as their spines decompress.\nAstronauts' height can increase by up to 2 inches in microgravity as their spines decompress.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 2,
    txnHash:
      "631bae1207d7b30568fcffffacd9c2abeb901f5dab36d9fbf8918f99d298365e",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098721175,
    post: "NASA’s Voyager spacecraft carry golden records with sounds, music, and greetings from Earth in case aliens ever find them.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 3,
    txnHash:
      "a8b7f51077c8b3b0d60a604445a79c4ac4f25d286e5510cc3162786cc02548dd",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098715506,
    post: "The famous “Pale Blue Dot” photo of Earth, taken by Voyager 1 from 3.7 billion miles away, shows our planet as a tiny speck in a sunbeam.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 4,
    txnHash:
      "b4cf59965772a083e360f808ece6941e5ca0a60fd1e66ec721bb1d769ab2b93b",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098709567,
    post: "Saturn's moon Titan has lakes of liquid methane and ethane—it's the only other place in the solar system with stable surface liquids.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 5,
    txnHash:
      "ba88e062b1b609994e23d103d9187351c9518889f6b2634065d121f9f8315118",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098700746,
    post: "Space smells like seared steak or welding fumes—astronauts report this after removing their helmets in the airlock.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 6,
    txnHash:
      "4cf0dc6e407af8c2ac34bf9e17c580f7d379be7bddf76fe2b6f7f7af6fb51056",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098695418,
    post: "There’s a theory that microbial life might survive space travel by hitching a ride on rocks ejected from planets—this is called lithopanspermia.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 7,
    txnHash:
      "0df4bfa3d8f85cafda7f0b15e26f5501b9e6c3f489d60daa9f6eee6809ae88bf",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098689744,
    post: "The International Space Station (ISS) orbits Earth every 90 minutes, meaning astronauts experience 16 sunrises and sunsets a day.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 8,
    txnHash:
      "fc25fd22a5d2fc73f6a437629e49160b249bded20cd2e983690d83bf7a692943",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098665073,
    post: "Some scientists believe humanity's survival long-term depends on becoming an interplanetary species.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 9,
    txnHash:
      "c52dccaf38362894709bd7702d0d291be30c3e1026745b97c1c497edfcef6f46",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098658572,
    post: "Saturn’s moon Mimas resembles the Death Star from Star Wars—complete with a massive impact crater called Herschel.\n\n",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 10,
    txnHash:
      "ef5722f095b95ab17be0f3dc2f43ee615eeb33eedf23cb31b6fdd92d4935bcf7",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098652453,
    post: "Space medicine is a growing field focused on understanding how space affects the body—and how to keep astronauts healthy long-term.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 11,
    txnHash:
      "cf11a31e6654f29c543c078555f44b5199d9ab0e6e356d5eba591e748ea3f8d1",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098647246,
    post: "Mars has the largest canyon in the solar system—Valles Marineris—which would stretch from New York to California.Mars has the largest canyon in the solar system—Valles Marineris—which would stretch from New York to California.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 12,
    txnHash:
      "ffe39fca26c88e1d7c40022c2443a1dbb3ed539c47181ab3e1db7b0d12f56670",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098641360,
    post: "The first American woman in space, Sally Ride, flew aboard the Challenger shuttle in 1983.\n\nThe first American woman in space, Sally Ride, flew aboard the Challenger shuttle in 1983.\n\n",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 13,
    txnHash:
      "7131128e5935daa6739de7fa8a71efc00b617fee32f8ed8f3727bcae307727c4",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098635239,
    post: "Earth’s atmosphere extends far beyond the Moon—recent studies show it stretches out to 630,000 km.a\na\na\na\na\na\n\na\na\na\na\n\naa",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 14,
    txnHash:
      "d32b205eedfb2348e84cb6500096a9800b4f31cf45599efa6248c6891f10751d",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098625633,
    post: "Cosmic background neutrinos from the Big Bang are still flying through the universe, but we haven’t directly detected them yet.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 15,
    txnHash:
      "ed0582e48e23795c708f38f46e5951460a3f355e0b9e499cb57a1beab221529c",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098619958,
    post: "Some stars “blink” when planets pass in front of them, but others dim for unknown reasons—like mysterious Tabby’s Star.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 16,
    txnHash:
      "df5476aaf812905d74cdc01c0d947d8aa2acd9fa037e0ba0b34b3cfd4655ef68",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098614247,
    post: "The Kuiper Belt, home to Pluto and other icy bodies, is like a second asteroid belt beyond Neptune. \n\ndamn\na\na\na\n\na",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 17,
    txnHash:
      "c44446e44ab119f5a408f28ae56862fe0eae39cf5abcda3e1559c73bf867840d",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098601279,
    post: "Future space colonies might use algae and insects as food sources due to their efficiency and minimal space requirements.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 18,
    txnHash:
      "b9a90abaedbe7c6694524adaa6477dd651756a535bfbf769ef1b31850ce19f0b",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098595196,
    post: "NASA’s Perseverance rover is collecting Martian soil samples for a future mission to return them to Earth.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 19,
    txnHash:
      "f9d67c36f38de60b15ca89eba52ac5c47bc81f20d8e4738f94ccd9d1c8169e5a",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098589511,
    post: "The longest continuous time in space by a single astronaut is 437 days, by Russian cosmonaut Valeri Polyakov.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 20,
    txnHash:
      "bc8f33495c7cae8fbcfd3838227a58966af6c5521472c0272bcfeb8acbbb7a06",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098584431,
    post: "Ceres, a dwarf planet in the asteroid belt, may have subsurface briny water—raising the possibility of microbial life.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 21,
    txnHash:
      "770bdeaf8d94f96ccedc0d63ec704dbfd34a3b41e7508216d9748e3bb677ced5",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098579017,
    post: "Elon Musk’s goal with SpaceX is to make humanity multi-planetary, starting with building a city on Mars.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 22,
    txnHash:
      "3434a07d99bf26231876ab9de26f07d7a1fd783b4b1cedb8267b1928edf62298",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098572725,
    post: "Astronauts often lose their sense of taste in microgravity, so they prefer spicy food or add hot sauce to meals.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 23,
    txnHash:
      "b6194f9bb13b16cbd56e23cb40ead0fbaba4cc20f37cfad2e3b6d754d347d8ae",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098566850,
    post: "A Mars habitat might be built using regolith bricks 3D-printed from the Martian surface to reduce cargo needs from Earth.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 24,
    txnHash:
      "00c5cecdae84a98c28a6b8fcdaf063b3d96d77a186ae66d6e23eea30f3b1d136",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098561078,
    post: "The Sun is expected to burn for another ~5 billion years before expanding into a red giant and engulfing Mercury and Venus.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 25,
    txnHash:
      "9c0fc15580fcab1a05eb52091db3796e3feda9cee8c4b1ec11d5f6f14a7f751c",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098532750,
    post: "Japan’s Hayabusa2 successfully returned samples from asteroid Ryugu—offering insight into the solar system’s early days.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 26,
    txnHash:
      "fd15fe6b47a0730b7bc515b7159fc7da2abfc603f56fa697e7ee2ab16bc68c50",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098525829,
    post: "You can’t cry in space the way you do on Earth—tears don’t fall, they just form globes and stick to your face.\n\n",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 27,
    txnHash:
      "880d7d0f054839a894d472621ae7a8e97ddb73ca724e03bf63ec584d18654fe7",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098517024,
    post: "Mars has polar ice caps made of water and dry ice (frozen CO₂), which expand and contract with the seasons.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 28,
    txnHash:
      "c24c37763a3104772c925fcf98565d4a5f0dde0d19e9d4290f7ac542b8bef564",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098509054,
    post: "Some missions use gravitational slingshots—using a planet’s gravity to fling a spacecraft faster and farther without using fuel.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 29,
    txnHash:
      "cf25cd4439c30337e59a3a7786d0f8fc5f3c3e4c0a08ebad7f917d5868c47321",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098502948,
    post: "On the Moon, you can jump six times higher than on Earth due to lower gravity—but you’d still need a pressurized suit.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
  {
    ID: 30,
    txnHash:
      "18b9509d553ee97229b8f7ae91a110d3f523bcc67f41337a3533cf7450b3d0ff",
    upvoteWallets: [],
    downvoteWallets: [],
    timestamp: 1744098497670,
    post: "Space elevators, though theoretical, could allow for cheap, continuous access to orbit—if we can build materials strong enough.",
    address: "eip155:1:0xd8dD62d7a36f5009E9703A5756D5C3CDd298e60c",
  },
];

addRumours(data)
