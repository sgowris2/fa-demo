import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';

const mockWorksheets = [
  {
    id: 1,
    title: 'Math Worksheet 1',
    date: '2025-04-20',
    grade: '5',
    class: 'A',
    subject: 'Math',
    averageScore: 85,
    studentsAttempted: 25,
  },
  {
    id: 2,
    title: 'Science Worksheet 1',
    date: '2025-04-18',
    grade: '5',
    class: 'B',
    subject: 'Science',
    averageScore: 78,
    studentsAttempted: 20,
  },
  {
    id: 3,
    title: 'English Worksheet 1',
    date: '2025-04-15',
    grade: '6',
    class: 'A',
    subject: 'English',
    averageScore: 90,
    studentsAttempted: 30,
  },
];

export default function WorksheetsScreen() {
  const [worksheets, setWorksheets] = useState(mockWorksheets);
  const [filters, setFilters] = useState({ grade: '', class: '', subject: '' });
  const [sortByDate, setSortByDate] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState<{
    id: number;
    title: string;
    date: string;
    grade: string;
    class: string;
    subject: string;
    averageScore: number;
    studentsAttempted: number;
  } | null>(null);

  // Dropdown states
  const [openGrade, setOpenGrade] = useState(false);
  const [openClass, setOpenClass] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);

  const [gradeValue, setGradeValue] = useState('');
  const [classValue, setClassValue] = useState('');
  const [subjectValue, setSubjectValue] = useState('');

  const gradeItems = [
    { label: 'All', value: '' },
    { label: '5th', value: '5' },
    { label: '6th', value: '6' },
  ];
  const classItems = [
    { label: 'All', value: '' },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
  ];
  const subjectItems = [
    { label: 'All', value: '' },
    { label: 'Math', value: 'Math' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'EVS', value: 'EVS' },
  ];

  useEffect(() => {
    setFilters({ grade: gradeValue || '', class: classValue || '', subject: subjectValue || '' });
  }, [gradeValue, classValue, subjectValue]);

  // Filter worksheets
  const filteredWorksheets = worksheets.filter((worksheet) => {
    return (
      (!filters.grade || worksheet.grade === filters.grade) &&
      (!filters.class || worksheet.class === filters.class) &&
      (!filters.subject || worksheet.subject.toLowerCase().includes(filters.subject.toLowerCase()))
    );
  });

  const sortedWorksheets = sortByDate
    ? [...filteredWorksheets].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [...filteredWorksheets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sortedWorksheetsMemo = useMemo(() => sortedWorksheets, [sortedWorksheets]);

  // Method to fetch worksheet details by ID
  const getWorksheetDetails = (id: number) => {
    console.log('Worksheet ID:', id);
    const worksheet = mockWorksheets.find((item) => item.id === id);
    console.log('Worksheet Details:', worksheet);
    if (!worksheet) return null;
    setSelectedWorksheet(worksheet); // Update state to show details
  };

  const renderWorksheetDetails = () => {
    if (!selectedWorksheet) {
      console.log('No worksheet selected');
      return null;
    }
    const { title, date, grade, class: worksheetClass, subject, studentsAttempted, averageScore } = selectedWorksheet;
    console.log('Selected Worksheet2:', selectedWorksheet);
    return (
      <View>
        <TouchableOpacity
          onPress={() => setSelectedWorksheet(null)}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="ml-2 text-lg font-semibold">Back to Worksheets</Text>
        </TouchableOpacity>
      <View className="bg-white px-4 py-6 rounded-lg shadow-md mb-4 border border-gray-300">
        <Text className="text-xl font-bold text-gray-800 mb-2">{title}</Text>
        <Text className="text-sm text-gray-600 mb-2">{date}</Text>
        <Text className="text-sm text-gray-600">Grade {grade}, Class {worksheetClass}</Text>
        <Text className="text-sm text-gray-600 mb-2">Subject: {subject}</Text>
        <Text className="text-sm text-gray-600 mb-2">Students Attempted: {studentsAttempted}</Text>
        <Text className="text-sm text-gray-600">Average Score: {averageScore}%</Text>
        <CircularProgress
          value={averageScore}
          radius={30}
          maxValue={100}
          inActiveStrokeColor={'#d3d3d3'}
          inActiveStrokeWidth={15}
          activeStrokeWidth={15}
          activeStrokeColor={
            averageScore < 30
              ? 'red'
              : averageScore < 60
                ? 'orange'
                : averageScore < 80
                  ? 'blue'
                  : 'green'
          }
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#000'}
        />
      </View>
      </View>
    );
  };

  const renderWorksheetList = () => {
    return (
      <>
        {/* Filters */}
        <View className="mb-4 z-50">
          <View className="flex-row justify-between mb-3">
            <View style={{ width: '24%' }}>
              <Text className="ml-2 mb-1 font-semibold">Grade</Text>
              <DropDownPicker
                open={openGrade}
                setOpen={setOpenGrade}
                value={gradeValue}
                setValue={setGradeValue}
                items={gradeItems}
                placeholder="Select Grade"
                style={{ borderColor: '#ccc' }}
                dropDownContainerStyle={{ borderColor: '#ccc' }}
                placeholderStyle={{ color: '#999' }}
                textStyle={{ color: '#333' }}
              />
            </View>
            <View style={{ width: '24%' }}>
              <Text className="ml-2 mb-1 font-semibold">Section</Text>
              <DropDownPicker
                open={openClass}
                setOpen={setOpenClass}
                value={classValue}
                setValue={setClassValue}
                items={classItems}
                placeholder="Select Class"
                style={{ borderColor: '#ccc' }}
                dropDownContainerStyle={{ borderColor: '#ccc' }}
                placeholderStyle={{ color: '#999' }}
                textStyle={{ color: '#333' }}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Text className="ml-2 mb-1 font-semibold">Subject</Text>
              <DropDownPicker
                open={openSubject}
                setOpen={setOpenSubject}
                value={subjectValue}
                setValue={setSubjectValue}
                items={subjectItems}
                placeholder="Select Subject"
                style={{ borderColor: '#ccc' }}
                dropDownContainerStyle={{ borderColor: '#ccc' }}
                placeholderStyle={{ color: '#999' }}
                textStyle={{ color: '#333' }}
              />
            </View>
          </View>
        </View>

        {/* Sort Button */}
        <View className="flex-row items-center justify-center mb-4">
          <TouchableOpacity
            onPress={() => setSortByDate((prev) => !prev)}
            className="flex-row items-center justify-center w-1/2 bg-blue-600 px-4 py-2 rounded-lg shadow-md mb-4"
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              {sortByDate ? 'Sort by Oldest' : 'Sort by Newest'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Worksheets List */}
        <FlatList
          data={sortedWorksheetsMemo}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => getWorksheetDetails(item.id)}
              className="bg-white px-4 py-6 rounded-lg shadow-md mb-4 border border-gray-300"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800 mb-2">{item.title}</Text>
                  <Text className="text-sm text-gray-600 mb-2">{item.date}</Text>
                  <Text className="text-sm text-gray-600">
                    Grade {item.grade}, Class {item.class}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="people-outline" size={16} color="gray" />
                    <Text className="text-sm text-gray-600 ml-2">
                      Students: {item.studentsAttempted}
                    </Text>
                  </View>
                </View>

                {/* Right Section: Circular Progress */}
                <View className="items-center">
                  <CircularProgress
                    value={item.averageScore}
                    radius={30}
                    maxValue={100}
                    inActiveStrokeColor={'#d3d3d3'}
                    inActiveStrokeWidth={15}
                    activeStrokeWidth={15}
                    activeStrokeColor={
                      item.averageScore < 30
                        ? 'red'
                        : item.averageScore < 60
                          ? 'orange'
                          : item.averageScore < 80
                            ? 'blue'
                            : 'green'
                    }
                    inActiveStrokeOpacity={0.2}
                    progressValueColor={'#000'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-600 mt-4">No worksheets found.</Text>
          }
        />
      </>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 py-6">
      {
        selectedWorksheet ? (
          renderWorksheetDetails()
        ) : renderWorksheetList()
      }
    </View>
  );

}
