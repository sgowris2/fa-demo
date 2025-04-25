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
            <View className="flex-col bg-white px-4 py-3 rounded-lg mb-2">
                {/* Top row */}
                {!expanded && (
                    <View className="flex-row items-center justify-between">
                        <View className="w-1/2 flex-row items-center">
                            <Ionicons
                                name={answer.is_correct ? 'checkmark-circle' : 'close-circle'}
                                size={24}
                                color={answer.is_correct ? 'teal' : 'red'}
                                className="mr-2"
                            />
                            <Text numberOfLines={1}
                                ellipsizeMode="tail" className="text-md ml-4 font-medium text-gray-800">
                                Q-{answer.ques_no}
                            </Text>
                        </View>
                        {/* Answer summary */}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-md text-gray-400 mx-4"
                        >
                            Ans: 
                            <Text className="text-md text-gray-800 font-semibold"> {answer.answer} </Text>
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
                                    ellipsizeMode="tail" className="text-md font-medium text-gray-800">
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
                            <Text className="text-md text-gray-600 my-1">
                                <Text className="font-semibold">Answer: </Text>
                                <Text>{answer.answer}</Text>
                            </Text>
                            <Text className="text-md text-gray-600 my-1">
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
