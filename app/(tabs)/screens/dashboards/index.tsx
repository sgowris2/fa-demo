import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, ScrollView, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { BarChart } from 'react-native-gifted-charts';


const mockClassStats: {
  grade: number;
  section: string;
  subject: string;
  score_distribution: {
    value: number;
    label: string;
    frontColor: string;
    topLabelComponent: () => JSX.Element;
  }[];
  worksheet_average_scores: {
    id: number,
    score: number;
  }[];
}[] = [
    {
      grade: 7,
      section: 'A',
      subject: 'Science',
      score_distribution: [
        { value: 1, label: '0-39', frontColor: '#ff0000', topLabelComponent: () => (<Text className='my-1'>1</Text>) },
        { value: 4, label: '40-59', frontColor: '#ff8000', topLabelComponent: () => (<Text className='my-1'>4</Text>) },
        { value: 14, label: '60-79', frontColor: '#f8f000', topLabelComponent: () => (<Text className='my-1'>14</Text>) },
        { value: 8, label: '80-89', frontColor: '#0fff40', topLabelComponent: () => (<Text className='my-1'>8</Text>) },
        { value: 3, label: '90+', frontColor: 'green', topLabelComponent: () => (<Text className='my-1'>3</Text>) }
      ],
      worksheet_average_scores: [
        { id: 1, score: 60 },
        { id: 2, score: 70 },
        { id: 3, score: 73 },
        { id: 4, score: 65 },
        { id: 5, score: 80 },
        { id: 6, score: 88 },
        { id: 7, score: 85 },
        { id: 8, score: 80 },
        { id: 9, score: 75 },
        { id: 10, score: 80 },
        { id: 11, score: 84 },
        { id: 12, score: 88 },
        { id: 13, score: 82 },
        { id: 14, score: 78 },
        { id: 15, score: 83 },
      ]
    }
  ]

const mockStudentSubjectStats = [
  {
    student_id: 2,
    subject: 'Science',
    mastery_score: 77,
    worksheet_scores: [
      { id: 1, score: 63 },
      { id: 2, score: 73 },
      { id: 3, score: 53 },
      { id: 4, score: 57 },
      { id: 5, score: 75 },
      { id: 6, score: 98 },
      { id: 7, score: 85 },
      { id: 8, score: 82 },
      { id: 9, score: 77 },
      { id: 10, score: 81 },
      { id: 11, score: 78 },
      { id: 12, score: 93 },
      { id: 13, score: 85 },
      { id: 14, score: 87 },
      { id: 15, score: 96 },
    ]
  }
]

const mockDashboardsList = [
  {
    id: 1,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 1,
    chapter_name: 'The Ever-Evolving World of Science',
    date: '2025-01-01',
    mastery_score: 64
  },
  {
    id: 2,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 2,
    chapter_name: 'Exploring Substances: Acidic, Basic, and Neutral',
    date: '2025-01-14',
    mastery_score: 57
  },
  {
    id: 3,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 3,
    chapter_name: 'Electricity: Circuits and their Components',
    date: '2025-01-21',
    mastery_score: 80
  },
  {
    id: 4,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 4,
    chapter_name: 'The World of Metals & Non-metals',
    date: '2025-02-01',
    mastery_score: 71
  },
  {
    id: 5,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 5,
    chapter_name: 'Changes Around Us: Physical and Chemical',
    date: '2025-02-14',
    mastery_score: 84
  },
  {
    id: 6,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 6,
    chapter_name: 'Adolescence: A Stage of Growth and Change',
    date: '2025-02-28',
    mastery_score: 95
  },
  {
    id: 7,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 7,
    chapter_name: 'Heat Transfer In Nature',
    date: '2025-03-15',
    mastery_score: 71
  },
  {
    id: 8,
    student_id: 2,
    student_name: 'Chintu',
    grade: '7',
    section: 'A',
    subject: 'Science',
    chapter_id: 8,
    chapter_name: 'Measurement of Time and Motion',
    date: '2025-04-01',
    mastery_score: 91,
    learning_objectives: [
      {
        key: 'LO-1',
        description: 'Describe and compare traditional and modern methods of measuring time, such as sundials, water clocks, pendulum clocks, quartz clocks, and atomic clocks, and explain their historical development.',
        mastery_score: 100
      },
      {
        key: 'LO-2',
        description: 'Conduct simple experiments with a pendulum to measure its time period, and investigate how changing the length of the pendulum affects its oscillations while concluding that mass does not influence the time period.',
        mastery_score: 85
      },
      {
        key: 'LO-3',
        description: 'Explain the concept of oscillatory motion with examples like simple pendulums, and differentiate between periodic and non-periodic motions.',
        mastery_score: 90
      },
      {
        key: 'LO-4',
        description: 'Apply the concept of speed by relating distance covered and time taken, and use the formula for speed (speed = distance ÷ time) to solve basic real-life problems involving uniform motion.',
        mastery_score: 80
      },
      {
        key: 'LO-5',
        description: 'Recognize the SI units of time and speed, correctly use them in context (seconds, minutes, hours for time; metres per second for speed), and follow conventions for writing units properly.',
        mastery_score: 100
      }
    ],
    questions: [
      {
        id: 1,
        is_correct: true
      },
      {
        id: 2,
        is_correct: true
      },
      {
        id: 3,
        is_correct: false
      },
      {
        id: 4,
        is_correct: true
      },
      {
        id: 5,
        is_correct: false
      },
      {
        id: 6,
        is_correct: true
      },
      {
        id: 7,
        is_correct: true
      },
      {
        id: 8,
        is_correct: true
      },
      {
        id: 9,
        is_correct: true
      },
      {
        id: 10,
        is_correct: true
      },
      {
        id: 11,
        is_correct: false
      },
      {
        id: 12,
        is_correct: true
      }
    ],
    insights: {
      focus_areas: ['', ''],
      highlights: ['', '', '']
    }
  }
];

export default function DashboardsScreen() {
  const [dashboards, setDashboards] = useState(mockDashboardsList);
  const router = useRouter();
  const [filters, setFilters] = useState({ grade: '', section: '', subject: '', student: '' });
  const [sortByDate, setSortByDate] = useState(false);

  // Dropdown states
  const [openGrade, setOpenGrade] = useState(false);
  const [openSection, setOpenSection] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);

  const [gradeValue, setGradeValue] = useState('');
  const [sectionValue, setSectionValue] = useState('');
  const [subjectValue, setSubjectValue] = useState('');
  const [studentValue, setStudentValue] = useState('');

  const [classStats, setClassStats] = useState<{
    grade: number;
    section: string;
    subject: string;
    score_distribution: {
      value: number;
      label: string;
      frontColor: string;
      topLabelComponent: () => JSX.Element;
    }[];
    worksheet_average_scores: {
      score: number;
      label: string;
    }[];
  } | null>(null);
  const [studentStats, setStudentStats] = useState<{
    student_id: number;
    subject: string;
    mastery_score: number;
    worksheet_scores: { id: number; score: number }[];
  } | null>(null);

  const gradeItems = [
    { label: 'All', value: '' },
    { label: '5th', value: '5' },
    { label: '6th', value: '6' },
    { label: '7th', value: '7' },
    { label: '8th', value: '8' },
  ];
  const sectionItems = [
    { label: 'All', value: '' },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
  ];
  const subjectItems = [
    // { label: 'All', value: '' },
    { label: 'Math', value: 'Math' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'EVS', value: 'EVS' },
  ];
  const studentItems = [
    { label: 'Bintu', value: '1' },
    { label: 'Chintu', value: '2' },
    { label: 'Jintu', value: '3' },
    { label: 'Pintu', value: '4' },
    { label: 'Rintu', value: '5' },
  ];

  useEffect(() => {
    setFilters({ grade: gradeValue || '', section: sectionValue || '', subject: subjectValue || '', student: studentValue || '' });
  }, [gradeValue, sectionValue, subjectValue, studentValue]);

  useEffect(() => {
    const matchingClassStats = mockClassStats.find(
      (item) =>
        item.grade.toString() === gradeValue &&
        item.section === sectionValue &&
        item.subject.toLowerCase() === subjectValue.toLowerCase()
    );
    setClassStats(matchingClassStats || null);
  }, [gradeValue, sectionValue, subjectValue]);

  useEffect(() => {
    const matchingStudentStats = mockStudentSubjectStats.find(
      (item) =>
        item.student_id.toString() === studentValue &&
        item.subject.toLowerCase() === subjectValue.toLowerCase()
    );
    setStudentStats(matchingStudentStats || null); // Set the matching item or null if no match is found
  }, [studentValue, subjectValue]);

  const filteredDashboards: typeof dashboards = useMemo(() => {
    if (!filters.student || !filters.subject) {
      return []; // Return an empty list if any dropdown is not selected
    }

    return dashboards.filter((dashboard) => {
      return (
        (!filters.grade || dashboard.grade === filters.grade) &&
        (!filters.section || dashboard.section === filters.section) &&
        (!filters.subject || dashboard.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
        (!filters.student || dashboard.student_id.toString() === filters.student)
      );
    });
  }, [filters, dashboards]);

  const sortedDashboards = sortByDate
    ? [...filteredDashboards].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [...filteredDashboards].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sortedDashboardsMemo = useMemo(() => sortedDashboards, [sortedDashboards]);

  return (
    <View className="flex-1 bg-gray-100 px-4 py-4">
      {/* Filters */}
      <View className="mb-2 z-50">
        <View className="flex-row justify-between mb-2" style={{ zIndex: 5000 }}>
          <View style={{ width: '24%' }}>
            <Text className="ml-2 mb-1 font-semibold">Grade</Text>
            <DropDownPicker
              open={openGrade}
              setOpen={setOpenGrade}
              value={gradeValue}
              setValue={setGradeValue}
              items={gradeItems}
              placeholder="Select"
              style={{ borderColor: '#ccc' }}
              dropDownContainerStyle={{ borderColor: '#ccc' }}
              placeholderStyle={{ color: '#999' }}
              textStyle={{ color: '#333' }}
            />
          </View>
          <View style={{ width: '24%' }}>
            <Text className="ml-2 mb-1 font-semibold">Section</Text>
            <DropDownPicker
              open={openSection}
              setOpen={setOpenSection}
              value={sectionValue}
              setValue={setSectionValue}
              items={sectionItems}
              placeholder="Select"
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
              placeholder="Select"
              style={{ borderColor: '#ccc' }}
              dropDownContainerStyle={{ borderColor: '#ccc' }}
              placeholderStyle={{ color: '#999' }}
              textStyle={{ color: '#333' }}
            />
          </View>
        </View>
        <View className='flex-row justify-between' style={{ zIndex: 4000 }}>
          <View style={{ width: '98%' }}>
            <Text className="ml-2 mb-1 font-semibold">Student</Text>
            <DropDownPicker
              open={openStudent}
              setOpen={setOpenStudent}
              value={studentValue}
              setValue={setStudentValue}
              items={studentItems}
              placeholder="Select Student"
              style={{ borderColor: '#ccc' }}
              dropDownContainerStyle={{ borderColor: '#ccc' }}
              placeholderStyle={{ color: '#999' }}
              textStyle={{ color: '#333' }}
            />
          </View>
        </View>
      </View>

      {/* Dashboards */}
      <ScrollView className='mb-16'>
        {studentStats && (
          <View className='p-4'>
            <View className='flex-row items-center justify-between'>
              <View className='items-center justify-center'>
                <Text className="text-lg font-semibold text-gray-800">{studentItems.find((i) => (i.value == studentValue))?.label || 'Student'}'s</Text>
                <Text className="text-lg font-semibold text-gray-800 mb-2" >Mastery Score</Text>
                <CircularProgress
                  value={studentStats?.mastery_score || 0}
                  radius={50}
                  maxValue={100}
                  inActiveStrokeColor={'#d3d3d3'}
                  inActiveStrokeWidth={15}
                  activeStrokeWidth={15}
                  activeStrokeColor={
                    (studentStats?.mastery_score ?? 0) < 40
                      ? '#ff0000'
                      : (studentStats?.mastery_score ?? 0) < 60
                        ? '#ff8000'
                        : (studentStats?.mastery_score ?? 0) < 80
                          ? '#f8f000'
                          : (studentStats?.mastery_score ?? 0) < 90
                            ? '#0fff40'
                            : 'green'
                  }
                  inActiveStrokeOpacity={0.2}
                  progressValueColor={'#000'}
                  valueSuffix='%'
                  title='Mastery'
                  titleColor='black'
                />
              </View>
              <View className='items-center justify-center mx-8 my-6'>
                <Text className="text-lg font-semibold text-gray-800">Class {classStats?.grade}{classStats?.section} Mastery Score</Text>
                <Text className="text-lg font-semibold text-gray-800">Distribution</Text>
                <BarChart
                  barWidth={20}
                  spacing={15}
                  height={100}
                  yAxisExtraHeight={0}
                  labelsDistanceFromXaxis={0}
                  noOfSections={3}
                  barBorderRadius={4}
                  frontColor="lightgray"
                  data={classStats?.score_distribution}
                  hideYAxisText={true}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules={true}
                  rotateLabel={true}
                />
              </View>
            </View>
            <View className='mt-8 mb-4 items-center justify-center'>
              <Text className="text-lg font-semibold text-gray-800 mb-4">Worksheet Scores</Text>
              <BarChart
                barWidth={10}
                spacing={8}
                height={100}
                yAxisExtraHeight={0}
                labelsDistanceFromXaxis={0}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={studentStats?.worksheet_scores.map((item) => ({
                  value: item.score,
                  label: `${item.id}`,
                  frontColor: item.score < 40
                    ? '#ff0000'
                    : item.score < 60
                      ? '#ff8000'
                      : item.score < 80
                        ? '#f8f000'
                        : item.score < 90
                          ? '#0fff40'
                          : 'green'
                }))}
                hideYAxisText={false}
                yAxisLabelSuffix='%'
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules={true}
                rotateLabel={false}
              />
            </View>
            <Text className='text-xl mt-4 text-center font-semibold text-gray-800'>Performance By Chapter</Text>
            <View className='items-center justify-center'>
              <Text className="ml-2 mb-1 font-semibold"></Text>
              <TouchableOpacity
                onPress={() => setSortByDate((prev) => !prev)}
                className="flex-row items-center justify-center bg-blue-600 px-4 py-4 mb-4 rounded-lg shadow-md"
              >
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-white text-lg font-semibold ml-2">
                  {sortByDate ? 'Sort by Oldest' : 'Sort by Newest'}
                </Text>
              </TouchableOpacity>
          </View>
          </View>
        )}
        <FlatList
          data={sortedDashboardsMemo}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/screens/dashboards/[id]', params: { id: item.id } })} // Navigate to the dynamic route
              className="bg-white px-4 py-4 rounded-lg shadow-sm mb-4 border border-gray-200"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <View className="">
                    <Text className="text-md font-semibold text-gray-600">Chapter {item.chapter_id}
                      <Text className='text-sm font-medium text-gray-400'>    ({item.date}) </Text>
                    </Text>
                    <Text className="text-lg font-bold text-gray-800">{item.chapter_name}</Text>
                  </View>
                </View>

                {/* Right Section: Circular Progress */}
                <View className="items-center">
                  <CircularProgress
                    value={item.mastery_score}
                    radius={30}
                    maxValue={100}
                    inActiveStrokeColor={'#d3d3d3'}
                    inActiveStrokeWidth={15}
                    activeStrokeWidth={15}
                    activeStrokeColor={
                      item.mastery_score < 40
                        ? '#ff0000'
                        : item.mastery_score < 60
                          ? '#ff8000'
                          : item.mastery_score < 80
                            ? '#f8f000'
                            : item.mastery_score < 90
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
            <Text className="text-center text-gray-600 mt-16">Select Subject & Student To View</Text>
          }
        />
      </ScrollView>
    </View>
  );
}