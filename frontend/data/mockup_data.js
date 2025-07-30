const currentUser = {
    "name": 'Filip Popendyk',
    "role": 'admin'
};

const mockPets = [
  {
    id: 1,
    name: "Bella",
    species: "Dog",
    breed: "Labrador Retriever",
    age: 3,
    gender: "Female",
    description: "Friendly and energetic, loves to play fetch.",
    photo: "/images/pets/bella.jpg",
    status: "Available",
    shelterId: 101
  },
  {
    id: 2,
    name: "Whiskers",
    species: "Cat",
    breed: "Maine Coon",
    age: 2,
    gender: "Male",
    description: "Calm and cuddly. Great with kids and other pets.",
    photo: "/images/pets/whiskers.jpg",
    status: "Adopted",
    shelterId: 102
  },
  {
    id: 3,
    name: "Luna",
    species: "Dog",
    breed: "Siberian Husky",
    age: 4,
    gender: "Female",
    description: "Highly active, needs space and regular exercise.",
    photo: "/images/pets/luna.jpg",
    status: "Available",
    shelterId: 103
  },
  {
    id: 4,
    name: "Milo",
    species: "Rabbit",
    breed: "Mini Rex",
    age: 1,
    gender: "Male",
    description: "Very curious and loves treats. Litter-trained.",
    photo: "/images/pets/milo.jpg",
    status: "Available",
    shelterId: 101
  },
  {
    id: 5,
    name: "Coco",
    species: "Parrot",
    breed: "African Grey",
    age: 5,
    gender: "Female",
    description: "Talkative and intelligent. Needs stimulation.",
    photo: "/images/pets/coco.jpg",
    status: "Pending",
    shelterId: 102
  }
];

const mockShelters = [
  {
    id: 101,
    name: "Happy Tails Shelter",
    location: "Toronto, ON",
    phone: "416-555-0101",
    email: "contact@happytails.ca",
    description: "We specialize in dogs and rabbits. Focused on rehabilitation and rehoming.",
    logo: "/images/shelters/happytails.png"
  },
  {
    id: 102,
    name: "Whisker Haven",
    location: "Ottawa, ON",
    phone: "613-555-0123",
    email: "info@whiskerhaven.org",
    description: "Cat and exotic pet rescue shelter in the heart of Ottawa.",
    logo: "/images/shelters/whiskerhaven.png"
  },
  {
    id: 103,
    name: "Northern Paw Rescue",
    location: "Sudbury, ON",
    phone: "705-555-0456",
    email: "adopt@northernpaw.ca",
    description: "Dedicated to rescuing large breed dogs across Northern Ontario.",
    logo: "/images/shelters/northernpaw.png"
  },
  {
    id: 104,
    name: "Bunny Borough",
    location: "Mississauga, ON",
    phone: "905-555-0789",
    email: "hello@bunnyborough.ca",
    description: "A safe haven for rabbits and small mammals. Education and adoption services.",
    logo: "/images/shelters/bunnyborough.png"
  },
  {
    id: 105,
    name: "Furry Friends Refuge",
    location: "Hamilton, ON",
    phone: "289-555-0112",
    email: "contact@furryfriendsrefuge.org",
    description: "All-species rescue with a focus on community outreach and foster programs.",
    logo: "/images/shelters/furryfriendsrefuge.png"
  },
  {
    id: 106,
    name: "Purrfect Companions",
    location: "London, ON",
    phone: "519-555-0222",
    email: "adopt@purrfectcompanions.ca",
    description: "Cat-only shelter providing medical care and loving homes.",
    logo: "/images/shelters/purrfectcompanions.png"
  },
  {
    id: 107,
    name: "Wagging Hearts Sanctuary",
    location: "Kingston, ON",
    phone: "613-555-0345",
    email: "info@wagginghearts.ca",
    description: "Dog rescue specializing in senior and special needs animals.",
    logo: "/images/shelters/wagginghearts.png"
  },
  {
    id: 108,
    name: "Feathered Friends Haven",
    location: "Barrie, ON",
    phone: "705-555-0678",
    email: "contact@featheredfriends.ca",
    description: "Bird rescue and rehabilitation center for parrots and exotics.",
    logo: "/images/shelters/featheredfriends.png"
  },
  {
    id: 109,
    name: "Little Paws Shelter",
    location: "Guelph, ON",
    phone: "519-555-0890",
    email: "hello@littlepaws.ca",
    description: "Small animal rescue for guinea pigs, hamsters, and more.",
    logo: "/images/shelters/littlepaws.png"
  }
];



export {
    currentUser,
    mockPets,
    mockShelters
};