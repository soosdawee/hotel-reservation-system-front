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

export default function HomePage() {
    const [data, setData] = useState(null);
    const [distance, setDistance] = useState(50);
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const handleSliderChange = (e) => {
        setDistance(e.target.value);
    };

    const calculateDistance = (latSrc, longSrc, latDest, longDest) => {
        const toRadians = n => (n * Math.PI) / 180;
        return (Math.acos((Math.sin(toRadians(latSrc)) * Math.sin(toRadians(latDest))) + (Math.cos(toRadians(latSrc)) * Math.cos(toRadians(latDest))) * (Math.cos(toRadians(longDest) - toRadians(longSrc)))) * 6371)
    }

    function isDistanceSmaller(hotel) {
        if (calculateDistance(location.latitude, location.longitude, hotel.latitude, hotel.longitude) < distance) {
            return true;
        } else {
            return false;
        }
    }

    function isRoomAvailable(room) {
        return room.isAvailable;
    }

    const handleReserve = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:8080/room/${id}`, {
              "isAvailable": false,
            });

            if (response.status === 200) {
                setData(prevData => {
                  return prevData.map(hotel => {
                    return {
                      ...hotel,
                      rooms: hotel.rooms.map(room => {
                        if (room.id === id) {
                          return { ...room, isAvailable: false };
                        }
                        return room;
                      })
                    };
                  });
                });
              }

          } catch (error) {
            console.error(`Error reserving room: ${error.message}`);
          }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/hotel`);
                setData(response.data); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); 
    }, []);

    useEffect(() => {
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                  }
                );
              } 
        } catch (error) {
            console.error('Error finding current position:', error);
        }
        
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            <div className="select-container">
                <h2>Please select the distance!</h2>
                <h3>{distance} km</h3>
                <Form.Range
                    className = "select"
                    value = {distance}
                    onChange = {handleSliderChange}    
                />
            </div>
            {data ? (
                <div className='hotels'>
                {data.filter(isDistanceSmaller).map(hotel => (
                    <div key={hotel.id} className='hotel-card'>
                        <ReadMore title={hotel.name}>
                                {hotel.rooms && hotel.rooms.filter(isRoomAvailable).length > 0 ? (
                                    <div className="rooms">
                                        {hotel.rooms.filter(isRoomAvailable).map(room => (
                                            <div key={room.id} className="room-card">
                                                <p>Nr: {room.roomNumber}</p>
                                                <p>{room.type}</p>
                                                <button className="reserve-button" onClick={() => handleReserve(room.id)}>Reserve for {room.price}</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No rooms available!</p>
                                )}
                            </ReadMore>
                    </div>
                ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
