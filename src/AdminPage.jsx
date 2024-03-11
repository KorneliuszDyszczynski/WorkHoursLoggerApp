import { useState, useEffect } from 'react';
import { auth, firestore } from './Firebase';
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import './AdminPage.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import globals from './globals'

function generateRandomId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;
}

const AdminPage = () => {

    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const fetchData = async () => {
            const workersCollection = collection(firestore, "Workers");
            const workersSnapshot = await getDocs(workersCollection);
            const filteredWorkers = workersSnapshot.docs
                .filter(doc => doc.data().Role === "Worker")
                .map(doc => ({ id: doc.id, ...doc.data() }));

            setWorkers(filteredWorkers);
        };
        if (!globals.auth) {
            navigate('/login');
        } else {
            fetchData();
        }

    }, []);

    const goToHistoryPage = () => {
        navigate('/history');
    }

    // Function to handle form submission and add a new employee
    const handleAddEmployee = async () => {
        if (newEmployee.name.trim() === '') {
            alert('Please enter a valid name for the new employee.');
            return;
        }

        try {
            const randomId = generateRandomId();
            //store worker data in firestore
            await setDoc(doc(firestore, "Workers", randomId), {
                Email: newEmployee.email,
                Name: newEmployee.name,
                Role: "Worker",
                Month: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            });
            //add user for authentication
            await createUserWithEmailAndPassword(auth, newEmployee.email, newEmployee.password);
            window.location.reload(false);
        } catch (error) {
            window.location.reload(false);
        }
    };

    if (globals.auth) {
        return (
            <div>
                <ToastContainer />
                <h2>Admin Page</h2>
                <table className="worker-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Jan</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Apr</th>
                            <th>May</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Aug</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dec</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map(worker => (
                            <tr key={worker.Email}>
                                <td>{worker.Name}</td>
                                {Object.values(worker.Month).map((Month, index) => (
                                    <td key={index}>{Month}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr style={{ margin: '20px 0', width: '100%' }} />

                <form >
                    <div className="form-group">
                        <div>
                            <label htmlFor="employeeName">New Employee Name:</label>
                            <input
                                id="employeeName"
                                type="text"
                                value={newEmployee.name}
                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="employeeEmail">New Employee Email:</label>
                            <input
                                id="employeeEmail"
                                type="email"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="employeePassword">New Employee Password:</label>
                            <input
                                id="employeePassword"
                                type="password"
                                value={newEmployee.password}
                                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="button" onClick={handleAddEmployee}>Add Employee</button>
                </form>

                <hr style={{ margin: '20px 0', width: '100%' }} />

                <button type="button" onClick={goToHistoryPage}>History</button>
            </div>
        );
    }
    
};

export default AdminPage;
