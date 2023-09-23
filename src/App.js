import './styles.css';
import { useState, useEffect } from 'react';

const baseUrl = 'http://localhost:4000';
const responseFetch = await fetch(`${baseUrl}/guests`);
const allGuests = await responseFetch.json();

export default function App() {
  // const [isLoading, setIsLoading] = useState(true);
  // const [title, setTitle] = useState('Guest List App');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestAttending, setGuestAttending] = useState(false);
  const [guestList, setGuestList] = useState(allGuests);

  // useEffect(() => {
  //   async function firstRenderFetch() {
  //     try {
  //       response = await fetch('http://localhost:4000/guests');
  //       const data = await response.json();

  //       setGuestList(data);
  //       // document.title = title;
  //     } catch (error) {
  //       console.log('Error first fetching: ', error);
  //       setIsLoading(false);
  //     }
  //   }

  //   firstRenderFetch();
  // }, []); // triggers only on first render

  // if (isLoading) {
  //   return (
  //     <h2 className="loading">
  //       Loading...
  //       <img
  //         src="https://icons8.com/preloaders/preloaders/1496/Spinner-5.gif"
  //         alt="spinner"
  //       />
  //     </h2>
  //   );
  // }

  /* ********** inizio funzione add guest ********** */

  async function handleNewGuest() {
    // Create the guest data
    const guestData = {
      firstName: guestFirstName,
      lastName: guestLastName,
      attending: false,
    };

    // Send a request to create a new guest in the API
    const responseGuest = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestData),
    });

    const newGuest = await responseGuest.json();

    // Update the local guest list with the newly created guest including the 'id'
    const updatedGuestList = [
      ...guestList,
      {
        id: newGuest.id,
        firstName: newGuest.firstName,
        lastName: newGuest.lastName,
        attending: newGuest.attending,
      },
    ];

    // Reset the empty value in the input fields
    setGuestFirstName('');
    setGuestLastName('');
    // Update the guestList
    setGuestList(updatedGuestList);
    console.log('New guest created:', newGuest);
  }

  /* ********** fine funzione add guest ********** */

  /* ********** inizio funzione change status ********** */

  // async function handleChangeStatus(guestId) {
  //   const updatedStatus = allGuests.map((guest) => {
  //     if (guest.id === guestId) {
  //       guest.attending = !guest.attending;
  //     }
  //   });
  //   // Update the guest list locally
  //   setGuestList(updatedStatus);

  //   // Update the attendance on the server
  //   const responseAttendance = await fetch(`${baseUrl}/guests/:${guestId}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       attending: true,
  //     }),
  //   });
  //   if (!responseAttendance.ok) {
  //     throw new Error('Failed to update attendance on the server');
  //   }
  //   const updatedGuest = await responseAttendance.json();
  //   setGuestAttending(updatedGuest);
  // }

  /* ********** fine funzione change status ********** */

  const handleInputFirstName = (event) => {
    setGuestFirstName(event.target.value);
  };

  const handleInputLastName = (event) => {
    setGuestLastName(event.target.value);
  };

  const enterNewGuest = (event) => {
    if (event.key === 'Enter') {
      handleNewGuest().catch((error) => {
        console.error('Error creating new guest:', error.message);
      });
    }
  };

  async function removeGuest(id) {
    const updatedList = guestList.filter((guest) => guest.id !== id);
    setGuestList(updatedList);

    const responseDelete = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });

    const deletedGuest = await responseDelete.json();
  }

  return (
    <div className="containerInput">
      <div className="frame" data-test-id="guest">
        <fieldset>
          <legend>Add guest:</legend>
          <label>
            First name <br />
            <input value={guestFirstName} onChange={handleInputFirstName} />
          </label>
          <br />
          <br />
          <label>
            Last name <br />
            <input
              value={guestLastName}
              onChange={handleInputLastName}
              onKeyDown={enterNewGuest}
            />
          </label>
          <br />
          <br />
        </fieldset>
      </div>
      <div className="listContainer">
        <fieldset>
          <legend>Guest List: </legend>
          <div className="list">
            {guestList.map((value) => (
              <span key={`user-${value.id}`}>
                {value.firstName} {value.lastName}
                <br />
                <form>
                  <label className="attending">
                    Attending:{'     '}
                    {JSON.stringify(value.attending)}
                    <input
                      type="checkbox"
                      // 2. connect the state variables to the form fields
                      checked={value.attending}
                      // 3. Update the state value with the event.currentTarget.checked
                      onChange={(event) => {
                        handleChangeStatus(value.id);
                        // setGuestAttending(event.currentTarget.checked);
                      }}
                    />
                  </label>
                </form>
                <button onClick={() => removeGuest(value.id)}> Remove </button>
                <br />
              </span>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
