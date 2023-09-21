import './styles.css';
import { useState, useEffect } from 'react';

const baseUrl = 'http://localhost:4000';

let response = await fetch(`${baseUrl}/guests`);
const allGuests = await response.json();
let guestsElements = [];

guestsElements = allGuests.map((guest) => {
  return (
    <div key={`guest-div-${guest.id}`}>
      <br />
      Id: {guest.id}
      <br />
      Name: {guest.firstName} {guest.lastName}
      <br />
      Attending: {guest.attending}
      <br />
    </div>
  );
});

export default function App() {
  let [guestFirstName, setGuestFirstName] = useState();
  let [guestLastName, setGuestLastName] = useState();
  let [userFirstName, setUserFirstName] = useState();
  let [userLastName, setUserLastName] = useState();
  const [createdGuest, setCreatedGuest] = useState();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setUserFirstName();
      setUserLastName();
    }
  };

  return (
    <div className="container">
      <div data-test-id="guest">
        <form autoCapitalize="words" className="frame">
          guest list
          <br />
          <br />
          <label>
            First name <br />
            <input
              value={userFirstName}
              onChange={(event) => setGuestFirstName(event.target.value)}
            />
          </label>
          <br />
          <br />
          <label>
            Last name (press return) <br />
            <input
              value={userLastName}
              onChange={(event) => setGuestLastName(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
          <br />
          <br />
          <button> Remove </button>
          <br />
          <br />
          <label aria-label="<first name> <last name> attending status">
            Attending
            <input type="checkbox" />
          </label>{' '}
          <br />
          <br />
          {userFirstName} {userLastName}
        </form>
        <br />
        Loading...
        <br />
      </div>
      <div className="list">Guest List </div>
    </div>
  );
}
