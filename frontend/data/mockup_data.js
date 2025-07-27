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
  }
];



export {
    currentUser,
    mockPets,
    mockShelters
};