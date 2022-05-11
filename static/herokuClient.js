function generateRandomString() {
    let randomString = '';
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    return randomString;
}

setTimeout(() => {
    console.log("ONLOAD");
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];

    if (!accessToken) {
        const randomString = generateRandomString();
        localStorage.setItem('oauth-state', randomString);

        // document.getElementById('login').href += `&state=${encodeURIComponent(btoa(randomString))}`;
        let redirect = "https://discord.com/api/oauth2/authorize?client_id=964554781169451098&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=identify%20guilds.members.read%20guilds";
        redirect += `&state=${encodeURIComponent(btoa(randomString))}`;
        console.log({redirect});
        window.location = redirect;
        // return document.getElementById('login').style.display = 'block';
    }

    if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        return console.log('You may have been click-jacked!');
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then(result => result.json())
        .then(response => {
            const { username, discriminator } = response;
            document.getElementById('info').innerText += ` ${username}#${discriminator}`;
        })
        .catch(console.error);
}, 2000)
