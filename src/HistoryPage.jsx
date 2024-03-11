import React, { useState, useEffect } from 'react';
import { firestore } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './HistoryPage.css';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import globals from './globals'

const HistoryPage = () => {
    const [docs, setDocs] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedWorkerTitle, setSelectedWorkerTitle] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const workersCollection = collection(firestore, 'WorkersTimes');
            const workersSnapshot = await getDocs(workersCollection);
            const documents = workersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocs(documents);
        };
        if (!globals.auth) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, []);

    const renderDaysSummary = (days) => {
        const MAX_DISPLAY_DAYS = 5; // Adjust the number of days to display

        if (days.length <= MAX_DISPLAY_DAYS) {
            return days.join(', ');
        } else {
            const summary = days.slice(0, MAX_DISPLAY_DAYS).join(', ');
            return `${summary}, and ${days.length - MAX_DISPLAY_DAYS-1} more `;
        }
    };

    const handleViewAllDays = (days, name, month, year) => {
        const daysWithoutLast = days.slice(0, -1);
        setSelectedDays(daysWithoutLast);
        setSelectedWorkerTitle(`${name} - ${month}.${year}`);
    };

    const handleCloseModal = () => {
        setSelectedDays([]);
    };

    if (globals.auth) {
        return (
            <div className="history-table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map(doc => (
                            <tr key={doc.id}>
                                <td>{doc.WorkerEmail}</td>
                                <td>{doc.Month}</td>
                                <td>{doc.Year}</td>
                                <td>
                                    {renderDaysSummary(doc.DaysHours)}
                                    {doc.DaysHours.length > 5 && (
                                        <button onClick={() => handleViewAllDays(doc.DaysHours, doc.Name, doc.Month, doc.Year)}>
                                            View All Days
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal to display all days */}
                {selectedDays.length > 0 && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                            <h2>{selectedWorkerTitle}</h2>
                            <div className="days-container">
                                {selectedDays.map((day, index) => (
                                    <div key={index} className="day-item">
                                        <div className="day-label">Day {index + 1}:</div>
                                        <div className="day-value">{day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
};

export default HistoryPage;
