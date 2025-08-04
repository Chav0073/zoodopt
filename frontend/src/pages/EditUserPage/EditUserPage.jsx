import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchUser from "../../helpers/fetchUser";
import EditUser from "../../components/EditUser/EditUser";
import { useAuth } from "../../../context/AuthContext";

const EditUserPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const { token } = useAuth(); // ✅ get token from context

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !userId) return;
            const data = await fetchUser(token, userId); // ✅ pass both
            setUser(data);
        };

        fetchData();
    }, [token, userId]); // ✅ include token as dependency

    return (
        <>
            {user ? <EditUser user={user} userId={userId} /> : <p>Loading...</p>}
        </>
    );
};

export default EditUserPage;
