import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={26} color="#FFFFFF" />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>StudySync</Text>
                <Text style={styles.subtitle}>Academic Life Planner</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 6, 
    },
    textContainer: {
        marginLeft: 14,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#8B5CF6',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        marginTop: -2,
    }
});