import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import LearningObjectiveCard from '@/components/LearningObjectiveCard';
import AnswerCard from '@/components/AnswerCard';

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
        mastery_score: 64,
        learning_objectives: [],
        questions: []
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
        mastery_score: 57,
        learning_objectives: [],
        questions: []
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
        mastery_score: 80,
        learning_objectives: [],
        questions: []
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
        mastery_score: 71,
        learning_objectives: [],
        questions: []
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
        mastery_score: 84,
        learning_objectives: [],
        questions: []
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
        mastery_score: 95,
        learning_objectives: [],
        questions: []
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
        mastery_score: 71,
        learning_objectives: [],
        questions: []
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
                title: 'Methods of measuring time',
                description: 'Describe and compare traditional and modern methods of measuring time, such as sundials, water clocks, pendulum clocks, quartz clocks, and atomic clocks, and explain their historical development.',
                mastery_score: 100
            },
            {
                key: 'LO-2',
                title: 'Measure pendulum time periods, test length and mass effects',
                description: "Conduct simple experiments with a pendulum to measure its time period, and investigate how changing the length of the pendulum affects its oscillations while concluding that mass does not influence the time period.",
                mastery_score: 85
            },
            {
                key: 'LO-3',
                title: 'Oscillatory motion concept',
                description: "Explain the concept of oscillatory motion with examples like simple pendulums, and differentiate between periodic and non-periodic motions.",
                mastery_score: 90
            },
            {
                key: 'LO-4',
                title: 'Concept of speed and uniform motion calculations',
                description: "Apply the concept of speed by relating distance covered and time taken, and use the formula for speed (speed = distance ÷ time) to solve basic real-life problems involving uniform motion.",
                mastery_score: 80
            },
            {
                key: 'LO-5',
                title: 'SI units and conventions of time and speed',
                description: "Recognize the SI units of time and speed, correctly use them in context (seconds, minutes, hours for time; metres per second for speed), and follow conventions for writing units properly.",
                mastery_score: 100
            }
        ],
        questions: [
            {
                "ques_no": 1,
                "formatted_question": "Imagine you're designing a pendulum clock. Would increasing the mass of the bob make the clock run faster, slower, or stay the same? Explain your reasoning.",
                "answer": "The clock would run faster because the pendullum would swing faster due to the increased mass.",
                "is_correct": false,
                "correct_answer": "The clock would run at the same speed because the time period of a pendulum does not depend on its mass.",
                "concept_tested": "Mass does not affect time period",
                "mistake_details": {
                    "misconception": "Heavier bobs swing faster",
                    "remediation_options": ["Clarify that pendulum period depends only on length and gravity", "Demonstrate using pendulums of different masses"],
                    "type": "conceptual" as "conceptual" | "skill" | "calculation" | "memory" | "careless"
                }
            },
            {
                "ques_no": 2,
                "formatted_question": "Which of the following motions is an example of an oscillation?\nA. A pendulum swinging back and forth\nB. A car driving around a circular track repeatedly\nC. The Earth orbiting the Sun\nD. A person jogging back and forth across a field",
                "answer": "A, B",
                "is_correct": false,
                "correct_answer": "A",
                "concept_tested": "Oscillatory motion definition",
                "mistake_details": {
                    "misconception": "All repeated motions are oscillations",
                    "remediation_options": ["Define oscillatory motion clearly", "Compare examples of oscillation vs circular motion"],
                    "type": "conceptual" as "conceptual" | "skill" | "calculation" | "memory" | "careless"
                }
            },
            {
                "ques_no": 3,
                "formatted_question": "A student measures the time for 20 swings of a pendulum and divides the total time by 20. What are they trying to find, and why is this method useful?",
                "answer": "They are finding the time period of the pendulum. This method reduces errors that come from trying to time a single swing.",
                "is_correct": true,
                "correct_answer": "They are finding the time period of the pendulum. This method reduces errors that come from trying to time a single swing.",
                "concept_tested": "Time period calculation",
                "mistake_details": {
                    "misconception": null,
                    "remediation_options": [],
                    "type": null as "conceptual" | "skill" | "calculation" | "memory" | "careless" | null
                }
            },
            {
                "ques_no": 4,
                "formatted_question": "True or False: A heavier pendulum bob swings faster because gravity pulls it down harder.",
                "answer": "False",
                "is_correct": true,
                "correct_answer": "False",
                "concept_tested": "Mass does not affect time period",
                "mistake_details": {
                    "misconception": null,
                    "remediation_options": [],
                    "type": null as "conceptual" | "skill" | "calculation" | "memory" | "careless" | null
                }
            },
            {
                "ques_no": 5,
                "formatted_question": "You increase the length of the string in your pendulum setup. What happens to the time period and why?",
                "answer": "The time period increases because the pendulum has to travel a longer path, which takes more time.",
                "is_correct": true,
                "correct_answer": "The time period increases because the pendulum has to travel a longer path, which takes more time.",
                "concept_tested": "Length affects time period",
                "mistake_details": {
                    "misconception": null,
                    "remediation_options": [],
                    "type": null as "conceptual" | "skill" | "calculation" | "memory" | "careless" | null
                }
            },
            {
                "ques_no": 6,
                "formatted_question": "Which of the following best explains why we measure multiple oscillations instead of just one?\nA. Because it makes the pendulum swing more accurately\nB. Because it helps cancel out small timing errors in measurement\nC. Because it’s more fun to watch it swing many times\nD. Because more oscillations means less gravity resistance",
                "answer": "B",
                "is_correct": true,
                "correct_answer": "B",
                "concept_tested": "Time period measurement method",
                "mistake_details": {
                    "misconception": null,
                    "remediation_options": [],
                    "type": null as "conceptual" | "skill" | "calculation" | "memory" | "careless" | null
                }
            },
            {
                "ques_no": 7,
                "formatted_question": "A student says: 'The pendulum keeps swinging forever unless something stops it.' What would you say to help them understand what actually happens?",
                "answer": "I would explain that friction and air resistance slow the pendulum down over time, so it eventually stops.",
                "is_correct": true,
                "correct_answer": "I would explain that friction and air resistance slow the pendulum down over time, so it eventually stops.",
                "concept_tested": "Pendulum energy and damping",
                "mistake_details": {
                    "misconception": null,
                    "remediation_options": [],
                    "type": null as "conceptual" | "skill" | "calculation" | "memory" | "careless" | null
                }
            }
        ],
        insights: {
            focus_areas: ['', ''],
            highlights: ['', '', '']
        }
    }
];

export default function StudentChapterDashboard() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const dashboard = mockDashboardsList.find((item) => item.id === parseInt(id as string, 10));

    if (!dashboard) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 px-4 py-6">
                <Text className="text-xl font-bold text-gray-800">Chapter Not Found</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/screens/dashboards')}
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white text-lg font-semibold text-center p-4">Back to Subject Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { student_name, student_id, grade, section, subject, chapter_id, chapter_name, date, mastery_score, learning_objectives, questions } = dashboard;

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#f8f8f8', height: 80 },
                    headerTitle: () => (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-lg font-bold text-gray-800">Chapter Progress</Text>
                        </View>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity className="ml-4" onPress={() => router.push('/(tabs)/screens/dashboards')}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 bg-gray-100 px-6 py-6 mb-24">
                <View className='flex-row items-center justify-between px-4 mb-8'>
                    <View className='pr-4' style={{ width: '65%' }}>
                        <Text className='text-2xl font-semibold'>{student_name} ({grade}{section})</Text>
                        <Text className='text-xl'>{subject}</Text>
                        <Text className='text-xl underline font-semibold mt-4'>Chapter {chapter_id}</Text>
                        <Text className='text-xl font-semibold'>{chapter_name}</Text>
                    </View>
                    <View style={{ width: '35%' }}>
                        <View className="items-center justify-center pl-4">
                            <CircularProgress
                                value={mastery_score}
                                radius={50}
                                maxValue={100}
                                inActiveStrokeColor={'#d3d3d3'}
                                inActiveStrokeWidth={15}
                                activeStrokeWidth={15}
                                activeStrokeColor={
                                    mastery_score < 40
                                        ? '#ff0000'
                                        : mastery_score < 60
                                            ? '#ff8000'
                                            : mastery_score < 80
                                                ? '#f8f000'
                                                : mastery_score < 90
                                                    ? '#0fff40'
                                                    : 'green'
                                }
                                inActiveStrokeOpacity={0.2}
                                progressValueColor={'#000'}
                                valueSuffix='%'
                            />
                        </View>
                    </View>
                </View>

                <View className="my-4">
                    <Text className="text-xl mb-6 text-center font-bold text-gray-800">Learning Objectives Summary</Text>
                    <FlatList data={dashboard.learning_objectives}
                        keyExtractor={(item) => item.key}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <LearningObjectiveCard lo={item} />
                        )
                        }>
                    </FlatList>
                </View>

                <View className="my-4">
                    <Text className="text-xl mb-6 text-center font-bold text-gray-800">Questions & Responses</Text>
                    <FlatList data={dashboard.questions}
                        keyExtractor={(item) => item.ques_no.toString()}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <AnswerCard answer={item} />
                        )
                        }>
                    </FlatList>
                </View>

            </ScrollView>
        </>
    );
}
