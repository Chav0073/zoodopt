const getToken = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    return token;
}

export default getToken;