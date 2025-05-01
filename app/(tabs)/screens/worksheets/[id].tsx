import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { BarChart, PieChart } from "react-native-gifted-charts";

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

const learningObjectives = [
    {
        id: 1,
        title: '2-digit carry-over addition',
        description: 'Student understands the concept of carrying-over while doing addition sums and is able to apply it while solving problems.',
        pieData: [
            { value: 4, color: 'red' },
            { value: 16, color: 'yellow' },
            { value: 3, color: 'green' }
        ]
    },
    {
        id: 2,
        title: '2-digit carry-over addition',
        description: 'Student understands the concept of carrying-over while doing addition sums and is able to apply it while solving problems.',
        pieData: [
            { value: 8, color: 'red' },
            { value: 8, color: 'yellow' },
            { value: 7, color: 'green' }
        ]
    },
    {
        id: 3,
        title: '2-digit carry-over addition',
        description: 'Student understands the concept of carrying-over while doing addition sums and is able to apply it while solving problems.',
        pieData: [
            { value: 10, color: 'red' },
            { value: 10, color: 'yellow' },
            { value: 3, color: 'green' }
        ]
    }
];

const responsePercentages = [
    {
        id: 1,
        question: "56 + 89",
        answer: "145",
        pieData: [
            { value: 30, color: 'red' },
            { value: 70, color: 'green' }
        ]
    },
    {
        id: 2,
        question: "56 + 89",
        answer: "145",
        pieData: [
            { value: 30, color: 'red' },
            { value: 70, color: 'green' }
        ]
    },
    {
        id: 3,
        question: "56 + 89",
        answer: "145",
        pieData: [
            { value: 30, color: 'red' },
            { value: 70, color: 'green' }
        ]
    },
    {
        id: 4,
        question: "56 + 89",
        answer: "145",
        pieData: [
            { value: 30, color: 'red' },
            { value: 70, color: 'green' }
        ]
    }
];

const barData = [
    { value: 2, label: '0-39', frontColor: '#ff0000', topLabelComponent: () => (<Text className='my-2'>2</Text>) },
    { value: 5, label: '40-59', frontColor: '#ff8000', topLabelComponent: () => (<Text className='my-2'>5</Text>) },
    { value: 7, label: '60-79', frontColor: '#f8f000', topLabelComponent: () => (<Text className='my-2'>7</Text>) },
    { value: 3, label: '80-89', frontColor: '#0fff40', topLabelComponent: () => (<Text className='my-2'>3</Text>) },
    { value: 6, label: '90-100', frontColor: 'green', topLabelComponent: () => (<Text className='my-2'>6</Text>) },
];

export default function WorksheetDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Find the worksheet by ID
    const worksheet = mockWorksheets.find((item) => item.id === parseInt(id as string, 10));

    if (!worksheet) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 px-4 py-6">
                <Text className="text-xl font-bold text-gray-800">Worksheet Not Found</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/screens/worksheets')}
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white text-center">Back to Worksheets</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { title, date, grade, class: worksheetClass, subject, studentsAttempted, averageScore } = worksheet;
    const classSize = 30; // Example class size, you can replace it with actual data

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#f8f8f8', height: 80 },
                    headerTitle: () => (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-lg font-bold text-gray-800">{title} ({grade}{worksheetClass})</Text>
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
                        <Text className="text-xl font-bold text-gray-800">Class Summary</Text>
                        <Text className="mt-2 mb-4">Overall, the class was able to master the main concepts of the worksheets including advanced concepts that most students tend to find challenging at the beginning. There are 4 students who were not able to master more than 1 learning objective. This is an area of focus.</Text>
                        <View className="flex-row items-center mx-4 my-8">
                            <CircularProgress
                                value={averageScore}
                                radius={60}
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
                                title='Average Score'
                                titleStyle={{ fontSize: 12, color: '#000' }}
                            />
                            <View className="flex-1 items-center justify-center ml-8">
                                <Text className="text-xl font-semibold text-gray-800 text-center">Students Submitted</Text>
                                <Text className="text-4xl font-bold text-gray-600 my-4">{studentsAttempted} / {classSize}</Text>
                            </View>
                        </View>
                        <View className='mb-8'>
                            <Text className="text-lg font-semibold text-gray-800">Score Distribution</Text>
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
                        <Text className="text-xl font-bold text-gray-800">Learning Objectives Summary</Text>
                        <View className="mt-4">
                            <View className="flex-row items-center justify-center mt-2 mb-4">
                                <View className="flex-row items-center justify-center mx-2 ">
                                    <View style={{ width: 20, height: 20, marginRight: 5, borderRadius: 4, backgroundColor: "red" }} />
                                    <Text>Basic</Text>
                                </View>
                                <View className="flex-row items-center justify-center mx-2">
                                    <View style={{ width: 20, height: 20, marginRight: 5, borderRadius: 4, backgroundColor: "yellow" }} />
                                    <Text>Intermediate</Text>
                                </View>
                                <View className="flex-row items-center justify-center mx-2">
                                    <View style={{ width: 20, height: 20, marginRight: 5, borderRadius: 4, backgroundColor: "green" }} />
                                    <Text>Advanced</Text>
                                </View>
                            </View>
                            <FlatList
                                data={learningObjectives}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View className="flex-row items-center mx-2 my-4">
                                        <View className="w-1/2 mr-2">
                                            <Text className='text-xl font-semibold'>{item.title}</Text>
                                            <Text className="text-lg">{item.description}</Text>
                                        </View>
                                        <View className='w-1/2 items-center justify-center'>
                                            <Text className="text-center"># Students By Achievement Level</Text>
                                            <PieChart
                                                data={item.pieData}
                                                radius={60}
                                                focusOnPress
                                                showText
                                                textColor="black"
                                                textSize={20}
                                                showValuesAsLabels
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    <View className="bg-white px-4 pt-4 rounded-lg shadow-md mb-4 border border-gray-300">
                        <Text className="text-xl font-bold text-gray-800">Responses Summary</Text>
                        <View className="mt-4">
                            <FlatList
                                data={responsePercentages}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View className="flex-row items-center mx-2 my-4">
                                        <View className="w-1/2 mr-2">
                                            <Text className='text-xl font-semibold'>{item.id}. {item.question}</Text>
                                            <Text className="text-lg">Answer: {item.answer}</Text>
                                        </View>
                                        <View className='w-1/2 items-center justify-center'>
                                            <Text className="text-center mb-2">% Correct Responses</Text>
                                            <PieChart
                                                donut
                                                radius={40}
                                                innerRadius={25}
                                                data={item.pieData}
                                                centerLabelComponent={() => {
                                                    return <Text style={{ fontSize: 22 }}>70%</Text>;
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}