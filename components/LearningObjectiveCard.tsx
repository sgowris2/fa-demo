import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import ProgressBar from "react-native-progress-bar-horizontal";
import { Ionicons } from '@expo/vector-icons';

interface LearningObjectiveSummary {
    key: string;
    title: string;
    description: string;
    mastery_score: number;
}

const LearningObjectiveCard = ({ lo }: { lo: LearningObjectiveSummary }) => {

    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity
            className="flex-col bg-white px-4 py-3 rounded-lg mb-2"
            activeOpacity={0.9}
            onPress={() => setExpanded(!expanded)}
        >
            <View>
                <View className='flex-row items-center justify-between'>
                    <View className="flex-row items-center justify-left" style={{ width: '80%' }}>
                        <Text className="text-xl mr-8 font-bold">{lo.key}</Text>
                        <ProgressBar
                            progress={lo.mastery_score / 100}
                            borderWidth={1}
                            fillColor={(lo.mastery_score < 40 ? "#ff0000"
                                : lo.mastery_score < 60 ? "#ff8000"
                                    : lo.mastery_score < 80 ? '#f8f000'
                                        : lo.mastery_score < 90 ? '#0fff40'
                                            : 'green')}
                            unfilledColor="#F0F0F0"
                            height={15}
                            borderColor="#888888"
                            width={150}
                        />
                        <Text className="text-xl font-bold mx-4">{lo.mastery_score}%</Text>
                    </View>
                    <Ionicons name={!expanded ? ('chevron-down') : ('chevron-up')} size={18} />
                </View>
                {expanded && (
                    <View className='mt-4'>
                        <Text className='text-lg font-semibold'>{lo.title}</Text>
                        <Text className='text-lg'>{lo.description}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
};

export default LearningObjectiveCard;