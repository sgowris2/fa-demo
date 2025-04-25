import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnswerCard = ({ answer }: { answer: any }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setExpanded(!expanded)}
            className="w-full"
        >
            <View className="flex-col bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-lg mb-2">
                {/* Top row */}
                {!expanded && (
                    <View className="flex-row items-center">
                        <View className="w-1/2 flex-row items-center">
                            <Ionicons
                                name={answer.is_correct ? 'checkmark-circle' : 'close-circle'}
                                size={24}
                                color={answer.is_correct ? 'green' : 'red'}
                                className="mr-2"
                            />
                            <Text numberOfLines={1}
                                ellipsizeMode="tail" className="text-md font-medium text-gray-800 dark:text-gray-200">
                                Question {answer.ques_no}
                            </Text>
                        </View>
                        {/* Answer summary */}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-md text-gray-600 dark:text-gray-300 mx-4"
                        >
                            {answer.answer}
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
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={answer.is_correct ? 'checkmark-circle' : 'close-circle'}
                                    size={24}
                                    color={answer.is_correct ? 'green' : 'red'}
                                    className="mr-2"
                                />
                                <Text numberOfLines={1}
                                    ellipsizeMode="tail" className="text-md font-medium text-gray-800 dark:text-gray-200">
                                    Question {answer.ques_no}
                                </Text>
                            </View>
                            <View className="w-1/2 flex-row items-center">
                                <Ionicons
                                    name={expanded ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="gray"
                                    className=""
                                />
                            </View>
                        </View>
                        <View className="mt-4">
                            <Text className="text-sm text-gray-600 dark:text-gray-300 my-1">
                                <Text className="font-semibold">Answer: </Text>
                                <Text>{answer.answer}</Text>
                            </Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-300 my-1">
                                <Text className="font-semibold">Explanation: </Text>
                                {answer.explanation}
                            </Text>
                        </View>
                    </View>

                )}
            </View>
        </TouchableOpacity>
    );
};

export default AnswerCard;
