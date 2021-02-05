const fetch = require("node-fetch");

module.exports = class {
    constructor(token) {
        this.token = token;
    }

    verify(userID) {
        return new Promise((resolve, reject) =>
            fetch(encodeURI(`${process.env.VIMEAUTH_URI}/api/add?user=${userID}&secret=${process.env.VIMEAUTH_TOKEN}`))
                .then(res => res.json())
                .then(res => resolve(res[1]))
                .catch(reject)
        );
    }

    userByID(userID, users = null) {
        return new Promise((resolve, reject) => {
            if(users !== null) {
                const user = users.find((user) => user.userID == userID);
                if(!user) return resolve([]);
                else return fetch(encodeURI(`https://api.vimeworld.ru/user/name/${user.nickname}`), { headers: { 'Access-Token': this.token } })
                    .then(res => res.json())
                    .then(resolve)
                    .catch(reject);
            } else return global.r.table('users').run(global.conn).then((users) => {
                const user = users.find((user) => user.userID == userID);
                if(!user) return resolve([]);
                else return fetch(encodeURI(`https://api.vimeworld.ru/user/name/${user.nickname}`), { headers: { 'Access-Token': this.token } })
                    .then(res => res.json())
                    .then(resolve)
                    .catch(reject);
            }).error(console.error);
        });
    }

    userByNickname(nickname) {
        return new Promise((resolve, reject) =>
            fetch(encodeURI(`https://api.vimeworld.ru/user/name/${nickname}`), { headers: { 'Access-Token': this.token } })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        );
    }

    usersByID(ids) {
        return new Promise((resolve, reject) =>
            fetch(encodeURI(`https://api.vimeworld.ru/user/session`), { method: "POST", body: JSON.stringify(ids), headers: { 'Content-Type': 'application/json', 'Access-Token': this.token } })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        );
    }
    
    userByNicknameAndData(nickname) {
        return new Promise((resolve, reject) =>
            fetch(encodeURI(`https://api.vimeworld.ru/user/name/${nickname}`), { headers: { 'Access-Token': this.token } })
                .then(res => res.json())
                .then(r =>
                    global.r.table('users').run(global.conn).then((users) => {
                        const user = users.find((user) => user.nickname == nickname);
                        resolve({
                            data: (!user) ? null : user,
                            game: r
                        });
                    })
                ).catch(reject)
        );
    }

    guild(type, str) {
        return new Promise((resolve, reject) =>
            fetch(encodeURI(`https://api.vimeworld.ru/guild/get?${(type == "-i") ? "id" : (type == "-t") ? "tag" : (type == "-n") ? "name" : "invalid"}=${str}`), { headers: { 'Access-Token': this.token } })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        );
    }
}