import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function QuizzesScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState({ grade: '', class: '', subject: '' });
  const [sortByDate, setSortByDate] = useState(true);

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
    { label: '7th', value: '7' },
    { label: '8th', value: '8' },
  ];
  const classItems = [
    { label: 'All', value: '' },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'B' },
    { label: 'D', value: 'B' },
  ];
  const subjectItems = [
    { label: 'All', value: '' },
    { label: 'Maths', value: 'Math' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'History', value: 'History' },
    { label: 'Geography', value: 'Geography' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Kannada', value: 'Kannada' },
  ];

  const mockQuizzes = [
    {
      id: 1,
      title: 'Fractions Quiz 1',
      date: '2025-04-20',
      grade: '4',
      class: 'A',
      subject: 'Maths',
      averageScore: 81,
      studentsAttempted: 35,
    },
    {
      id: 2,
      title: 'Fractions Quiz 1',
      date: '2025-04-20',
      grade: '4',
      class: 'B',
      subject: 'Maths',
      averageScore: 67,
      studentsAttempted: 35,
    },
    {
      id: 3,
      title: 'Fractions Quiz 1',
      date: '2025-04-20',
      grade: '4',
      class: 'C',
      subject: 'Maths',
      averageScore: 48,
      studentsAttempted: 35,
    },
    {
      id: 4,
      title: 'Time & Measurement Quiz 1',
      date: '2025-04-18',
      grade: '7',
      class: 'A',
      subject: 'Science',
      averageScore: 82,
      studentsAttempted: 28,
    },
    {
      id: 5,
      title: 'Time & Measurement Quiz 1',
      date: '2025-04-18',
      grade: '7',
      class: 'B',
      subject: 'Science',
      averageScore: 69,
      studentsAttempted: 26,
    },
    {
      id: 6,
      title: 'Work & Energy Quiz 1',
      date: '2025-04-15',
      grade: '7',
      class: 'A',
      subject: 'Science',
      averageScore: 91,
      studentsAttempted: 29,
    },
  ];

  const [quizzes, setQuizzes] = useState(mockQuizzes);

  useEffect(() => {
    setFilters({ grade: gradeValue || '', class: classValue || '', subject: subjectValue || '' });
  }, [gradeValue, classValue, subjectValue]);

  const filteredQuizzes = quizzes.filter((quiz) => {
    return (
      (!filters.grade || quiz.grade === filters.grade) &&
      (!filters.class || quiz.class === filters.class) &&
      (!filters.subject || quiz.subject.toLowerCase().includes(filters.subject.toLowerCase()))
    );
  });

  const sortedQuizzes = sortByDate
    ? [...filteredQuizzes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [...filteredQuizzes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sortedQuizzesMemo = useMemo(() => sortedQuizzes, [sortedQuizzes]);

  return (
    <View className="flex-1 bg-gray-100 px-4 py-6">
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

      {/* Quizzes List */}
      <FlatList
        data={sortedQuizzesMemo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/screens/quizzes/[id]', params: { id: item.id } })} // Navigate to the dynamic route
            className="bg-white px-4 py-6 rounded-lg shadow-sm mb-4 border border-gray-300"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800">{item.title} ({item.grade}{item.class})</Text>
                <Text className="text-lg text-gray-600">{item.date}</Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="people-outline" size={22} color="gray" />
                  <Text className="text-lg text-gray-600 ml-2">
                    Students: {item.studentsAttempted}
                  </Text>
                </View>
              </View>

              {/* Right Section: Circular Progress */}
              <View className="items-center">
                <CircularProgress
                  value={item.averageScore}
                  radius={35}
                  maxValue={100}
                  inActiveStrokeColor={'#d3d3d3'}
                  inActiveStrokeWidth={15}
                  activeStrokeWidth={15}
                  activeStrokeColor={
                    item.averageScore < 40
                        ? '#ff0000'
                        : item.averageScore < 60
                            ? '#ff8000'
                            : item.averageScore < 80
                                ? '#f8f000'
                                : item.averageScore < 90
                                ? '#0fff40' 
                                :'green'
                }
                  inActiveStrokeOpacity={0.2}
                  progressValueColor={'#000'}
                  title='Avg'
                  titleColor='black'
                  titleFontSize={14}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-600 mt-4">No worksheets found.</Text>
        }
      />
    </View>
  );
}