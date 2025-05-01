import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { BarChart, PieChart } from "react-native-gifted-charts";

const mockQuizResults = [
    {
        id: 1,
        title: 'Time & Measurement Quiz 1',
        grade: 7,
        section: 'A',
        date: '2025-04-18',
        subject: 'Science',
        averageScore: 82,
        studentsAttempted: 28,
        questions: [
            {
                id: 1,
                q: 'In a simple pendulum, the time period depends on:',
                options: [
                    'A) The mass of the bob',
                    'B) The length of the string',
                    'C) The colour of the bob',
                    'D) The material of the string'
                ],
                a: 'B',
                explanation: 'Only the length affects the time-period, not the mass or color or material of the string',
                responses: [
                    { name: 'Bintu B', response: 'B' },
                    { name: 'Chintu C', response: 'A' },
                    { name: 'Fintu F', response: 'B' },
                    { name: 'Jintu J', response: 'B' },
                    { name: 'Kintu K', response: 'D' },
                    { name: 'Lintu L', response: 'B' },
                    { name: 'Mintu M', response: 'B' },
                    { name: 'Pintu P', response: 'B' },
                    { name: 'Rintu R', response: 'B' },
                    { name: 'Sintu S', response: 'B' },
                    { name: 'Tintu T', response: 'B' },
                ],
                response_summary: {
                    distribution: { 'A': 1, 'B': 9, 'C': 0, 'D': 1 },
                    percent: 82,
                }
            },
            {
                id: 2,
                q: 'The SI unit of speed is:',
                options: [
                    'A) Kilometer per hour (km/h)',
                    'B) Metres per second (m/s)',
                    'C) Centimeter per second (cm/s)',
                    'D) Kilometer per second (km/s)'
                ],
                a: 'B',
                explanation: 'The standard unit for speed in the SI system is metres per second (m/s)',
                responses: [
                    { name: 'Bintu B', response: 'B' },
                    { name: 'Chintu C', response: 'B' },
                    { name: 'Fintu F', response: 'B' },
                    { name: 'Jintu J', response: 'B' },
                    { name: 'Kintu K', response: 'B' },
                    { name: 'Lintu L', response: 'B' },
                    { name: 'Mintu M', response: 'B' },
                    { name: 'Pintu P', response: 'A' },
                    { name: 'Rintu R', response: 'A' },
                    { name: 'Sintu S', response: 'A' },
                    { name: 'Tintu T', response: 'B' },
                ],
                response_summary: {
                    distribution: { 'A': 5, 'B': 8, 'C': 0, 'D': 0 },
                    percent: 55,
                }
            },
            {
                id: 3,
                q: 'Two pendulums are set up. Pendulum A has a string length of 50 cm and Pendulum B has a string length of 100 cm. Which pendulum will take more time to complete one oscillation?',
                options: [
                    'A) Pendulum A',
                    'B) Pendulum B',
                    'C) Both take the same time',
                    'D) The pendulum with the heavier bob'
                ],
                a: 'B',
                explanation: 'Longer length, the longer the time-period. Mass of the bob does not affect the time period.',
                responses: [
                    { name: 'Bintu B', response: 'A' },
                    { name: 'Chintu C', response: 'D' },
                    { name: 'Fintu F', response: 'C' },
                    { name: 'Jintu J', response: 'A' },
                    { name: 'Kintu K', response: 'B' },
                    { name: 'Lintu L', response: 'B' },
                    { name: 'Mintu M', response: 'C' },
                    { name: 'Pintu P', response: 'A' },
                    { name: 'Rintu R', response: 'D' },
                    { name: 'Sintu S', response: 'C' },
                    { name: 'Tintu T', response: 'B' },
                ],
                response_summary: {
                    distribution: { 'A': 3, 'B': 3, 'C': 3, 'D': 2 },
                    percent: 27,
                }
            },
            {
                id: 4,
                q: 'Two runners are running different distances. Runner A runs 200 meters in 40 seconds, and Runner B runs 150 meters in 30 seconds. Who is faster?',
                options: [
                    'A) Runner A',
                    'B) Runner B',
                    'C) Both are equally fast',
                    'D) Cannot be determined'
                ],
                a: 'C',
                explanation: 'Longer length, the longer the time-period. Mass of the bob does not affect the time period.',
                responses: [
                    { name: 'Bintu B', response: 'C' },
                    { name: 'Chintu C', response: 'B' },
                    { name: 'Fintu F', response: 'C' },
                    { name: 'Jintu J', response: 'A' },
                    { name: 'Kintu K', response: 'B' },
                    { name: 'Lintu L', response: 'B' },
                    { name: 'Mintu M', response: 'C' },
                    { name: 'Pintu P', response: 'A' },
                    { name: 'Rintu R', response: 'A' },
                    { name: 'Sintu S', response: 'A' },
                    { name: 'Tintu T', response: 'C' },
                ],
                response_summary: {
                    distribution: { 'A': 4, 'B': 3, 'C': 4, 'D': 0 },
                    percent: 36,
                }
            }
        ],
        learningObjectives: [
            {
                key: "LO-1",
                description: "Describe and compare traditional and modern methods of measuring time, such as sundials, water clocks, pendulum clocks, quartz clocks, and atomic clocks, and explain their historical development.",
                score: null,
                insight: "Not tested"
            },
            {
                key: "LO-2",
                description: "Conduct simple experiments with a pendulum to measure its time period, and investigate how changing the length of the pendulum affects its oscillations while concluding that mass does not influence the time period.",
                score: 55,
                insight: "Needs Revision"
            },
            {
                key: "LO-3",
                description: "Explain the concept of oscillatory motion with examples like simple pendulums, and differentiate between periodic and non-periodic motions.",
                score: null,
                insight: "Not Tested"
            },
            {
                key: "LO-4",
                description: "Apply the concept of speed by relating distance covered and time taken, and use the formula for speed (speed = distance ÷ time) to solve basic real-life problems involving uniform motion.",
                score: 36,
                insight: "Needs Revision"
            },
            {
                key: "LO-5",
                description: "Recognize the SI units of time and speed, correctly use them in context (seconds, minutes, hours for time; metres per second for speed), and follow conventions for writing units properly.",
                score: 73,
                insight: "Good"
            }
        ]
    }
]

const barData = [
    { value: 1, label: '0', frontColor: '#ff0000', topLabelComponent: () => (<Text className='my-1'>1</Text>) },
    { value: 2, label: '1', frontColor: '#ff8000', topLabelComponent: () => (<Text className='my-1'>2</Text>) },
    { value: 4, label: '2', frontColor: '#f8f000', topLabelComponent: () => (<Text className='my-1'>4</Text>) },
    { value: 3, label: '3', frontColor: '#0fff40', topLabelComponent: () => (<Text className='my-1'>3</Text>) },
    { value: 2, label: '4', frontColor: 'green', topLabelComponent: () => (<Text className='my-1'>2</Text>) },
];

const convertDistributionToBarData = (distribution: { [s: string]: unknown; } | ArrayLike<unknown>, correct_answer: string) => {
    return Object.entries(distribution).map(([key, value], index) => ({
        value: typeof value === 'number' ? value : 0,
        label: key,
        frontColor: key === correct_answer ? 'green' : 'lightgray',
        topLabelComponent: () => (<Text className=''>{String(value)}</Text>)
    }));
};

export default function QuizDetails() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Find Quiz Results by ID
    // const quiz = mockQuizzes.find((item) => item.id === parseInt(id as string, 10));
    const quiz = mockQuizResults[0]

    if (!quiz) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 px-4 py-6">
                <Text className="text-xl font-bold text-gray-800">Quiz Not Found</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/screens/worksheets')}
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white text-center">Back to Quizzes</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { title, date, grade, section, subject, studentsAttempted, averageScore, questions, learningObjectives } = quiz;

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#f8f8f8', height: 80 },
                    headerTitle: () => (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-lg font-bold text-gray-800">{title} ({grade}{section})</Text>
                            <Text className="text-md text-gray-600 mb-2">{date}</Text>
                        </View>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="ml-4" onPress={() => router.push('/(tabs)/screens/quizzes')}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 bg-gray-100 px-6 py-6">
                <View className="mb-24">
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-blue-600 mx-4 mb-8 px-6 py-4 rounded-lg shadow-md active:opacity-80"
                    >
                        <Ionicons name="documents-outline" size={24} color="white" />
                        <Text className="text-white text-xl font-semibold ml-3">
                            Generate Smart Worksheets
                        </Text>
                    </TouchableOpacity>
                    <View className="bg-white px-4 pt-4 rounded-lg shadow-md pb-4 mb-4 border border-gray-300">
                        <View> {/* Performance */}
                            <Text className="text-xl font-bold text-gray-800">Performance</Text>
                            <View className="flex-row items-center justify-between mx-8 py-2">
                                <CircularProgress
                                    value={averageScore}
                                    radius={50}
                                    maxValue={100}
                                    inActiveStrokeColor={'#d3d3d3'}
                                    inActiveStrokeWidth={20}
                                    activeStrokeWidth={20}
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
                                    title='Avg Score'
                                    titleColor='black'
                                />
                                <View className=''>
                                    <Text className="text-lg text-center font-semibold text-gray-800 mt-2">Score Distribution</Text>
                                    <BarChart
                                        barWidth={18}
                                        initialSpacing={0}
                                        spacing={6}
                                        labelsDistanceFromXaxis={0}
                                        noOfSections={5}
                                        barBorderRadius={4}
                                        frontColor="lightgray"
                                        data={barData}
                                        hideYAxisText={true}
                                        yAxisThickness={0}
                                        xAxisThickness={0}
                                        // maxValue={5}
                                        height={100}
                                        hideRules={false}
                                        rotateLabel={false}
                                    />
                                    <Text className="text-md text-center text-gray-800">Score</Text>
                                </View>
                            </View>
                        </View>
                        <View className='mb-4'> {/* Responses */}
                            <Text className="text-xl font-bold mt-4 mb-4 text-gray-800">Responses</Text>
                            <FlatList
                                data={quiz.questions}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View className='flex-row items-center justify-between mx-2 my-2 '>
                                        <View className='w-2/3'>
                                            <Text className='mb-2'>{item.id}. {item.q}</Text>
                                            <FlatList
                                                data={item.options}
                                                renderItem={({ item }) => (
                                                    <Text className=''>{item}</Text>
                                                )}
                                            />
                                        </View>
                                        <View>
                                            <BarChart
                                                barWidth={15}
                                                initialSpacing={0}
                                                spacing={6}
                                                labelsDistanceFromXaxis={0}
                                                noOfSections={5}
                                                barBorderRadius={4}
                                                frontColor="lightgray"
                                                data={convertDistributionToBarData(item.response_summary.distribution, item.a)}
                                                hideYAxisText={true}
                                                yAxisThickness={0}
                                                xAxisThickness={0}
                                                // maxValue={5}
                                                height={80}
                                                hideRules={true}
                                                rotateLabel={false}
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                        <View className="mb-4"> {/* Learning Objectives */}
                            <Text className="text-xl font-bold mt-4 mb-4 text-gray-800">Learning Objectives</Text>
                            <FlatList data={learningObjectives}
                                keyExtractor={(item) => item.key.toString()}
                                renderItem={({ item }) => (
                                    <View className='my-4'>
                                        <View className='flex-row items-center justify-between'>
                                            <View className="flex-row items-center mb-2">
                                                <Text className="text-lg font-bold mx-2">{item.key}</Text>
                                                <Text
                                                    className="text-md text-center px-2 py-1 rounded-lg mx-2"
                                                    style={{
                                                        backgroundColor:
                                                            item.score === null ? '#dddddd' :
                                                                item.score < 60 ? '#ffcccc' :
                                                                    item.score < 80 ? '#ccffcc' : '#b3ffb3'
                                                    }}>
                                                    {item.insight}
                                                </Text>
                                            </View>
                                            <Text className="text-xl font-bold w-1/5 mx-2">{item.score === null ? '' : `${item.score} %`}</Text>
                                        </View>
                                        <Text className='text-lg mx-2'>{item.description}</Text>
                                    </View>
                                )
                                }
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}