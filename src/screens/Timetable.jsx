import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Navbar from "../components/Navbar";
import TimetableModal from "../components/TimetableModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from "../contexts/DataProvider";

const days = [
    { label: "จันทร์", value: "Monday" },
    { label: "อังคาร", value: "Tuesday" },
    { label: "พุธ", value: "Wednesday" },
    { label: "พฤหัสบดี", value: "Thursday" },
    { label: "ศุกร์", value: "Friday" },
];

const initialFormState = {
    code: "", name: "", room: "", day: "Monday",
    start: "", end: "", color: "#6C5CE7",
    examType: "mid", examDate: "", examTime_start: "", examTime_end: ""
};

export default function Timetable() {
    const [activeTab, setActiveTab] = useState("study");
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState(initialFormState);

    const { studyData, setStudyData, examData, setExamData } = useData()

    const [editingItem, setEditingItem] = useState(null);

    const data = activeTab === "study" ? studyData : examData;
    const displayDecimalTime = (decimalTime) => {
        if (decimalTime === "" || decimalTime === undefined) return "เลือกเวลา";
        const h = Math.floor(decimalTime);
        const m = Math.round((decimalTime - h) * 60);
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    const isTimeOverlap = (newItem) => {
        return studyData.some((item) => {
            if (item.id === newItem.id) return false;
            if (item.day !== newItem.day) return false;
            return newItem.start < item.end && newItem.end > item.start;
        });
    };

    const handleSave = () => {
        if (!form.code || !form.name) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        if (form.start >= form.end && activeTab === 'study') {
            alert("เวลาเริ่มต้องน้อยกว่าเวลาจบ");
            return;
        }
        if (activeTab !== 'study' && form.examTime_start >= form.examTime_end ) {
            alert("เวลาเริ่มต้องน้อยกว่าเวลาจบ");
            return;
        }
        const newItem = {
            ...form,
            id: editingItem ? editingItem.id : Date.now().toString(),
        };

        if (activeTab === "study") {
            if (isTimeOverlap(newItem)) {
                alert("เวลาเรียนชนกับวิชาอื่นในวันเดียวกันค่ะ");
                return;
            }
            if (editingItem) {
                setStudyData((prev) => prev.map((i) => (i.id === editingItem.id ? newItem : i)));
            } else {
                setStudyData((prev) => [...prev, newItem]);
            }
        } else {
            if (editingItem) {
                setExamData((prev) => prev.map((i) => (i.id === editingItem.id ? newItem : i)));
            } else {
                setExamData((prev) => [...prev, newItem]);
            }
        }

        closeModal();
    };

    const handleDelete = (id, type) => {
        if (type === "study") {
            setStudyData((prev) => prev.filter((i) => i.id !== id));
        } else {
            setExamData((prev) => prev.filter((i) => i.id !== id));
        }
    };

    const openModalForEdit = (item) => {
        setEditingItem(item);
        setForm(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setForm(initialFormState);
        setModalVisible(false);
    };

    const renderStudy = () =>
        days.map((day) => {
            const subjects = data.filter((s) => s.day === day.value).sort((a, b) => a.start - b.start);

            return (
                <View key={day.value} style={styles.card}>
                    <Text style={styles.dayTitle}>{day.label}</Text>
                    {subjects.length === 0 ? (
                        <Text style={styles.emptyText}>ไม่มีวิชาเรียน</Text>
                    ) : (
                        subjects.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.8}
                                style={[styles.subjectBox, { backgroundColor: item.color || "#ccc" }]}
                                onPress={() => openModalForEdit(item)}
                            >
                                <View style={styles.subjectInfo}>
                                    <Text style={styles.subjectCode}>{item.code}</Text>
                                    <Text style={styles.subjectName}>{item.name}</Text>
                                    <Text style={styles.subjectTime}>
                                        🕒 {displayDecimalTime(item.start)}- {displayDecimalTime(item.end)} | 📍 ห้อง {item.room}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(item.id, "study")} style={styles.deleteBtn}>
                                    <Text style={styles.deleteText}>ลบ</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            );
        });

    const renderExam = () => (
        <View style={styles.examContainer}>
            {data.length === 0 ? (
                <View style={styles.emptyExamCard}>
                    <Text style={styles.examIcon}>🎓</Text>
                    <Text style={styles.examTitle}>ยังไม่มีตารางสอบ</Text>
                    <Text style={styles.examSub}>คลิกปุ่ม "+ เพิ่มข้อมูล" ด้านบนเพื่อเริ่มต้น</Text>
                </View>
            ) : (
                data.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        style={styles.examItemCard}
                        onPress={() => openModalForEdit(item)}
                    >
                        <View style={[styles.examTypeTag, item.examType === "mid" ? styles.midTag : styles.finalTag]}>
                            <Text style={styles.tagText}>{item.examType === "mid" ? "Midterm" : "Final"}</Text>
                        </View>
                        <Text style={styles.examCourseCode}>{item.code} {item.name}</Text>
                        <Text style={styles.examDetails}>📅 {item.examDate} | 🕒 {item.examTime}</Text>
                        <Text style={styles.examDetails}>📍 ห้องสอบ: {item.room}</Text>

                        <TouchableOpacity onPress={() => handleDelete(item.id, "exam")} style={styles.deleteExamBtn}>
                            <Text style={styles.deleteText}>ลบการสอบ</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Navbar />

            <View style={styles.headerRow}>
                <Text style={styles.header}>ตารางเรียนและสอบ</Text>
                <TouchableOpacity
                    style={[styles.addBtn, activeTab === "study" ? styles.studyBtn : styles.examBtn]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addBtnText}>+ เพิ่มข้อมูล</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "study" && styles.activeTab]}
                    onPress={() => setActiveTab("study")}
                >
                    <Text style={[styles.tabText, activeTab === "study" && styles.activeTabText]}>📖 ตารางเรียน</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "exam" && styles.activeTab]}
                    onPress={() => setActiveTab("exam")}
                >
                    <Text style={[styles.tabText, activeTab === "exam" && styles.activeTabText]}>🎓 ตารางสอบ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {activeTab === "study" ? renderStudy() : renderExam()}
                <View style={{ height: 40 }} />
            </ScrollView>

            <TimetableModal
                visible={modalVisible}
                onClose={closeModal}
                activeTab={activeTab}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                isEditing={!!editingItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f9",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginVertical: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2d3436",
    },
    addBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    studyBtn: { backgroundColor: "#6C5CE7" },
    examBtn: { backgroundColor: "#FF6B00" },
    addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#dfe6e9",
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        color: "#636e72",
        fontWeight: "600",
    },
    activeTabText: {
        color: "#2d3436",
    },
    contentScroll: {
        flex: 1,
    },
    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    dayTitle: {
        fontWeight: "700",
        fontSize: 16,
        color: "#2d3436",
        marginBottom: 12,
    },
    emptyText: {
        color: "#b2bec3",
        textAlign: "center",
        paddingVertical: 10,
        fontStyle: "italic",
    },
    subjectBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectCode: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    subjectName: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 14,
        marginBottom: 6,
    },
    subjectTime: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
    },
    deleteBtn: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    deleteText: {
        color: "#ffffff",
        fontWeight: "600",
        fontSize: 12,
    },
    examContainer: {
        paddingHorizontal: 20,
    },
    emptyExamCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    examIcon: { fontSize: 48, marginBottom: 12 },
    examTitle: { fontWeight: "bold", fontSize: 18, color: "#2d3436", marginBottom: 8 },
    examSub: { color: "#636e72", textAlign: "center" },
    examItemCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: "#FF6B00",
    },
    examTypeTag: {
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    midTag: { backgroundColor: "#ffeaa7" },
    finalTag: { backgroundColor: "#fab1a0" },
    tagText: { fontSize: 10, fontWeight: "bold", color: "#2d3436" },
    examCourseCode: { fontWeight: "bold", fontSize: 16, color: "#2d3436", marginBottom: 4 },
    examDetails: { fontSize: 14, color: "#636e72", marginBottom: 2 },
    deleteExamBtn: {
        marginTop: 12,
        alignSelf: "flex-end",
        backgroundColor: "#ff7675",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
});