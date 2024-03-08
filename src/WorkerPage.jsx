import { useState, useEffect } from 'react';
import './WorkerPage.css';
import { firestore } from './Firebase';
import { addDoc, setDoc,  getDocs, collection } from "firebase/firestore";
import globals from './globals'
import { useNavigate } from 'react-router-dom';

// Generate an array of days in the current month
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
daysArray.unshift(0);

const WorkerPage = () => {
    const [hours, setHours] = useState([]);
    const [hoursArray, setHoursArray] = useState([]);
    const navigate = useNavigate();

    // Fetch data from Firestore and fill the form
    useEffect(() => {
        const fetchWorkerData = async () => {
            try {
                const workerCollectionRef = collection(firestore, 'WorkersTimes');
                const querySnapshot = await getDocs(workerCollectionRef);

                const userData = querySnapshot.docs.find(
                    (doc) => doc.data().WorkerEmail === globals.userEmail && doc.data().Month === currentMonth && doc.data().Year === currentYear
                );

                if (userData) {
                    setHours(userData.data().DaysHours);
                }
            } catch (error) {
                console.error('Error fetching worker data:', error);
            }
        };

        fetchWorkerData();
    }, []);

    const handleInputChange = (day, value) => {
        setHours((prevHours) => ({ ...prevHours, [day]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitted hours:', hours);

        try {
            const workerCollectionRef = collection(firestore, 'WorkersTimes');
            const querySnapshot = await getDocs(workerCollectionRef);

            // Check if a document for the current user, year, and month already exists
            const existingDocument = querySnapshot.docs.find(
                (doc) => doc.data().WorkerEmail === globals.userEmail &&
                    doc.data().Year === currentYear &&
                    doc.data().Month === currentMonth
            );

            if (existingDocument) {
                // If the document already exists, update its data
                await setDoc(existingDocument.ref, {
                    WorkerEmail: globals.userEmail,
                    Year: currentYear,
                    Month: currentMonth,
                    DaysHours: hoursArray
                });
            } else {
                // If the document doesn't exist, create a new one
                const newDocRef = await addDoc(workerCollectionRef, {
                    WorkerEmail: globals.userEmail,
                    Year: currentYear,
                    Month: currentMonth,
                    DaysHours: hoursArray
                });
                console.log('Document added with ID: ', newDocRef.id);
            }
            const CollectionRef = collection(firestore, 'Workers');
            const query = await getDocs(CollectionRef);
            const exactDocument = query.docs.find(
                (doc) => doc.data().Email === globals.userEmail
            );
            const MonthArr = exactDocument.data().Month;
            const crrEmail = exactDocument.data().Email;
            const crrName = exactDocument.data().Name;
            MonthArr[currentMonth - 1] = hoursArray.reduce((acc, value) => acc + value, 0);
            await setDoc(exactDocument.ref, {
                Month: MonthArr,
                Email: crrEmail,
                Name: crrName,
                Role: 'Worker'
            });
            navigate('/success');
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    };



    useEffect(() => {
        const array = daysArray.map((day) => parseInt(hours[day]) || 0);
        setHoursArray(array);
    }, [hours]);


    return (
        <div>
            <h2>{`Month: ${currentMonth}/${currentYear}`}</h2>
            <h4>{`Email: ${globals.userEmail}`}</h4>

            <form onSubmit={handleSubmit} className="hours-form">
                <div className="form-group">
                    {daysArray.map((day) => (
                        <div key={day} className="day-container">
                            <label htmlFor={`day-${day}`} className="day-label">{`Day ${day}: `}</label>
                            <input
                                type="number"
                                id={`day-${day}`}
                                value={hours[day] || ''}
                                onChange={(e) => handleInputChange(day, e.target.value)}
                                className="hours-input"
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
};


export default WorkerPage;
