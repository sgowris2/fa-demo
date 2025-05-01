import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { BarChart, PieChart } from "react-native-gifted-charts";
import ProgressBar from "react-native-progress-bar-horizontal"

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
        studentsInFocus: 2,
        learningObjectives: [
            {
                id: 1,
                key: "LO-1",
                description: "Some learning objective description that is somewhat long and spans two or three sentences and takes up quite a lot of space on the screen.",
                class_average_score: 45
            },
            {
                id: 2,
                key: "LO-2",
                description: "Some learning objective description",
                class_average_score: 54
            },
            {
                id: 3,
                key: "LO-3",
                description: "Some learning objective description",
                class_average_score: 78
            },
            {
                id: 4,
                key: "LO-4",
                description: "Some learning objective description",
                class_average_score: 96
            }
        ],
        students: [
            {
                id: 1,
                name: "Bintu Balasubraminiam",
                learningObjectives: [
                    {
                        id: 1,
                        key: "LO-1",
                        description: "",
                        last5_score: 1,
                        out_of: 3,
                        percent: 33,
                        responses: [
                            {
                                question: "145 + 145",
                                answer: "290",
                                correct_answer: "290",
                                is_correct: true,
                                difficulty_level: "basic"
                            },
                            {
                                question: "145 + 145",
                                answer: "390",
                                correct_answer: "290",
                                is_correct: false,
                                difficulty_level: "basic"
                            },
                            {
                                question: "145 + 45",
                                answer: "190",
                                correct_answer: "290",
                                is_correct: false,
                                difficulty_level: "basic"
                            },
                            {
                                question: "1500 + 1450",
                                answer: "1645",
                                correct_answer: "2900",
                                is_correct: false,
                                difficulty_level: "intermediate"
                            },
                            {
                                question: "145 + 145",
                                answer: "290",
                                correct_answer: "290",
                                is_correct: true,
                                difficulty_level: "basic"
                            }
                        ]
                    },
                    {
                        id: 2,
                        key: "LO-2",
                        description: "Some description of the LO",
                        last5_score: 1,
                        out_of: 3,
                        percent: 33,
                        responses: [
                            {
                                question: "145 + 145",
                                answer: "290",
                                correct_answer: "290",
                                is_correct: true,
                                difficulty_level: "basic"
                            },
                            {
                                question: "145 + 145",
                                answer: "390",
                                correct_answer: "290",
                                is_correct: false,
                                difficulty_level: "basic"
                            },
                            {
                                question: "145 + 45",
                                answer: "190",
                                correct_answer: "290",
                                is_correct: false,
                                difficulty_level: "basic"
                            },
                            {
                                question: "1500 + 1450",
                                answer: "1645",
                                correct_answer: "2900",
                                is_correct: false,
                                difficulty_level: "intermediate"
                            },
                            {
                                question: "145 + 145",
                                answer: "290",
                                correct_answer: "290",
                                is_correct: true,
                                difficulty_level: "basic"
                            }
                        ]
                    },
                    {
                        id: 3,
                        key: "LO-3",
                        description: "Some description of the LO",
                        last5_score: 1.5,
                        out_of: 3,
                        percent: 50,
                        responses: [
                            {
                                question: "145 + 145",
                                answer: "290",
                                correct_answer: "290",
                                is_correct: true,
                                difficulty_level: "basic"
                            },
                            {
                                question: "145 + 145",
                                answer: "390",
                                correct_answer: "290",
                                is_correct: false,
                                difficulty_level: "basic"
                            },
                            {
                                question: "145 + 45",
                                answer: "190",
                                correct_answer: "290",
                                is_correct: false,
                                difficulty_level: "basic"
                            },
                            {
                                question: "1500 + 1450",
                                answer: "1645",
                                correct_answer: "2900",
                                is_correct: false,
                                difficulty_level: "intermediate"
                            },
                            {
                                question: "145 + 145",
                                answer: "290",
                                correct_answer: "290",
                                is_correct: true,
                                difficulty_level: "basic"
                            }
                        ]
                    }
                ],
                overall_score: 5,
                out_of: 10,
                percent: 50
            }
        ]
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
        studentsInFocus: 2,
        learningObjectives: [
            {
                id: 1,
                key: "LO-1",
                description: "Some learning objective description",
                class_average_score: 45
            },
            {
                id: 2,
                key: "LO-2",
                description: "Some learning objective description",
                class_average_score: 54
            },
            {
                id: 3,
                key: "LO-3",
                description: "Some learning objective description",
                class_average_score: 78
            },
            {
                id: 4,
                key: "LO-4",
                description: "Some learning objective description",
                class_average_score: 96
            }
        ]
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
        studentsInFocus: 2,
        learningObjectives: [
            {
                id: 1,
                key: "LO-1",
                description: "Some learning objective description",
                class_average_score: 45
            },
            {
                id: 2,
                key: "LO-2",
                description: "Some learning objective description",
                class_average_score: 54
            },
            {
                id: 3,
                key: "LO-3",
                description: "Some learning objective description",
                class_average_score: 78
            },
            {
                id: 4,
                key: "LO-4",
                description: "Some learning objective description",
                class_average_score: 96
            }
        ]
    },
];

const barData = [
    { value: 2, label: '0-39', frontColor: '#ff0000', topLabelComponent: () => (<Text className='my-2'>2</Text>) },
    { value: 5, label: '40-59', frontColor: '#ff8000', topLabelComponent: () => (<Text className='my-2'>5</Text>) },
    { value: 7, label: '60-79', frontColor: '#f8f000', topLabelComponent: () => (<Text className='my-2'>7</Text>) },
    { value: 3, label: '80-89', frontColor: '#0fff40', topLabelComponent: () => (<Text className='my-2'>3</Text>) },
    { value: 6, label: '90-100', frontColor: 'green', topLabelComponent: () => (<Text className='my-2'>6</Text>) },
];

export default function ChapterDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Find the chapter by ID
    const chapter = mockChaptersList.find((item) => item.id === parseInt(id as string, 10));

    if (!chapter) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 px-4 py-6">
                <Text className="text-xl font-bold text-gray-800">Chapter Not Found</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/screens/dashboards')}
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white text-center">Back to All Chapters</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { title, description, date, grade, class: chapterClass, subject, studentsInFocus, studentsAttempted, averageScore } = chapter;
    const classSize = 30; // Example class size, you can replace it with actual data

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#f8f8f8', height: 80 },
                    headerTitle: () => (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-lg font-bold text-gray-800">{title} - {description} ({grade}{chapterClass})</Text>
                            <Text className="text-md text-gray-600 mb-2">{date}</Text>
                        </View>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="ml-4" onPress={() => router.push('/(tabs)/screens/worksheets')}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 bg-gray-100 px-6 py-6">
                <View className="mb-24">
                    <View className="bg-white px-4 pt-4 rounded-lg shadow-md mb-4 border border-gray-300">
                        <Text className="text-xl font-bold text-gray-800">Overall Performance</Text>
                        <View className="items-center justify-center my-8">
                            <CircularProgress
                                value={averageScore}
                                radius={50}
                                maxValue={100}
                                inActiveStrokeColor={'#d3d3d3'}
                                inActiveStrokeWidth={15}
                                activeStrokeWidth={15}
                                activeStrokeColor={
                                    averageScore < 40
                                        ? '#ff0000'
                                        : averageScore < 60
                                            ? '#ff8000'
                                            : averageScore < 80
                                                ? '#f8f000'
                                                : averageScore < 90
                                                    ? '#0fff40'
                                                    : 'green'
                                }
                                inActiveStrokeOpacity={0.2}
                                progressValueColor={'#000'}
                                valueSuffix='%'
                                title='Class Avg.'
                                titleStyle={{ fontSize: 12, color: '#000' }}
                            />
                            <BarChart
                                barWidth={30}
                                yAxisExtraHeight={0}
                                labelsDistanceFromXaxis={4}
                                noOfSections={3}
                                barBorderRadius={4}
                                frontColor="lightgray"
                                data={barData}
                                hideYAxisText
                                yAxisThickness={0}
                                xAxisThickness={0}
                                hideRules={true}
                                rotateLabel={0}
                            />
                        </View>
                    </View>

                    <View className="bg-white px-4 pt-4 rounded-lg shadow-md mb-4 border border-gray-300">
                        <Text className="text-xl mb-8 font-bold text-gray-800">Learning Objectives Summary</Text>
                        <FlatList data={chapter.learningObjectives}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View className="ml-2 mb-8">
                                    <View className="flex-row items-center justify-left">
                                        <Text className="text-xl mr-8 font-bold">{item.key}</Text>
                                        <ProgressBar
                                            progress={item.class_average_score / 100}
                                            borderWidth={1}
                                            fillColor={(item.class_average_score < 40 ? "#ff0000"
                                                : item.class_average_score < 60 ? "#ff8000"
                                                    : item.class_average_score < 80 ? '#f8f000'
                                                        : item.class_average_score < 90 ? '#0fff40'
                                                            : 'green')}
                                            unfilledColor="#F0F0F0"
                                            height={15}
                                            borderColor="#888888"
                                            width={150}
                                        />
                                        <Text className="text-xl font-bold mx-4">{item.class_average_score}%</Text>
                                    </View>
                                    <Text className="text-lg">{item.description}</Text>
                                </View>
                            )
                            }>
                        </FlatList>
                    </View>
                    <View className="bg-white px-4 pt-4 py-8 rounded-lg shadow-md mb-4 border border-gray-300">
                        <Text className="text-xl font-bold text-gray-800">Students In Focus</Text>
                        <View className="mt-8 bg-white px-4 pt-4 rounded-lg mb-4 border border-gray-200">
                            <View className="flex-row items-center justify-between">
                                <FlatList
                                    data={chapter.students?.filter((student) => student.percent < 60)}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View className="flex-row items-center justify-between my-2">
                                            <View className="mb-4">
                                                <Text className="text-lg font-semibold mb-2">{item.name}</Text>
                                                <FlatList
                                                    data={item.learningObjectives.filter((obj) => (obj.percent) <= 60)}
                                                    numColumns={2}
                                                    keyExtractor={(item) => item.id.toString()}
                                                    renderItem={({ item }) => (
                                                        <View style={{ width: '35%', marginBottom: 8 }}>
                                                            <Text className="px-1 rounded-md text-center" 
                                                            style={{
                                                                backgroundColor:
                                                                    item.percent < 40
                                                                        ? '#ffcccc'
                                                                        : item.percent < 60
                                                                        ? '#ffe5b4'
                                                                        : item.percent < 80
                                                                        ? '#ffffcc'
                                                                        : item.percent < 90
                                                                        ? '#ccffcc'
                                                                        : '#b3ffb3',
                                                            }}>
                                                                {item.key}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    columnWrapperStyle={{ justifyContent: 'flex-start', gap: 8 }}
                                                />
                                            </View>
                                            <CircularProgress
                                                value={item.percent}
                                                radius={30}
                                                maxValue={100}
                                                inActiveStrokeColor={'#d3d3d3'}
                                                inActiveStrokeWidth={15}
                                                activeStrokeWidth={15}
                                                activeStrokeColor={
                                                    item.percent < 40
                                                        ? '#ff0000'
                                                        : item.percent < 60
                                                            ? '#ff8000'
                                                            : item.percent < 80
                                                                ? '#f8f000'
                                                                : item.percent < 90
                                                                    ? '#0fff40'
                                                                    : 'green'
                                                }
                                                inActiveStrokeOpacity={0.2}
                                                progressValueColor={'#000'}
                                                valueSuffix='%'
                                            />
                                        </View>
                                    )}
                                >
                                </FlatList>
                                <Ionicons name='chevron-forward-outline' size={20} className="pl-6"></Ionicons>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}