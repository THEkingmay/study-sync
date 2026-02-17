import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

const StatusCard = ({ 
    themeColor, 
    headerBgColor, 
    headerIcon, 
    title, 
    bodyIcon, 
    emptyText, 
    actionText 
}) => {
    return (
        <View style={styles.card}>
            <View style={[styles.header, { backgroundColor: headerBgColor }]}>
                <Ionicons name={headerIcon} size={18} color={themeColor} />
                <Text style={[styles.headerTitle, { color: themeColor }]}>{title}</Text>
            </View>
            
            <View style={styles.body}>
                <Feather name={bodyIcon} size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>{emptyText}</Text>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function DashboardScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Navbar />
            <View style={styles.container}>
                <StatusCard
                    themeColor="#5B21B6"
                    headerBgColor="#F5F3FF"
                    headerIcon="time-outline"
                    title="คาบเรียนถัดไป"
                    bodyIcon="book-open"
                    emptyText="ไม่มีคาบเรียนถัดไป"
                    actionText="เพิ่มตารางเรียน"
                />

                <StatusCard
                    themeColor="#9A3412"
                    headerBgColor="#FFF7ED"
                    headerIcon="alert-circle-outline"
                    title="สอบที่ใกล้จะถึง (7 วันข้างหน้า)"
                    bodyIcon="alert-circle"
                    emptyText="ไม่มีการสอบในช่วง 7 วันข้างหน้า"
                    actionText="เพิ่มตารางสอบ"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF0F5',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 8,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 4,
    },
});