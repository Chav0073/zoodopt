import React, { useState } from "react";

import { mockPets } from "../data/mockup_data";

let PetsContext = React.createContext(null);

// export const PetsProvider = ({ children }) => {
//     const [pets, setPets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
// }

export default PetsContext;