import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { BarChart } from "react-native-gifted-charts";

const mockWorksheets = [
    {
        id: 1,
        title: 'Math Worksheet 1',
        date: '2025-04-20',
        grade: '5',
        class: 'A',
        subject: 'Math',
        averageScore: 85,
        studentsAttempted: 23,
    },
    {
        id: 2,
        title: 'Science Worksheet 1',
        date: '2025-04-18',
        grade: '5',
        class: 'B',
        subject: 'Science',
        averageScore: 78,
        studentsAttempted: 23,
    },
    {
        id: 3,
        title: 'English Worksheet 1',
        date: '2025-04-15',
        grade: '6',
        class: 'A',
        subject: 'English',
        averageScore: 90,
        studentsAttempted: 23,
    },
];

const barData = [
        {value: 2, label: '0-39', frontColor: '#ff0000', topLabelComponent: () => (<Text className='my-2'>2</Text>)},
        {value: 5, label: '40-59', frontColor: '#ff8000', topLabelComponent: () => (<Text className='my-2'>5</Text>)},
        {value: 7, label: '60-79', frontColor: '#f8f000', topLabelComponent: () => (<Text className='my-2'>7</Text>)},
        {value: 3, label: '80-89', frontColor: '#0fff40', topLabelComponent: () => (<Text className='my-2'>3</Text>)},
        {value: 6, label: '90-100', frontColor: 'green', topLabelComponent: () => (<Text className='my-2'>6</Text>)},
    ];
const screenWidth = Dimensions.get('window').width;

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
                <View>
                    <View className="bg-white px-4 pt-4 rounded-lg shadow-md mb-4 border border-gray-300">
                        <Text className="text-xl font-bold text-gray-800">Class Summary</Text>
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
                                                :'green'
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
                </View>
            </ScrollView>
        </>
    );
}