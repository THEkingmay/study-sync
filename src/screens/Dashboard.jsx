import React, { useState, useEffect } from 'react';
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
    const { studyData, examData, profileData } = useData();

    const now = new Date();
    const hour = now.getHours();

    let greeting = "";
    if (hour < 12) greeting = "สวัสดีตอนเช้า";
    else if (hour < 17) greeting = "สวัสดีตอนบ่าย";
    else if (hour < 19) greeting = "สวัสดีตอนเย็น";
    else greeting = "สวัสดีตอนกลางคืน";

    const daysTH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysTH[now.getDay()];

    const formattedDate = now.toLocaleDateString("th-TH", {
        day: "numeric", month: "long", year: "numeric"
    });
    const formattedTime = now.toLocaleTimeString("th-TH", {
        hour: '2-digit', minute: '2-digit'
    });
    const getNextClass = () => {
        if (!studyData || studyData.length === 0) return null;

        const currentDayIndex = now.getDay();
        // แปลงเวลาปัจจุบันเป็นทศนิยม เช่น 10:30 -> 10.5
        const currentTimeDecimal = now.getHours() + (now.getMinutes() / 60);

        // คำนวณระยะห่างของวันสำหรับทุกรายวิชา
        const upcomingClasses = studyData.map(cls => {
            const classDayIndex = daysOfWeek.indexOf(cls.day);
            let daysAhead = classDayIndex - currentDayIndex;

            // ถ้าน้อยกว่า 0 แปลว่าเป็นวันของสัปดาห์หน้า (เช่น วันนี้วันอังคาร คลาสเรียนวันจันทร์)
            if (daysAhead < 0) {
                daysAhead += 7;
            }
            // ถ้าเป็นวันเดียวกัน แต่เวลาเริ่มเรียนน้อยกว่าหรือเท่ากับเวลาปัจจุบัน แปลว่าคลาสนี้ผ่านไปแล้ว ให้ปัดไปสัปดาห์หน้า
            else if (daysAhead === 0 && Number(cls.start) <= currentTimeDecimal) {
                daysAhead += 7;
            }

            return { ...cls, daysAhead };
        });

        // เรียงลำดับตามความใกล้ของวัน (daysAhead) ก่อน แล้วค่อยเรียงตามเวลาเริ่ม (start)
        upcomingClasses.sort((a, b) => {
            if (a.daysAhead !== b.daysAhead) {
                return a.daysAhead - b.daysAhead;
            }
            return Number(a.start) - Number(b.start);
        });

        // คืนค่าคลาสที่ใกล้ที่สุด
        return upcomingClasses[0] || null;
    };
    const nextClass = getNextClass();

    const getExam = () =>{
        
    }

    return (
        <>
            <QuickAddModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
            <SafeAreaView style={styles.safeArea}>
                <Navbar />
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerSection}>
                        <View>
                            <Text style={styles.welcomeText}>
                                {greeting} วัน{dayName}
                                {greeting} {profileData.fullname || "นิสิต"} 👋
                            </Text>
                            <Text>{formattedDate}</Text>
                            <Text>เวลาล่าสุด {formattedTime}</Text>
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

                    <View style={styles.card}>
                        <View style={[styles.cardHeader, { backgroundColor: '#f5f6ff' }]}>
                            <Feather name="clock" size={18} color="#5e6ad2" />
                            <Text style={[styles.headerText, { color: '#5e6ad2' }]}>คาบเรียนถัดไป</Text>
                        </View>

                        {nextClass ? (
                            <View style={[styles.cardBody, { alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 24 }]}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 }}>
                                    {nextClass.code} , {nextClass.name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Feather name="map-pin" size={14} color="#666" style={{ marginRight: 6 }} />
                                    <Text style={{ color: '#666', fontSize: 14 }}>ห้อง: {nextClass.room}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Feather name="calendar" size={14} color="#666" style={{ marginRight: 6 }} />
                                    <Text style={{ color: '#666', fontSize: 14 }}>
                                        วัน: {daysTH[daysOfWeek.findIndex(d => d === nextClass.day)]} เวลา: {nextClass.start} - {nextClass.end}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.cardBody}>
                                <Feather name="book-open" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                                <Text style={styles.emptyText}>ไม่มีคาบเรียนถัดไป</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('timetable')}>
                                    <Text style={styles.actionText}>เพิ่มตารางเรียน</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <View style={[styles.cardHeader, { backgroundColor: '#fff5f0' }]}>
                            <Ionicons name="alert-circle-outline" size={20} color="#c67c52" />
                            <Text style={[styles.headerText, { color: '#c67c52' }]}>สอบที่ใกล้จะถึง (7 วันข้างหน้า)</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Ionicons name="alert-circle-outline" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                            <Text style={styles.emptyText}>ไม่มีการสอบในช่วง 7 วันข้างหน้า</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('timetable')}>
                                <Text style={styles.actionText}>เพิ่มตารางสอบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>

    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fbfbfb',
    },
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 100,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    welcomeText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    dashboardTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    quickAddBtn: {
        backgroundColor: '#1a1a1a',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quickAddText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
    cardBody: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        textDecorationLine: 'underline',
    },
});