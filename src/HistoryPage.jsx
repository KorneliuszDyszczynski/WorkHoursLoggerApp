import React, { useState, useEffect } from 'react';
import { firestore } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './HistoryPage.css';
import 'react-toastify/dist/ReactToastify.css';

const HistoryPage = () => {
    const [docs, setDocs] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const workersCollection = collection(firestore, 'WorkersTimes');
            const workersSnapshot = await getDocs(workersCollection);
            const documents = workersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocs(documents);
        };

        fetchData();
    }, []);

    const renderDaysSummary = (days) => {
        const MAX_DISPLAY_DAYS = 5; // Adjust the number of days to display

        if (days.length <= MAX_DISPLAY_DAYS) {
            return days.join(', ');
        } else {
            const summary = days.slice(0, MAX_DISPLAY_DAYS).join(', ');
            return `${summary}, and ${days.length - MAX_DISPLAY_DAYS} more `;
        }
    };

    const handleViewAllDays = (days) => {
        const daysWithoutLast = days.slice(0, -1);
        setSelectedDays(daysWithoutLast);
    };

    const handleCloseModal = () => {
        setSelectedDays([]);
    };

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
                                    <button onClick={() => handleViewAllDays(doc.DaysHours)}>
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
                        <h2>All Days</h2>
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
};

export default HistoryPage;
