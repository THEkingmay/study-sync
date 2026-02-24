import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { QuickAddModal } from '../components/QuickAdd';
import { useData } from '../contexts/DataProvider';

export default function DashboardScreen() {

    const navigation = useNavigation();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const { studyData, examData } = useData();

    const getNextStudy = () => {

        if (!studyData || studyData.length === 0) return null;

        const now = new Date();
        const today = now.getDay();

        const dayMap = {
            "จันทร์": 1,
            "อังคาร": 2,
            "พุธ": 3,
            "พฤหัสบดี": 4,
            "ศุกร์": 5,
        };

        const upcoming = studyData.map(subject => {

            const subjectDay = dayMap[subject.day];
            if (subjectDay === undefined) return null;

            const nextDate = new Date();

            const diff = (subjectDay - today + 7) % 7;
            nextDate.setDate(now.getDate() + diff);

            if (!subject.start) return null;

            const [hour, minute] = subject.start.split(":");
            nextDate.setHours(parseInt(hour));
            nextDate.setMinutes(parseInt(minute));
            nextDate.setSeconds(0);

            return { ...subject, nextDate };

        }).filter(item => item && item.nextDate > now);

        if (upcoming.length === 0) return null;

        upcoming.sort((a, b) => a.nextDate - b.nextDate);

        return upcoming[0];
    };

    const getUpcomingExam7Days = () => {

        if (!examData || examData.length === 0) return null;

        const now = new Date();
        const next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);

        const upcoming = examData.map(exam => {

            if (!exam.examDate || !exam.examTime) return null;

            const examDateTime = new Date(`${exam.examDate}T${exam.examTime}`);

            return { ...exam, examDateTime };

        }).filter(item =>
            item &&
            item.examDateTime >= now &&
            item.examDateTime <= next7Days
        );

        if (upcoming.length === 0) return null;

        upcoming.sort((a, b) => a.examDateTime - b.examDateTime);

        return upcoming[0];
    };

    const nextStudy = getNextStudy();
    const nextExam = getUpcomingExam7Days();

    return (
        <>
            <QuickAddModal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
            />

            <SafeAreaView style={styles.safeArea}>
                <Navbar />

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.headerSection}>
                        <View>
                            <Text style={styles.welcomeText}>สวัสดี 👋</Text>
                            <Text style={styles.dashboardTitle}>Dashboard</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.quickAddBtn}
                            onPress={() => setIsOpenModal(true)}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.quickAddText}>Quick Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ===================== */}
                    {/* คาบเรียนถัดไป */}
                    {/* ===================== */}
                    <View style={styles.card}>

                        <View style={[styles.cardHeader, { backgroundColor: '#f5f6ff' }]}>
                            <Feather name="clock" size={18} color="#5e6ad2" />
                            <Text style={[styles.headerText, { color: '#5e6ad2' }]}>
                                คาบเรียนถัดไป
                            </Text>
                        </View>

                        <View style={styles.cardBody}>
                            {nextStudy ? (
                                <>
                                    <Text style={{ fontSize: 18, fontWeight: '700' }}>
                                        {nextStudy.code} {nextStudy.name}
                                    </Text>
                                    <Text style={{ marginTop: 6 }}>
                                        🕒 {nextStudy.start} - {nextStudy.end}
                                    </Text>
                                    <Text style={{ marginTop: 4 }}>
                                        📍 ห้อง {nextStudy.room}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Feather name="book-open" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                                    <Text style={styles.emptyText}>ไม่มีคาบเรียนถัดไป</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('timetable')}>
                                        <Text style={styles.actionText}>เพิ่มตารางเรียน</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* ===================== */}
                    {/* สอบ 7 วันข้างหน้า */}
                    {/* ===================== */}
                    <View style={styles.card}>

                        <View style={[styles.cardHeader, { backgroundColor: '#fff5f0' }]}>
                            <Ionicons name="alert-circle-outline" size={20} color="#c67c52" />
                            <Text style={[styles.headerText, { color: '#c67c52' }]}>
                                สอบที่ใกล้จะถึง (7 วันข้างหน้า)
                            </Text>
                        </View>

                        <View style={styles.cardBody}>
                            {nextExam ? (
                                <>
                                    <Text style={{ fontSize: 18, fontWeight: '700' }}>
                                        {nextExam.code} {nextExam.name}
                                    </Text>
                                    <Text style={{ marginTop: 6 }}>
                                        📅 {nextExam.examDate}
                                    </Text>
                                    <Text style={{ marginTop: 4 }}>
                                        🕒 {nextExam.examTime}
                                    </Text>
                                    <Text style={{ marginTop: 4 }}>
                                        📍 ห้องสอบ {nextExam.room}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="alert-circle-outline" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                                    <Text style={styles.emptyText}>
                                        ไม่มีการสอบในช่วง 7 วันข้างหน้า
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('timetable')}>
                                        <Text style={styles.actionText}>เพิ่มตารางสอบ</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fbfbfb' },
    container: { flex: 1, padding: 16, paddingBottom: 100 },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    welcomeText: { fontSize: 14, color: '#888', fontWeight: '500' },
    dashboardTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a1a' },
    quickAddBtn: {
        backgroundColor: '#1a1a1a',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        elevation: 3,
    },
    quickAddText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 4 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerText: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
    cardBody: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: { fontSize: 14, color: '#999', marginBottom: 8 },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        textDecorationLine: 'underline',
    },
});