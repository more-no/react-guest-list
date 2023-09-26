import './styles.css';
import { useState, useEffect } from 'react';

const baseUrl =
  'https://express-guest-list-api-memory-data-store--more-no.repl.co';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestList, setGuestList] = useState([]);

  /* ********** loading function ********** */

  useEffect(() => {
    const firstRenderFetch = async () => {
      try {
        const responseLoading = await fetch(`${baseUrl}/guests`);
        const data = await responseLoading.json();
        setGuestList(data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error first fetching: ', error);
        setIsLoading(false);
      }
    };

    firstRenderFetch().catch((error) => {
      console.error('Error during initial fetch:', error);
    });
  }, []); // triggers only on first render

  /* ********** end loading function ********** */

  /* ********** add guest function ********** */

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

    setGuestList(updatedGuestList);
    console.log('New guest created:', newGuest);

    // Reset the empty value in the input fields
    setGuestFirstName('');
    setGuestLastName('');
  }

  /* ********** end add guest function ********** */

  /* ********** change status function ********** */

  async function handleChangeStatus(id) {
    // Find the guest in the guestList
    const guestToUpdate = guestList.find((guest) => guest.id === id);

    // Create the guest data with updated attendance status
    const updatedGuest = {
      ...guestToUpdate,
      attending: !guestToUpdate.attending,
    };

    // Send a request to update the attending status in the API
    const resUpdatedStatus = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: updatedGuest.attending }),
    });

    if (!resUpdatedStatus.ok) {
      throw new Error('Failed to update attendance on the server');
    }

    // Update the guest's status locally
    const updatedGuestList = guestList.map((guest) =>
      guest.id === id ? updatedGuest : guest,
    );

    setGuestList(updatedGuestList);
  }

  /* ********** end change status function ********** */

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

    await responseDelete.json();
  }

  async function removeAllGuests() {
    try {
      for (const guest of guestList) {
        const deletedGuest = await fetch(`${baseUrl}/guests/${guest.id}`, {
          method: 'DELETE',
        });
        console.log(deletedGuest);
      }

      setGuestList([]);
    } catch (error) {
      console.error('Error removing guests:', error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="containerInput">
      <div className="frame">
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
              <div data-test-id="guest" key={`user-${value.id}`}>
                {value.firstName} {value.lastName}
                <br />
                <form>
                  <label className="attending">
                    Attending:{'     '}
                    {JSON.stringify(value.attending)}
                    <input
                      aria-label="attending"
                      type="checkbox"
                      checked={value.attending}
                      onChange={() => handleChangeStatus(value.id)}
                    />
                  </label>
                </form>
                <button onClick={() => removeGuest(value.id)}> Remove </button>
                <br />
              </div>
            ))}
          </div>
          <div className="removeAll">
            <button onClick={() => removeAllGuests()}>
              {' '}
              Remove All Guests{' '}
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
