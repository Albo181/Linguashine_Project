import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeSummary = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get CSRF token from cookie
                const csrfToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrftoken='))
                    ?.split('=')[1];

                // Fetch user info
                const userResponse = await axios.get('/users/user-info/', {
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    withCredentials: true
                });
                setUserInfo(userResponse.data);

                // Fetch grade summary data
                const gradeResponse = await axios.get('/api/grade-summary/', {
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    withCredentials: true
                });
                setGrades(gradeResponse.data);
                setLoading(false);

                // Fetch students for teacher
                if (userResponse.data.user_type === 'teacher') {
                    const studentsResponse = await axios.get('/api/students/', {
                        headers: {
                            'X-CSRFToken': csrfToken
                        },
                        withCredentials: true
                    });
                    setStudents(studentsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userInfo) return <div>Please log in to view grades</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="bg-green-800 text-white shadow-md rounded-lg p-6 mt-20 mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    {userInfo.user_type === 'student' ? (
                        'Your Feedback'
                    ) : (
                        <>
                            Feedback for
                            <span className="text-blue-300"> {selectedStudent}</span>
                        </>
                    )}
                </h1>
                <div>
                    <label htmlFor="filterSelect" className="block text-sm font-medium text-blue-300 mb-1">
                        Filter By:
                    </label>
                    <select
                        id="filterSelect"
                        className="block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="Teacher Name">Teacher Name</option>
                        <option value="Date (Newest to Oldest)">Date (Newest to Oldest)</option>
                        <option value="Date (Oldest to Newest)">Date (Oldest to Newest)</option>
                        <option value="Task Type">Task Type</option>
                        <option value="Spanish Grade">Spanish Grade</option>
                        <option value="Grade Awarded">Grade Awarded</option>
                    </select>
                </div>
            </div>

            {/* Student Dropdown - Only show for teachers */}
            {userInfo.user_type === 'teacher' && (
                <div className="mb-6">
                    <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700">
                        Select Student:
                    </label>
                    <select
                        id="studentSelect"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white shadow-sm"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                        {students.length === 0 ? (
                            <option value="">No students available</option>
                        ) : (
                            students.map((student, index) => (
                                <option key={index} value={student}>
                                    {student}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            )}

            {/* Grade Display */}
            <div className="grid gap-4">
                {grades.map((grade, index) => (
                    <div key={index} className="border p-2 rounded shadow bg-white">
                        <h3 className="font-bold text-sm mb-1">
                            {userInfo.user_type === 'student' ? (
                                'Feedback Details'
                            ) : (
                                `Feedback for: ${grade.student_name?.username || 'Unknown Student'}`
                            )}
                        </h3>
                        <p className="text-sm mb-0.5">Task Type: {grade.task_type || 'No task type'}</p>
                        <p className="text-sm mb-0.5">
                            {userInfo.user_type === 'student' ? 'From Teacher' : 'Teacher'}: 
                            {grade.send_to?.username || 'Unknown Teacher'}
                        </p>
                        <p className="text-sm mb-0.5">Grade: {grade.grade_awarded || 0}/{grade.grade_total || 0} ({(grade.grade_percent || 0).toFixed(2)}%)</p>
                        <p className="text-sm mb-0.5">Teacher Notes: {grade.teacher_notes || 'No notes'}</p>
                        <p className="text-sm">Submission Date: {grade.submission_date ? new Date(grade.submission_date).toLocaleDateString() : 'Not submitted'}</p>
                    </div>
                ))}
                {grades.length === 0 && (
                    <div className="text-gray-500">No grades available</div>
                )}
            </div>
        </div>
    );
};

export default GradeSummary;
