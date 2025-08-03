const getToken = () => {
    let token = JSON.stringify(localStorage.getItem("token"));
    return token;
}

export default getToken;