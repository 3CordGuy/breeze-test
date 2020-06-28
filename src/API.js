const getGroups = () =>
    fetch(`//localhost:8000/api/groups/`).then((response) => response.json());

const getPeople = () =>
    fetch(`//localhost:8000/api/people/`).then((response) => response.json());

const removePerson = (person_id) =>
    fetch(`//localhost:8000/api/people/${person_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

const updatePerson = (person) =>
    fetch(`//localhost:8000/api/people/${person.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
    });

const importPeople = (people) =>
    fetch(`//localhost:8000/api/people-import`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(people),
    });

const importGroups = (groups) =>
    fetch(`//localhost:8000/api/groups-import`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(groups),
    });

const getGroup = (group_id) =>
    fetch(`http://localhost:8000/api/groups/${group_id}`).then((response) =>
        response.json(),
    );

const API = {
    getGroups,
    getPeople,
    removePerson,
    updatePerson,
    importPeople,
    importGroups,
    getGroup,
};

export default API;
