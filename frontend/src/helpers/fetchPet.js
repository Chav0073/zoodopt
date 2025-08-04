const fetchPet = async (petId) => {
    try {
        const response = await fetch(`http://localhost:5217/pets/${petId}`);

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch(error) {
        console.log("Failed to fetch pet data: ", error.message);
    }
}

export default fetchPet;