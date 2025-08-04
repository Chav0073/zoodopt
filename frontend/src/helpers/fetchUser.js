const fetchUser = async (token, userId) => {
    try {
        const response = await fetch(`http://localhost:5217/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch user data:", error.message);
        return null;
    }
};

export default fetchUser;
