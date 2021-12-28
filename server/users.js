const users = [];

const add_user = ({id, name, room}) => {
    // change name and room names to lower case + no space
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // check if user name is already taken in this room
    if (users.find((user) => user.room === room && user.name === name)){
        return { error: "User name already taken in that room"}
    }

    // create a new user object
    const user = {id, name , room};

    // add new object to the users list
    users.push(user);

    return {user}
}

const remove_user = (id) => {
    // remove user from users array using filter
    const users = users.filter(user => user.id !== id);

    return users;
}

const get_user = (id) => {
   return users.find((user) => user.id == id)
}

const get_users_in_room = (room) => {
    return users.filter((user) => user.room == room)
}

module.exports = {add_user, get_user, get_users_in_room, remove_user};