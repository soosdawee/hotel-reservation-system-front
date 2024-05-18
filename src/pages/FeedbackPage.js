import React, { useState, useEffect, lazy  } from 'react';
import Navbar from "../components/Navbar.js";
import {Form, Button} from 'react-bootstrap';
import axios from 'axios';

export default function FeedbackPage() {
    const [data, setData] = useState(null);
    const [hotelId, setHotelId] = useState(null);
    const [rate, setRate] = useState(null);
    const [input, setInput] = useState('');

    const handleSelectChange = (e) => {
        setHotelId(e.target.value);
    };

    const handleSelectRateChange = (e) => {
        setRate(e.target.value);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/feedback', {
                "stars": rate,
                "description": input,
                "hotelId": hotelId
            });
          } catch (error) {
            console.error('Error submitting the feedback:', error);
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

    return (
        <div className = "feedback-page">
            <Navbar />
            <div className="select-container">
                <h2>Please select the hotel you want to review!</h2>
                <Form.Select onChange={handleSelectChange}>
                    { data ? (
                            data.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                            ))
                    ) :(<option >No hotel available</option>) }
                </Form.Select>
                <h2>Rate your experience!</h2>
                <Form.Select onChange={handleSelectRateChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Form.Select>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicText">
                    <Form.Control 
                        type="text" 
                        placeholder="Tell us about your stay!" 
                        value={input} 
                        onChange={handleInputChange} 
                    />
                </Form.Group>
                <Button className="reserve-button" variant="primary" type="submit">
                    Submit review!
                </Button>
            </Form>
        </div>
    );
}
