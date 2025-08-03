const fetchShelters = async (token) => {
    try {
        const response = await fetch("http://localhost:5217/shelters", {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Protected data:", data)
        return data;
    } catch (error) {
        console.log("Failed to fetch protected data: ", error.message);
    }
}

export default fetchShelters;