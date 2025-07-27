import React from "react";

import { currentUser } from "../data/mockup_data";

const UserContext = React.createContext(currentUser);

export default UserContext;