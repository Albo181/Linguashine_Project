import React, { useEffect, useState } from "react";

const GradeSummary = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [filterType, setFilterType] = useState("");

    // Fetch feedback data from the backend
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch("/api/grade-summary/");
                if (!response.ok) throw new Error("Failed to fetch feedback data");
                const data = await response.json();
                setFeedbackData(data);

                // Extract unique students for dropdown
                const uniqueStudents = [...new Set(data.map(item => item.send_to?.username || "Unknown Student"))];
                setStudents(uniqueStudents);
                setSelectedStudent(uniqueStudents[0] || "");
            } catch (error) {
                console.error("Error fetching feedback data:", error);
            }
        };
        fetchFeedback();
    }, []);

    // Filter data by selected student
    const filteredFeedbackData = feedbackData
        .filter(item => item.send_to?.username === selectedStudent)
        .sort((a, b) => {
            switch (filterType) {
                case "Date (Newest to Oldest)":
                    return new Date(b.submission_date) - new Date(a.submission_date);
                case "Date (Oldest to Newest)":
                    return new Date(a.submission_date) - new Date(b.submission_date);
                case "Spanish Grade":
                    return b.grade_percent - a.grade_percent;
                case "Grade Awarded":
                    return b.grade_awarded - a.grade_awarded;
                case "Teacher Name":
                    return a.student_name?.username.localeCompare(b.student_name?.username);
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
                    Select Student:
                </label>
                <select
                    id="studentSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    {students.map((student, index) => (
                        <option key={index} value={student}>
                            {student}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-green-100 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-300">
                        <tr>
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
                    <tbody className="bg-gray divide-y divide-gray-200">
                        {filteredFeedbackData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.student_name?.username || "Unknown Teacher"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {new Date(item.submission_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {new Date(item.feedback_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.task_type}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-900">
                                    {item.grade_awarded || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-900">
                                    /{item.grade_total || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.grade_percent?.toFixed(2) || "-"}
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
