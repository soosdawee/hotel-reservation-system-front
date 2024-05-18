import React, { useState, useEffect, lazy  } from 'react';
import Navbar from "../components/Navbar.js";
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const ReadMore = ({ title, children }) => {
    const [expanded, setExpanded] = useState(false);
  
    const toggleExpanded = () => {
      setExpanded(!expanded);
    };
  
    return (
      <div>
        <h2 className = "read-title">{title}</h2>
        {!expanded && (
          <button className = "read-button" onClick={toggleExpanded}>See available rooms!</button>
        )}
        {expanded && (
          <div>
            {children}
            <button className = "read-button" onClick={toggleExpanded}>Show less</button>
          </div>
        )}
      </div>
    );
  };

export default function CancelPage() {
    const [data, setData] = useState(null);

    function isRoomAvailable(room) {
        return !room.isAvailable;
    }

    const handleReserve = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:8080/room/${id}`, {
              "isAvailable": true,
            });
            if (response.status === 200) {
                setData(prevData => prevData.map(room => 
                    room.id === id ? { ...room, isAvailable: true } : room
                ));
            }
        } catch (error) {
            console.error(`Error reserving room: ${error.message}`);
          }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/room`);
                setData(response.data); 
                console.log(data);

                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); 
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            {
                data ? (
                    data.filter(isRoomAvailable).length > 0 ? (
                    <div className='rooms'>
                        {data.filter(isRoomAvailable).map(room => (
                            <div key={room.id} className="room-card">
                                <p>Nr: {room.roomNumber}</p>
                                <p>{room.type} </p>
                                <button className = "reserve-button" onClick={() => handleReserve(room.id)}>Cancel the reservation</button>
                            </div>
                            
                        ))}
                    </div>
                    ) : (<p>There are no reservations at the moment!</p>)
                ) : ( <p>Loading...</p>)
            }             
                    
                
        </div>
    );
}
