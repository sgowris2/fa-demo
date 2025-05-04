import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Answer {
    is_correct: boolean;
    correct_answer: string;
    ques_no: number;
    formatted_question: string;
    answer: string;
    mistake_details: {
        type: 'conceptual' | 'skill' | 'calculation' | 'memory' | 'careless' | null;
        misconception: string | null;
        remediation_options: string[];
    };
}

const AnswerCard = ({ answer }: { answer: Answer }) => {
    const [expanded, setExpanded] = useState(false);
    const mistakeTypeColors = {
        conceptual: '#F87171',  // red-400
        skill: '#FB923C',   // orange-400
        calculation: '#FBBF24', // yellow-400
        memory: '#34D399',    // green-400
        careless: '#A78BFA',     // purple-400
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setExpanded(!expanded)}
            className="w-full"
        >
            <View className="flex-col bg-white px-4 py-3 rounded-lg mb-2">
                {/* Top row */}
                {!expanded && (
                    <View className="flex-row items-center justify-between">
                        <View className="w-1/4 flex-row items-center">
                            <Ionicons
                                name={answer.is_correct ? 'checkmark-circle' : 'close-circle'}
                                size={24}
                                color={answer.is_correct ? 'green' : 'red'}
                            />
                            <Text numberOfLines={1}
                                ellipsizeMode="tail" className="text-xl ml-4 font-bold text-gray-800">
                                Q{answer.ques_no}
                            </Text>
                        </View>
                        {/* Answer summary */}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="w-1/2 text-lg text-gray-400 mx-4"
                        >

                            <Text className="text-lg text-gray-800"> {answer.answer} </Text>
                        </Text>
                        <Ionicons
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="gray"
                            className="ml-auto"
                        />
                    </View>
                )}

                {/* Expanded content */}
                {expanded && (
                    <View className="">
                        <View className="flex-row w-full items-center justify-between">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={answer.is_correct ? 'checkmark-circle' : 'close-circle'}
                                    size={24}
                                    color={answer.is_correct ? 'green' : 'red'}
                                />
                                <Text numberOfLines={1}
                                    ellipsizeMode="tail" className="text-xl ml-4 font-bold text-gray-800">
                                    Q{answer.ques_no}
                                </Text>
                            </View>
                            <View className="flex-row items-center justify-right">
                                <Ionicons
                                    name={expanded ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="gray"
                                    className=""
                                />
                            </View>
                        </View>
                        <View className="mt-4">
                            <Text className="text-lg text-gray-900 my-2">
                                <Text>{answer.formatted_question}</Text>
                            </Text>
                            <Text className="text-lg text-gray-900 my-2">
                                <Text className="font-semibold">Student Answer: </Text>
                                <Text>{answer.answer}</Text>
                            </Text>
                            <View>
                                {!answer.is_correct && (
                                    <View>
                                        <Text className="text-lg text-gray-900 my-2">
                                            <Text className="font-semibold">Correct Answer: </Text>
                                            <Text>{answer.correct_answer}</Text>
                                        </Text>

                                        <View className="">
                                            <View className=''>
                                                <View className='flex-row items-center my-2'>
                                                    <Text className='font-semibold text-lg text-gray-900'>Mistake Type: </Text>
                                                    <Text style={{
                                                        backgroundColor: mistakeTypeColors[answer.mistake_details.type] || '#E5E7EB', // gray-200 default
                                                        padding: 6,
                                                        borderRadius: 4,
                                                        marginHorizontal: 4
                                                    }}>
                                                        {answer.mistake_details.type.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <Text className="text-lg text-gray-900 my-2">
                                                    <Text className='font-semibold'>Misconception: </Text>
                                                    <Text>{answer.mistake_details.misconception}</Text>
                                                </Text>

                                                <Text className="text-lg font-semibold text-gray-900 mt-2 mb-1">Suggestions:</Text>
                                                {answer.mistake_details.remediation_options.map((ro, index) => (
                                                    <View key={index} className='flex-row items-center'>
                                                        <Text>-</Text>
                                                        <Text className='ml-4 my-2 text-lg'>{ro}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                )}
            </View>
        </TouchableOpacity>
    );
};

export default AnswerCard;
