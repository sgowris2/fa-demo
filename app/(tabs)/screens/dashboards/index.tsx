import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';

const mockChaptersList = [
  {
    id: 1,
    title: 'Chapter 1',
    description: 'A Fish Tail',
    date: '2025-04-20',
    grade: '5',
    class: 'A',
    subject: 'EVS',
    averageScore: 85,
    studentsAttempted: 25,
    studentsInFocus: 2
  },
  {
    id: 2,
    title: 'Chapter 2',
    description: 'A Fish Tail',
    date: '2025-04-20',
    grade: '5',
    class: 'B',
    subject: 'EVS',
    averageScore: 85,
    studentsAttempted: 25,
    studentsInFocus: 2
  },
  {
    id: 3,
    title: 'Chapter 3',
    description: 'A Fish Tail',
    date: '2025-04-20',
    grade: '5',
    class: 'C',
    subject: 'EVS',
    averageScore: 85,
    studentsAttempted: 25,
    studentsInFocus: 2
  },
];

export default function DashboardsScreen() {
  const [chapters, setChapters] = useState(mockChaptersList);
  const router = useRouter();
  const [filters, setFilters] = useState({ grade: '', class: '', subject: '' });
  const [sortByDate, setSortByDate] = useState(false);

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
    { label: 'C', value: 'C' },
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
  const filteredChapters = chapters.filter((chapter) => {
    return (
      (!filters.grade || chapter.grade === filters.grade) &&
      (!filters.class || chapter.class === filters.class) &&
      (!filters.subject || chapter.subject.toLowerCase().includes(filters.subject.toLowerCase()))
    );
  });

  const sortedChapters = sortByDate
    ? [...filteredChapters].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [...filteredChapters].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sortedChaptersMemo = useMemo(() => sortedChapters, [sortedChapters]);

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

      {/* Chapters List */}
      <FlatList
        data={sortedChaptersMemo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/screens/dashboards/[id]', params: { id: item.id } })} // Navigate to the dynamic route
            className="bg-white px-4 py-6 rounded-lg shadow-sm mb-4 border border-gray-200"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <View className="">
                  <Text className="text-md font-semibold text-gray-800">{item.title}</Text>
                  <Text className="text-lg font-bold text-gray-800">{item.description}</Text>
                  <Text className="text-lg text-gray-600">
                    Class {item.grade}{item.class} - {item.date}
                  </Text>
                </View>
              </View>

              <View className="items-center justify-center mx-4">
                <View className="flex-row">
                  <Ionicons name="alert-circle-outline" size={24} color="red" />
                  <Text className="text-2xl font-bold px-2">{item.studentsInFocus}</Text>
                </View>
                <View className="text-center">
                  <Text className="text-sm text-center text-gray-600">Students</Text>
                  <Text className="text-sm text-center text-gray-600">In Focus</Text>
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
                    item.averageScore < 40
                      ? '#ff0000'
                      : item.averageScore < 60
                        ? '#ff8000'
                        : item.averageScore < 80
                          ? '#f8f000'
                          : item.averageScore < 90
                            ? '#0fff40'
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
          <Text className="text-center text-gray-600 mt-4">No chapters found.</Text>
        }
      />
    </View>
  );
}