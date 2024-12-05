import React, { useEffect, useState } from "react";

const GradeSummary = () => {

  // Starts window at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
    const [feedbackData, setFeedbackData] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [filterType, setFilterType] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    // Fetch user info first
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                console.log("Fetching user info...");
                const response = await fetch('/users/user-info/', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("User info:", data);
                    setUserInfo(data);
                    // If the user is a student, automatically set them as the selected student
                    if (data.user_type === 'student') {
                        setSelectedStudent(data.username);
                    }
                } else {
                    console.error("Error fetching user info:", response.status);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

    // Fetch all students for teachers
    useEffect(() => {
        const fetchStudents = async () => {
            if (userInfo?.user_type === 'teacher') {
                try {
                    console.log("Fetching students...");
                    const response = await fetch('/users/all-users/?user_type=student', {
                        credentials: 'include'
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Student data:", data);
                        // Extract usernames directly from the data
                        const studentList = data.map(student => student.username).filter(Boolean);
                        console.log("Processed student list:", studentList);
                        setStudents(studentList);
                        
                        // Set default student if none selected and we have students
                        if (studentList.length > 0 && !selectedStudent) {
                            console.log("Setting default student:", studentList[0]);
                            setSelectedStudent(studentList[0]);
                        }
                    } else {
                        console.error("Error fetching students:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching students:", error);
                }
            }
        };
        fetchStudents();
    }, [userInfo, selectedStudent]); // Re-run when either userInfo or selectedStudent changes

    // Fetch feedback data
    useEffect(() => {
        const fetchFeedback = async () => {
            if (!selectedStudent) {
                console.log("No student selected, skipping feedback fetch");
                return;
            }
            
            try {
                console.log("Fetching feedback for student:", selectedStudent);
                const response = await fetch(`/api/grade-summary/?student=${selectedStudent}`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Raw feedback data:", data);
                    setFeedbackData(data);
                } else {
                    console.error("Error fetching feedback:", response.status);
                    setFeedbackData([]); // Clear feedback data on error
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
                setFeedbackData([]); // Clear feedback data on error
            }
        };
        
        fetchFeedback();
    }, [selectedStudent]); // Only re-run when selectedStudent changes

    // Filter data by selected student
    const filteredFeedbackData = feedbackData
        .filter(item => {
            if (!selectedStudent) return true;
            
            const studentName = item.student_name?.username;
            const sendToName = item.send_to?.username;
            
            // For teachers, show feedback where the selected student is involved
            if (userInfo?.user_type === 'teacher') {
                return studentName === selectedStudent;
            }
            // For students, show feedback where the selected person (teacher/student) is involved
            else if (userInfo?.user_type === 'student') {
                return (studentName === selectedStudent || sendToName === selectedStudent);
            }
            
            return false;
        })
        .sort((a, b) => {
            if (!a.submission_date && !b.submission_date) return 0;
            if (!a.submission_date) return 1;
            if (!b.submission_date) return -1;
            
            switch (filterType) {
                case "Date (Newest to Oldest)":
                    return new Date(b.submission_date) - new Date(a.submission_date);
                case "Date (Oldest to Newest)":
                    return new Date(a.submission_date) - new Date(b.submission_date);
                case "Spanish Grade":
                    return (b.grade_percent || 0) - (a.grade_percent || 0);
                case "Grade Awarded":
                    return (b.grade_awarded || 0) - (a.grade_awarded || 0);
                case "Teacher Name":
                    return (a.send_to?.username || "").localeCompare(b.send_to?.username || "");
                default:
                    return 0;
            }
        });

    // Calculate Spanish grade out of 10
    const calculateSpanishGrade = (gradePercent) => {
        return ((gradePercent / 100) * 10).toFixed(2);
    };

    // Calculate the cumulative average grade
    const calculateAverageGrade = () => {
        if (filteredFeedbackData.length === 0) return "0.00 (0%)";
        const totalGradePercent = filteredFeedbackData.reduce((sum, item) => sum + (item.grade_percent || 0), 0);
        const averageGrade = (totalGradePercent / filteredFeedbackData.length).toFixed(2);
        const averageSpanishGrade = ((totalGradePercent / filteredFeedbackData.length) / 100 * 10).toFixed(2);
        return `${averageSpanishGrade} (${averageGrade}%)`;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="bg-green-800 text-white shadow-md rounded-lg p-6 mt-20 mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Feedback for
                    <span className="text-blue-300"> {selectedStudent}</span>
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

            {/* Student Dropdown */}
            <div className="mb-6">
                <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700">
                    {userInfo?.user_type === 'student' ? 'Your Feedback:' : 'Select Student:'}
                </label>
                <select
                    id="studentSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white shadow-sm"
                    value={selectedStudent || ''}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    disabled={userInfo?.user_type === 'student'}
                >
                    {userInfo?.user_type === 'student' ? (
                        <option value={userInfo.username}>{userInfo.username}</option>
                    ) : (
                        <>
                            <option value="">Select a student</option>
                            {students.map((student, index) => (
                                <option key={index} value={student}>
                                    {student}
                                </option>
                            ))}
                        </>
                    )}
                </select>
            </div>

            {/* Table */}
            <div className="bg-green-100 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-300">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Teacher
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Submission Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Feedback Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Task Type
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Grade Awarded
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Total Grade
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Percentage
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Spanish Grade (out of 10)
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Teacher Notes
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                                Average Grade
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredFeedbackData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.student_name?.username || "Unknown Student"}
                                    {userInfo?.user_type === 'student' && (
                                        <span className="ml-2 text-xs text-gray-500">
                                            {item.student_name?.username === userInfo.username ? '(Sent)' : '(Received)'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.send_to?.username || "Unknown Teacher"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.submission_date ? new Date(item.submission_date).toLocaleDateString() : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.feedback_date ? new Date(item.feedback_date).toLocaleDateString() : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.task_type || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-900">
                                    {item.grade_awarded || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.grade_total || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.grade_percent ? `${item.grade_percent}%` : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {calculateSpanishGrade(item.grade_percent)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-[200px]">
                                    {item.teacher_notes || "No notes"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {index === filteredFeedbackData.length - 1 ? calculateAverageGrade() : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GradeSummary;
